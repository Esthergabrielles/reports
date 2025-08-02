export interface SpreadsheetData {
  headers: string[];
  rows: any[][];
  fileName: string;
  fileType: string;
  totalRows: number;
  totalColumns: number;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  title: string;
  xAxis: string;
  yAxis: string;
  data: any[];
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sector: string;
  charts: ChartConfig[];
  layout: 'single' | 'grid' | 'dashboard';
  color: string;
}

export interface ProcessingStatus {
  stage: 'uploading' | 'processing' | 'generating' | 'complete' | 'error';
  progress: number;
  message: string;
}

export interface CompanyBranding {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  companyName: string;
  reportTitle: string;
}

export interface ExecutiveReport {
  id: string;
  title: string;
  executiveSummary: string;
  methodology: string;
  keyInsights: Insight[];
  recommendations: Recommendation[];
  targetAudience: 'executives' | 'managers' | 'analysts' | 'stakeholders';
  createdAt: Date;
  lastUpdated: Date;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'performance' | 'trend' | 'opportunity' | 'risk';
  supportingData: any[];
  confidence: number; // 0-100
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  expectedImpact: string;
  resources: string[];
  kpis: string[];
}

export interface DataAnalysis {
  summary: {
    totalRecords: number;
    dataQuality: number;
    completeness: number;
    trends: string[];
  };
  patterns: {
    correlations: Array<{
      variables: string[];
      strength: number;
      significance: number;
    }>;
    outliers: Array<{
      field: string;
      values: any[];
      impact: string;
    }>;
    seasonality: Array<{
      field: string;
      pattern: string;
      confidence: number;
    }>;
  };
  forecasts: Array<{
    metric: string;
    predictions: Array<{
      period: string;
      value: number;
      confidence: number;
    }>;
  }>;
}