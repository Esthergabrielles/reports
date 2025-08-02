import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SpreadsheetData, ReportTemplate, CompanyBranding } from '../types';

export class ReportGenerator {
  static async generatePDF(
    data: SpreadsheetData,
    template: ReportTemplate,
    branding: CompanyBranding,
    chartElements: HTMLElement[]
  ): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add header
    pdf.setFontSize(20);
    pdf.setTextColor(branding.primaryColor);
    pdf.text(branding.reportTitle || 'Relatório Corporativo', 20, 30);
    
    pdf.setFontSize(12);
    pdf.setTextColor('#666666');
    pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 40);
    pdf.text(`Fonte: ${data.fileName}`, 20, 50);
    
    // Add company info
    if (branding.companyName) {
      pdf.setFontSize(14);
      pdf.setTextColor('#333333');
      pdf.text(branding.companyName, 20, 65);
    }

    let yPosition = 80;

    // Add summary
    pdf.setFontSize(16);
    pdf.setTextColor('#333333');
    pdf.text('Resumo dos Dados', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.text(`Total de registros: ${data.totalRows}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Colunas: ${data.totalColumns}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Template: ${template.name}`, 20, yPosition);
    yPosition += 20;

    // Add charts
    for (let i = 0; i < chartElements.length; i++) {
      const element = chartElements[i];
      
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 30;
      }

      try {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 20;
      } catch (error) {
        console.error('Erro ao capturar gráfico:', error);
      }
    }

    // Add data table (first 10 rows)
    if (yPosition > pageHeight - 150) {
      pdf.addPage();
      yPosition = 30;
    }

    pdf.setFontSize(16);
    pdf.text('Amostra dos Dados', 20, yPosition);
    yPosition += 15;

    // Table headers
    pdf.setFontSize(10);
    let xPosition = 20;
    const columnWidth = (pageWidth - 40) / Math.min(data.headers.length, 4);
    
    data.headers.slice(0, 4).forEach(header => {
      pdf.setFont(undefined, 'bold');
      pdf.text(header.substring(0, 15), xPosition, yPosition);
      xPosition += columnWidth;
    });
    yPosition += 8;

    // Table rows
    pdf.setFont(undefined, 'normal');
    data.rows.slice(0, 10).forEach(row => {
      xPosition = 20;
      row.slice(0, 4).forEach(cell => {
        const cellText = String(cell || '').substring(0, 15);
        pdf.text(cellText, xPosition, yPosition);
        xPosition += columnWidth;
      });
      yPosition += 6;
    });

    return pdf.output('blob');
  }

  static generateHTML(
    data: SpreadsheetData,
    template: ReportTemplate,
    branding: CompanyBranding,
    chartsHTML: string
  ): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${branding.reportTitle || 'Relatório Corporativo'}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        .header {
            background: linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor});
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .summary {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .summary h2 {
            color: ${branding.primaryColor};
            margin-top: 0;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid ${branding.primaryColor};
        }
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: ${branding.primaryColor};
        }
        .charts-section {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .charts-section h2 {
            color: ${branding.primaryColor};
            margin-top: 0;
        }
        .data-table {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow-x: auto;
        }
        .data-table h2 {
            color: ${branding.primaryColor};
            margin-top: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: ${branding.primaryColor};
            color: white;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #666;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${branding.reportTitle || 'Relatório Corporativo'}</h1>
        <p>${branding.companyName || ''}</p>
        <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
    </div>

    <div class="summary">
        <h2>Resumo dos Dados</h2>
        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${data.totalRows.toLocaleString()}</div>
                <div>Total de Registros</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.totalColumns}</div>
                <div>Colunas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${template.name}</div>
                <div>Template Utilizado</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.fileName}</div>
                <div>Arquivo Fonte</div>
            </div>
        </div>
    </div>

    <div class="charts-section">
        <h2>Visualizações</h2>
        ${chartsHTML}
    </div>

    <div class="data-table">
        <h2>Amostra dos Dados</h2>
        <table>
            <thead>
                <tr>
                    ${data.headers.map(header => `<th>${header}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${data.rows.slice(0, 20).map(row => 
                    `<tr>${row.map(cell => `<td>${cell || ''}</td>`).join('')}</tr>`
                ).join('')}
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Relatório gerado automaticamente pelo Sistema de Conversão de Planilhas</p>
        <p>© ${new Date().getFullYear()} ${branding.companyName || 'Sua Empresa'}</p>
    </div>
</body>
</html>`;
  }

  static generatePowerBIConnection(data: SpreadsheetData): string {
    // Generate a basic Power BI connection file (.pbids)
    const connectionData = {
      version: "0.1",
      connections: [
        {
          details: {
            protocol: "file",
            address: {
              path: data.fileName
            }
          },
          options: {},
          mode: "Import"
        }
      ]
    };

    return JSON.stringify(connectionData, null, 2);
  }

  static async downloadFile(content: string | Blob, filename: string, type: string) {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}