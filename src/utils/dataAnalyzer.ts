import { SpreadsheetData, DataAnalysis, Insight, Recommendation } from '../types';

export class DataAnalyzer {
  static analyzeData(data: SpreadsheetData): DataAnalysis {
    const analysis: DataAnalysis = {
      summary: this.generateSummary(data),
      patterns: this.detectPatterns(data),
      forecasts: this.generateForecasts(data)
    };

    return analysis;
  }

  private static generateSummary(data: SpreadsheetData) {
    const totalRecords = data.totalRows;
    const completeness = this.calculateCompleteness(data);
    const dataQuality = this.assessDataQuality(data);
    const trends = this.identifyTrends(data);

    return {
      totalRecords,
      dataQuality,
      completeness,
      trends
    };
  }

  private static calculateCompleteness(data: SpreadsheetData): number {
    let totalCells = 0;
    let filledCells = 0;

    data.rows.forEach(row => {
      row.forEach(cell => {
        totalCells++;
        if (cell !== null && cell !== undefined && cell !== '') {
          filledCells++;
        }
      });
    });

    return Math.round((filledCells / totalCells) * 100);
  }

  private static assessDataQuality(data: SpreadsheetData): number {
    let qualityScore = 100;
    
    // Check for duplicates
    const uniqueRows = new Set(data.rows.map(row => JSON.stringify(row)));
    const duplicateRate = (data.rows.length - uniqueRows.size) / data.rows.length;
    qualityScore -= duplicateRate * 20;

    // Check for consistency in numeric fields
    data.headers.forEach((header, index) => {
      const values = data.rows.map(row => row[index]).filter(val => val !== null && val !== undefined && val !== '');
      if (values.length > 0) {
        const numericValues = values.filter(val => !isNaN(Number(val)));
        if (numericValues.length > values.length * 0.5) {
          // Should be mostly numeric
          const inconsistencyRate = (values.length - numericValues.length) / values.length;
          qualityScore -= inconsistencyRate * 10;
        }
      }
    });

    return Math.max(0, Math.round(qualityScore));
  }

  private static identifyTrends(data: SpreadsheetData): string[] {
    const trends: string[] = [];
    
    // Look for time-based columns
    const dateColumns = data.headers.filter((header, index) => {
      const sample = data.rows.slice(0, 5).map(row => row[index]);
      return sample.some(val => !isNaN(Date.parse(String(val))));
    });

    if (dateColumns.length > 0) {
      trends.push('Dados temporais detectados - análise de tendências possível');
    }

    // Look for numeric growth patterns
    const numericColumns = data.headers.filter((header, index) => {
      const values = data.rows.map(row => row[index]).filter(val => val !== null && val !== undefined && val !== '');
      return values.length > 0 && values.every(val => !isNaN(Number(val)));
    });

    if (numericColumns.length >= 2) {
      trends.push('Múltiplas métricas numéricas - correlações possíveis');
    }

    // Check for categorical distributions
    const categoricalColumns = data.headers.filter((header, index) => {
      const values = data.rows.map(row => row[index]).filter(val => val !== null && val !== undefined && val !== '');
      const uniqueValues = new Set(values);
      return uniqueValues.size < values.length * 0.5 && uniqueValues.size > 1;
    });

    if (categoricalColumns.length > 0) {
      trends.push('Dados categóricos identificados - segmentação disponível');
    }

    return trends;
  }

  private static detectPatterns(data: SpreadsheetData) {
    return {
      correlations: this.findCorrelations(data),
      outliers: this.detectOutliers(data),
      seasonality: this.detectSeasonality(data)
    };
  }

