import React, { useState, useEffect } from 'react';
import { SpreadsheetData, ReportTemplate, DataAnalysis, Insight, Recommendation, ExecutiveReport as IExecutiveReport } from '../types';
import { DataAnalyzer } from '../utils/dataAnalyzer';
import { ChartRenderer } from './ChartRenderer';
import { FileProcessor } from '../utils/fileProcessor';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  Clock, 
  Users, 
  BarChart3,
  FileText,
  Lightbulb,
  Star,
  ArrowRight,
  Download
} from 'lucide-react';

interface ExecutiveReportProps {
  data: SpreadsheetData;
  template: ReportTemplate;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
    reportTitle: string;
  };
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({ data, template, branding }) => {
  const [analysis, setAnalysis] = useState<DataAnalysis | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'summary' | 'analysis' | 'insights' | 'recommendations'>('summary');

  useEffect(() => {
    const dataAnalysis = DataAnalyzer.analyzeData(data);
    const generatedInsights = DataAnalyzer.generateInsights(data, dataAnalysis);
    const generatedRecommendations = DataAnalyzer.generateRecommendations(data, dataAnalysis, generatedInsights);
    
    setAnalysis(dataAnalysis);
    setInsights(generatedInsights);
    setRecommendations(generatedRecommendations);
  }, [data]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-green-700 bg-green-100 border-green-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      case 'opportunity': return <Lightbulb className="w-4 h-4" />;
      case 'risk': return <AlertTriangle className="w-4 h-4" />;
      case 'trend': return <BarChart3 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return '🚨';
      case 'short-term': return '⚡';
      case 'medium-term': return '📅';
      case 'long-term': return '🎯';
      default: return '📋';
    }
  };

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analisando dados e gerando insights...</p>
        </div>
      </div>
    );
  }

  const charts = FileProcessor.suggestCharts(data);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div 
        className="rounded-lg p-8 text-white"
        style={{ background: `linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor})` }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{branding.reportTitle}</h1>
            <p className="text-xl opacity-90">{branding.companyName}</p>
            <p className="text-sm opacity-75 mt-2">
              Relatório Executivo • {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-2xl font-bold">{analysis.summary.dataQuality}%</div>
              <div className="text-sm opacity-90">Qualidade dos Dados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'summary', name: 'Sumário Executivo', icon: FileText },
              { id: 'analysis', name: 'Análise Detalhada', icon: BarChart3 },
              { id: 'insights', name: 'Insights Principais', icon: Lightbulb },
              { id: 'recommendations', name: 'Recomendações', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Sumário Executivo */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sumário Executivo</h2>
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Este relatório apresenta uma análise abrangente de <strong>{data.totalRows.toLocaleString()} registros</strong> 
                    coletados de <strong>{data.fileName}</strong>, utilizando o template <strong>{template.name}</strong> 
                    otimizado para o setor {template.sector.toLowerCase()}.
                  </p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Total de Registros</p>
                      <p className="text-2xl font-bold text-blue-900">{data.totalRows.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Qualidade dos Dados</p>
                      <p className="text-2xl font-bold text-green-900">{analysis.summary.dataQuality}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Lightbulb className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">Insights Gerados</p>
                      <p className="text-2xl font-bold text-purple-900">{insights.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Target className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-orange-600">Recomendações</p>
                      <p className="text-2xl font-bold text-orange-900">{recommendations.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Insights Preview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Principais Descobertas</h3>
                <div className="space-y-3">
                  {insights.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg mr-4 ${getImpactColor(insight.impact)}`}>
                        {getCategoryIcon(insight.category)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-gray-500">Confiança: {insight.confidence}%</span>
                          <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getImpactColor(insight.impact)}`}>
                            {insight.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Methodology */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Metodologia</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Fonte dos Dados</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Arquivo: {data.fileName}</li>
                        <li>• Formato: {data.fileType.toUpperCase()}</li>
                        <li>• Registros: {data.totalRows.toLocaleString()}</li>
                        <li>• Campos: {data.totalColumns}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Técnicas Aplicadas</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Análise de qualidade de dados</li>
                        <li>• Detecção de correlações</li>
                        <li>• Identificação de outliers</li>
                        <li>• Análise de tendências</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Análise Detalhada */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Análise Detalhada</h2>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {charts.slice(0, 4).map((chart, index) => (
                  <ChartRenderer key={index} config={chart} color={branding.primaryColor} />
                ))}
              </div>

              {/* Correlations */}
              {analysis.patterns.correlations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Correlações Identificadas</h3>
                  <div className="space-y-3">
                    {analysis.patterns.correlations.map((corr, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {corr.variables.join(' ↔ ')}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Força da correlação: {(corr.strength * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              {(corr.strength * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              Significância: {(corr.significance * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Forecasts */}
              {analysis.forecasts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Previsões</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.forecasts.map((forecast, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">{forecast.metric}</h4>
                        <div className="space-y-2">
                          {forecast.predictions.map((pred, predIndex) => (
                            <div key={predIndex} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{pred.period}</span>
                              <div className="text-right">
                                <div className="font-medium">{pred.value.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">
                                  {(pred.confidence * 100).toFixed(0)}% confiança
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Insights */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Insights Principais</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {insights.map((insight) => (
                  <div key={insight.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`p-3 rounded-lg mr-4 ${getImpactColor(insight.impact)}`}>
                          {getCategoryIcon(insight.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getImpactColor(insight.impact)}`}>
                              {insight.impact}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-4">{insight.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Categoria: {insight.category}</span>
                            <span>Confiança: {insight.confidence}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(insight.confidence / 20)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendações */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Recomendações Estratégicas</h2>
              
              <div className="space-y-6">
                {recommendations.map((rec) => (
                  <div key={rec.id} className={`border-l-4 rounded-lg p-6 bg-white shadow-sm ${getPriorityColor(rec.priority)}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-3">{getTimeframeIcon(rec.timeframe)}</span>
                          <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                        </div>
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(rec.priority)}`}>
                            {rec.priority}
                          </span>
                          <span className="text-sm text-gray-600">{rec.timeframe}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{rec.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Impacto Esperado</h4>
                        <p className="text-sm text-gray-600">{rec.expectedImpact}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recursos Necessários</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {rec.resources.map((resource, index) => (
                            <li key={index}>• {resource}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">KPIs de Acompanhamento</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {rec.kpis.map((kpi, index) => (
                            <li key={index}>• {kpi}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-5 h-5 mr-2" />
          Exportar Relatório Completo
        </button>
        <button className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Users className="w-5 h-5 mr-2" />
          Compartilhar com Equipe
        </button>
      </div>
    </div>
  );
};