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