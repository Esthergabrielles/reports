import React from 'react';
import { ReportTemplate } from '../types';
import { reportTemplates } from '../data/templates';
import { BarChart3, PieChart, TrendingUp, FileSpreadsheet } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: ReportTemplate | null;
  onTemplateSelect: (template: ReportTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect
}) => {
  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar': return <BarChart3 className="w-4 h-4" />;
      case 'pie': 
      case 'doughnut': return <PieChart className="w-4 h-4" />;
      case 'line': return <TrendingUp className="w-4 h-4" />;
      default: return <FileSpreadsheet className="w-4 h-4" />;
    }
  };

  const getSectorColor = (sector: string) => {
    const colors: { [key: string]: string } = {
      'Comercial': 'bg-blue-100 text-blue-800',
      'Financeiro': 'bg-green-100 text-green-800',
      'Recursos Humanos': 'bg-purple-100 text-purple-800',
      'Marketing': 'bg-orange-100 text-orange-800',
      'Operações': 'bg-red-100 text-red-800'
    };
    return colors[sector] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Escolha um Template de Relatório
        </h3>
        <p className="text-gray-600">
          Selecione o template que melhor se adequa ao seu tipo de dados e setor
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTemplates.map((template) => (
          <div
            key={template.id}
            className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onTemplateSelect(template)}
          >
            {/* Header with color */}
            <div
              className="h-24 rounded-t-lg flex items-center justify-center"
              style={{ backgroundColor: template.color }}
            >
              <BarChart3 className="w-12 h-12 text-white" />
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900 text-lg">
                  {template.name}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getSectorColor(template.sector)}`}>
                  {template.sector}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {template.description}
              </p>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    GRÁFICOS INCLUSOS:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.charts.map((chart, index) => (
                      <div
                        key={index}
                        className="flex items-center px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700"
                      >
                        {getChartIcon(chart.type)}
                        <span className="ml-1 capitalize">{chart.type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    LAYOUT:
                  </p>
                  <span className="text-xs text-gray-600 capitalize">
                    {template.layout}
                  </span>
                </div>
              </div>

              {selectedTemplate?.id === template.id && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Template Selecionado</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            Template Selecionado: {selectedTemplate.name}
          </h4>
          <p className="text-blue-700 text-sm">
            Este template gerará {selectedTemplate.charts.length} visualizações 
            otimizadas para o setor {selectedTemplate.sector.toLowerCase()}.
          </p>
        </div>
      )}
    </div>
  );
};