  private static findCorrelations(data: SpreadsheetData) {
    const correlations: Array<{
      variables: string[];
      strength: number;
      significance: number;
    }> = [];

    const numericColumns = data.headers
      .map((header, index) => ({ header, index }))
      .filter(({ index }) => {
        const values = data.rows.map(row => row[index]).filter(val => val !== null && val !== undefined && val !== '');
        return values.length > 0 && values.every(val => !isNaN(Number(val)));
      });

    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        const col1 = numericColumns[i];
        const col2 = numericColumns[j];
        
        const values1 = data.rows.map(row => Number(row[col1.index]) || 0);
        const values2 = data.rows.map(row => Number(row[col2.index]) || 0);
        
        const correlation = this.calculateCorrelation(values1, values2);
        
        if (Math.abs(correlation) > 0.3) {
          correlations.push({
            variables: [col1.header, col2.header],
            strength: Math.abs(correlation),
            significance: Math.abs(correlation) > 0.7 ? 0.95 : 0.75
          });
        }
      }
    }

    return correlations;
  }

  private static calculateCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n < 2) return 0;

    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private static detectOutliers(data: SpreadsheetData) {
    const outliers: Array<{
      field: string;
      values: any[];
      impact: string;
    }> = [];

    data.headers.forEach((header, index) => {
      const values = data.rows
        .map(row => row[index])
        .filter(val => val !== null && val !== undefined && val !== '')
        .map(val => Number(val))
        .filter(val => !isNaN(val));

      if (values.length > 4) {
        const sorted = [...values].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        const outlierValues = values.filter(val => val < lowerBound || val > upperBound);
        
        if (outlierValues.length > 0) {
          outliers.push({
            field: header,
            values: outlierValues,
            impact: outlierValues.length > values.length * 0.1 ? 'Alto' : 'Moderado'
          });
        }
      }
    });

    return outliers;
  }

  private static detectSeasonality(data: SpreadsheetData) {
    // Simplified seasonality detection
    return [];
  }

  private static generateForecasts(data: SpreadsheetData) {
    // Simplified forecasting - would use more sophisticated methods in production
    const forecasts: Array<{
      metric: string;
      predictions: Array<{
        period: string;
        value: number;
        confidence: number;
      }>;
    }> = [];

    const numericColumns = data.headers.filter((header, index) => {
      const values = data.rows.map(row => row[index]).filter(val => val !== null && val !== undefined && val !== '');
      return values.length > 0 && values.every(val => !isNaN(Number(val)));
    });

    numericColumns.slice(0, 2).forEach(header => {
      const index = data.headers.indexOf(header);
      const values = data.rows.map(row => Number(row[index]) || 0);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const trend = values.length > 1 ? (values[values.length - 1] - values[0]) / values.length : 0;

      forecasts.push({
        metric: header,
        predictions: [
          {
            period: 'Próximo período',
            value: Math.round(avg + trend),
            confidence: 0.75
          },
          {
            period: '2 períodos',
            value: Math.round(avg + trend * 2),
            confidence: 0.65
          },
          {
            period: '3 períodos',
            value: Math.round(avg + trend * 3),
            confidence: 0.55
          }
        ]
      });
    });

    return forecasts;
  }

  static generateInsights(data: SpreadsheetData, analysis: DataAnalysis): Insight[] {
    const insights: Insight[] = [];

    // Data quality insight
    if (analysis.summary.dataQuality < 80) {
      insights.push({
        id: 'data-quality',
        title: 'Qualidade dos Dados Requer Atenção',
        description: `A qualidade dos dados está em ${analysis.summary.dataQuality}%, indicando possíveis inconsistências que podem afetar a análise.`,
        impact: 'high',
        category: 'risk',
        supportingData: [analysis.summary.dataQuality],
        confidence: 90
      });
    }

    // Correlation insights
    analysis.patterns.correlations.forEach(corr => {
      if (corr.strength > 0.7) {
        insights.push({
          id: `correlation-${corr.variables.join('-')}`,
          title: `Forte Correlação Identificada`,
          description: `${corr.variables[0]} e ${corr.variables[1]} apresentam correlação de ${(corr.strength * 100).toFixed(1)}%, sugerindo uma relação significativa.`,
          impact: 'medium',
          category: 'opportunity',
          supportingData: corr.variables,
          confidence: Math.round(corr.significance * 100)
        });
      }
    });

    // Outlier insights
    analysis.patterns.outliers.forEach(outlier => {
      if (outlier.impact === 'Alto') {
        insights.push({
          id: `outlier-${outlier.field}`,
          title: `Valores Atípicos em ${outlier.field}`,
          description: `Detectados ${outlier.values.length} valores atípicos em ${outlier.field}, que podem indicar erros de dados ou eventos excepcionais.`,
          impact: 'medium',
          category: 'risk',
          supportingData: outlier.values,
          confidence: 85
        });
      }
    });

    // Volume insight
    if (data.totalRows > 5000) {
      insights.push({
        id: 'large-dataset',
        title: 'Dataset Robusto para Análise',
        description: `Com ${data.totalRows.toLocaleString()} registros, o dataset oferece uma base sólida para análises estatísticas confiáveis.`,
        impact: 'high',
        category: 'opportunity',
        supportingData: [data.totalRows],
        confidence: 95
      });
    }

    return insights;
  }

  static generateRecommendations(data: SpreadsheetData, analysis: DataAnalysis, insights: Insight[]): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Data quality recommendations
    if (analysis.summary.dataQuality < 80) {
      recommendations.push({
        id: 'improve-data-quality',
        title: 'Implementar Processo de Limpeza de Dados',
        description: 'Estabelecer rotinas de validação e limpeza de dados para melhorar a qualidade das análises futuras.',
        priority: 'high',
        timeframe: 'short-term',
        expectedImpact: 'Melhoria de 15-25% na confiabilidade das análises',
        resources: ['Analista de Dados', 'Ferramentas de ETL', 'Documentação de processos'],
        kpis: ['Taxa de completude dos dados', 'Índice de qualidade', 'Tempo de processamento']
      });
    }

    // Correlation-based recommendations
    const strongCorrelations = analysis.patterns.correlations.filter(c => c.strength > 0.7);
    if (strongCorrelations.length > 0) {
      recommendations.push({
        id: 'leverage-correlations',
        title: 'Explorar Relações Identificadas',
        description: 'Investigar as correlações fortes encontradas para identificar oportunidades de otimização e previsão.',
        priority: 'medium',
        timeframe: 'medium-term',
        expectedImpact: 'Potencial melhoria de 10-20% na precisão de previsões',
        resources: ['Cientista de Dados', 'Ferramentas de análise avançada'],
        kpis: ['Precisão de previsões', 'Tempo de resposta a mudanças', 'ROI de decisões baseadas em dados']
      });
    }

    // Automation recommendation
    if (data.totalRows > 1000) {
      recommendations.push({
        id: 'automate-reporting',
        title: 'Automatizar Geração de Relatórios',
        description: 'Implementar dashboards automatizados para monitoramento contínuo dos KPIs identificados.',
        priority: 'medium',
        timeframe: 'medium-term',
        expectedImpact: 'Redução de 60-80% no tempo de geração de relatórios',
        resources: ['Desenvolvedor BI', 'Plataforma de BI', 'Treinamento de usuários'],
        kpis: ['Tempo de geração de relatórios', 'Frequência de atualizações', 'Adoção pelos usuários']
      });
    }

    // Forecasting recommendation
    if (analysis.forecasts.length > 0) {
      recommendations.push({
        id: 'implement-forecasting',
        title: 'Desenvolver Modelos Preditivos',
        description: 'Criar modelos de previsão baseados nos padrões identificados para apoiar o planejamento estratégico.',
        priority: 'high',
        timeframe: 'long-term',
        expectedImpact: 'Melhoria de 25-40% na precisão do planejamento',
        resources: ['Cientista de Dados', 'Infraestrutura de ML', 'Dados históricos'],
        kpis: ['Precisão das previsões', 'Tempo de antecipação', 'Impacto nas decisões estratégicas']
      });
    }

    return recommendations;
  }
}