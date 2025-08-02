import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { SpreadsheetData } from '../types';

export class FileProcessor {
  static async processFile(file: File): Promise<SpreadsheetData> {
    const fileType = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (!['xlsx', 'xls', 'csv'].includes(fileType)) {
      throw new Error('Formato de arquivo não suportado. Use .xlsx, .xls ou .csv');
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      throw new Error('Arquivo muito grande. Limite máximo: 50MB');
    }

    try {
      if (fileType === 'csv') {
        return await this.processCSV(file);
      } else {
        return await this.processExcel(file);
      }
    } catch (error) {
      throw new Error(`Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  private static async processCSV(file: File): Promise<SpreadsheetData> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error('Erro ao processar CSV: ' + results.errors[0].message));
            return;
          }

          const data = results.data as string[][];
          if (data.length === 0) {
            reject(new Error('Arquivo CSV vazio'));
            return;
          }

          const headers = data[0];
          const rows = data.slice(1);

          resolve({
            headers,
            rows,
            fileName: file.name,
            fileType: 'csv',
            totalRows: rows.length,
            totalColumns: headers.length
          });
        },
        error: (error) => {
          reject(new Error('Erro ao processar CSV: ' + error.message));
        }
      });
    });
  }

  private static async processExcel(file: File): Promise<SpreadsheetData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          if (jsonData.length === 0) {
            reject(new Error('Planilha vazia'));
            return;
          }

          const headers = jsonData[0].map((header: any) => String(header || '').trim());
          const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));

          resolve({
            headers,
            rows,
            fileName: file.name,
            fileType: file.name.split('.').pop()?.toLowerCase() || 'xlsx',
            totalRows: rows.length,
            totalColumns: headers.length
          });
        } catch (error) {
          reject(new Error('Erro ao processar Excel: ' + (error instanceof Error ? error.message : 'Erro desconhecido')));
        }
      };

      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  static detectDataTypes(data: SpreadsheetData): { [key: string]: 'number' | 'text' | 'date' | 'currency' } {
    const types: { [key: string]: 'number' | 'text' | 'date' | 'currency' } = {};
    
    data.headers.forEach((header, index) => {
      const sample = data.rows.slice(0, 10).map(row => row[index]).filter(val => val !== null && val !== undefined && val !== '');
      
      if (sample.length === 0) {
        types[header] = 'text';
        return;
      }

      // Check for currency
      if (sample.some(val => String(val).match(/^[R$€£¥]\s*[\d,.]+(,\d{2})?$/))) {
        types[header] = 'currency';
        return;
      }

      // Check for numbers
      if (sample.every(val => !isNaN(Number(val)) && val !== '')) {
        types[header] = 'number';
        return;
      }

      // Check for dates
      if (sample.some(val => !isNaN(Date.parse(String(val))))) {
        types[header] = 'date';
        return;
      }

      types[header] = 'text';
    });

    return types;
  }

  static suggestCharts(data: SpreadsheetData): ChartConfig[] {
    const dataTypes = this.detectDataTypes(data);
    const suggestions: ChartConfig[] = [];
    
    const numericColumns = Object.entries(dataTypes)
      .filter(([_, type]) => type === 'number' || type === 'currency')
      .map(([header]) => header);
    
    const textColumns = Object.entries(dataTypes)
      .filter(([_, type]) => type === 'text')
      .map(([header]) => header);

    if (numericColumns.length > 0 && textColumns.length > 0) {
      // Bar chart suggestion
      suggestions.push({
        type: 'bar',
        title: `${numericColumns[0]} por ${textColumns[0]}`,
        xAxis: textColumns[0],
        yAxis: numericColumns[0],
        data: this.prepareChartData(data, textColumns[0], numericColumns[0])
      });

      // Pie chart for categorical data
      if (textColumns.length > 0) {
        suggestions.push({
          type: 'pie',
          title: `Distribuição por ${textColumns[0]}`,
          xAxis: textColumns[0],
          yAxis: numericColumns[0],
          data: this.prepareChartData(data, textColumns[0], numericColumns[0])
        });
      }
    }

    if (numericColumns.length >= 2) {
      // Line chart for trends
      suggestions.push({
        type: 'line',
        title: `Tendência de ${numericColumns[0]}`,
        xAxis: data.headers[0],
        yAxis: numericColumns[0],
        data: this.prepareChartData(data, data.headers[0], numericColumns[0])
      });
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  private static prepareChartData(data: SpreadsheetData, xColumn: string, yColumn: string): any[] {
    const xIndex = data.headers.indexOf(xColumn);
    const yIndex = data.headers.indexOf(yColumn);
    
    if (xIndex === -1 || yIndex === -1) return [];

    const chartData = data.rows
      .filter(row => row[xIndex] && row[yIndex])
      .map(row => ({
        x: row[xIndex],
        y: Number(row[yIndex]) || 0
      }))
      .slice(0, 20); // Limit to 20 data points for performance

    return chartData;
  }
}