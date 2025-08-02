import React, { useState, useRef } from 'react';
import { SpreadsheetData, ReportTemplate, CompanyBranding } from '../types';
import { ChartRenderer } from './ChartRenderer';
import { FileProcessor } from '../utils/fileProcessor';
import { ReportGenerator as ReportGen } from '../utils/reportGenerator';
import { Download, FileText, Globe, Settings, Eye, Loader } from 'lucide-react';

interface ReportGeneratorProps {
  data: SpreadsheetData;
  template: ReportTemplate;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ data, template }) => {
  const [branding, setBranding] = useState<CompanyBranding>({
    primaryColor: template.color,
    secondaryColor: '#6B7280',
    companyName: 'Sua Empresa',
    reportTitle: `Relatório ${template.name}`
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const chartsRef = useRef<HTMLDivElement>(null);

  // Generate charts based on template and data
  const generateCharts = () => {
    const suggestions = FileProcessor.suggestCharts(data);
    
    return template.charts.map((chartConfig, index) => {
      const suggestion = suggestions[index];
      if (suggestion) {
        return {
          ...chartConfig,
          data: suggestion.data,
          xAxis: suggestion.xAxis,
          yAxis: suggestion.yAxis
        };
      }
      
      // Fallback: use first numeric and text columns
      const dataTypes = FileProcessor.detectDataTypes(data);
      const numericColumns = Object.entries(dataTypes)
        .filter(([_, type]) => type === 'number' || type === 'currency')
        .map(([header]) => header);
      const textColumns = Object.entries(dataTypes)
        .filter(([_, type]) => type === 'text')
        .map(([header]) => header);

      if (numericColumns.length > 0 && textColumns.length > 0) {
        return {
          ...chartConfig,
          data: FileProcessor.suggestCharts(data)[0]?.data || [],
          xAxis: textColumns[0],
          yAxis: numericColumns[0]
        };
      }

      return chartConfig;
    });
  };

  const charts = generateCharts();

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const chartElements = chartsRef.current?.querySelectorAll('.chart-container') as NodeListOf<HTMLElement>;
      const pdf = await ReportGen.generatePDF(data, template, branding, Array.from(chartElements));
      await ReportGen.downloadFile(pdf, `${template.name.toLowerCase().replace(/\s+/g, '-')}-report.pdf`, 'application/pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadHTML = async () => {
    setIsGenerating(true);
    try {
      const chartsHTML = charts.map((chart, index) => 
        `<div class="chart-placeholder" style="height: 300px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 20px 0;">
          <div style="text-align: center; color: #6b7280;">
            <h3>${chart.title}</h3>
            <p>Gráfico ${chart.type} - ${chart.data.length} pontos de dados</p>
          </div>
        </div>`
      ).join('');
      
      const html = ReportGen.generateHTML(data, template, branding, chartsHTML);
      await ReportGen.downloadFile(html, `${template.name.toLowerCase().replace(/\s+/g, '-')}-report.html`, 'text/html');
    } catch (error) {
      console.error('Erro ao gerar HTML:', error);
      alert('Erro ao gerar HTML. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPowerBI = async () => {
    try {
      const connectionFile = ReportGen.generatePowerBIConnection(data);
      await ReportGen.downloadFile(connectionFile, `${data.fileName.split('.')[0]}-powerbi.pbids`, 'application/json');
    } catch (error) {
      console.error('Erro ao gerar arquivo Power BI:', error);
      alert('Erro ao gerar arquivo Power BI. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Branding Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Personalização do Relatório</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Empresa
            </label>
            <input
              type="text"
              value={branding.companyName}
              onChange={(e) => setBranding(prev => ({ ...prev, companyName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o nome da empresa"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Relatório
            </label>
            <input
              type="text"
              value={branding.reportTitle}
              onChange={(e) => setBranding(prev => ({ ...prev, reportTitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o título do relatório"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor Primária
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={branding.primaryColor}
                onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#3B82F6"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor Secundária
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={branding.secondaryColor}
                onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={branding.secondaryColor}
                onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#6B7280"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? 'Ocultar Preview' : 'Visualizar Preview'}
        </button>
        
        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
          Baixar PDF
        </button>
        
        <button
          onClick={handleDownloadHTML}
          disabled={isGenerating}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
          Baixar HTML
        </button>
        
        <button
          onClick={handleDownloadPowerBI}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Power BI (.pbids)
        </button>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div 
              className="p-6 rounded-lg text-white"
              style={{ background: `linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor})` }}
            >
              <h1 className="text-3xl font-bold mb-2">{branding.reportTitle}</h1>
              <p className="text-lg opacity-90">{branding.companyName}</p>
              <p className="text-sm opacity-75">
                Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Resumo dos Dados</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Arquivo:</strong> {data.fileName}</p>
                <p><strong>Registros:</strong> {data.totalRows.toLocaleString()}</p>
                <p><strong>Colunas:</strong> {data.totalColumns}</p>
                <p><strong>Template:</strong> {template.name}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Visualizações</h3>
              <div className="space-y-2 text-sm">
                {charts.map((chart, index) => (
                  <p key={index}>
                    <strong>{chart.type.toUpperCase()}:</strong> {chart.title}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div ref={chartsRef} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Gráficos e Visualizações</h3>
            <div className={`grid gap-6 ${
              template.layout === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
            }`}>
              {charts.map((chart, index) => (
                <div key={index} className="chart-container">
                  <ChartRenderer config={chart} color={branding.primaryColor} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};