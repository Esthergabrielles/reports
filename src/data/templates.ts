import { ReportTemplate } from '../types';

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'sales-dashboard',
    name: 'Dashboard de Vendas',
    description: 'Relatório completo de vendas com KPIs, tendências e análise por região',
    sector: 'Comercial',
    color: '#3B82F6',
    layout: 'dashboard',
    charts: [
      {
        type: 'bar',
        title: 'Vendas por Período',
        xAxis: 'periodo',
        yAxis: 'vendas',
        data: []
      },
      {
        type: 'pie',
        title: 'Vendas por Região',
        xAxis: 'regiao',
        yAxis: 'vendas',
        data: []
      },
      {
        type: 'line',
        title: 'Tendência de Vendas',
        xAxis: 'data',
        yAxis: 'vendas',
        data: []
      }
    ]
  },
  {
    id: 'financial-report',
    name: 'Relatório Financeiro',
    description: 'Análise financeira com receitas, despesas e indicadores de performance',
    sector: 'Financeiro',
    color: '#10B981',
    layout: 'grid',
    charts: [
      {
        type: 'bar',
        title: 'Receitas vs Despesas',
        xAxis: 'categoria',
        yAxis: 'valor',
        data: []
      },
      {
        type: 'line',
        title: 'Fluxo de Caixa',
        xAxis: 'mes',
        yAxis: 'saldo',
        data: []
      },
      {
        type: 'doughnut',
        title: 'Distribuição de Custos',
        xAxis: 'tipo_custo',
        yAxis: 'valor',
        data: []
      }
    ]
  },
  {
    id: 'hr-analytics',
    name: 'Analytics de RH',
    description: 'Métricas de recursos humanos, turnover e performance dos colaboradores',
    sector: 'Recursos Humanos',
    color: '#8B5CF6',
    layout: 'dashboard',
    charts: [
      {
        type: 'bar',
        title: 'Colaboradores por Departamento',
        xAxis: 'departamento',
        yAxis: 'quantidade',
        data: []
      },
      {
        type: 'pie',
        title: 'Distribuição por Cargo',
        xAxis: 'cargo',
        yAxis: 'quantidade',
        data: []
      },
      {
        type: 'line',
        title: 'Evolução do Quadro',
        xAxis: 'mes',
        yAxis: 'total_funcionarios',
        data: []
      }
    ]
  },
  {
    id: 'marketing-performance',
    name: 'Performance de Marketing',
    description: 'Análise de campanhas, conversões e ROI de marketing digital',
    sector: 'Marketing',
    color: '#F59E0B',
    layout: 'grid',
    charts: [
      {
        type: 'bar',
        title: 'Conversões por Canal',
        xAxis: 'canal',
        yAxis: 'conversoes',
        data: []
      },
      {
        type: 'line',
        title: 'ROI por Campanha',
        xAxis: 'campanha',
        yAxis: 'roi',
        data: []
      },
      {
        type: 'doughnut',
        title: 'Investimento por Canal',
        xAxis: 'canal',
        yAxis: 'investimento',
        data: []
      }
    ]
  },
  {
    id: 'operations-dashboard',
    name: 'Dashboard Operacional',
    description: 'Métricas operacionais, produtividade e indicadores de qualidade',
    sector: 'Operações',
    color: '#EF4444',
    layout: 'dashboard',
    charts: [
      {
        type: 'bar',
        title: 'Produção por Linha',
        xAxis: 'linha_producao',
        yAxis: 'quantidade',
        data: []
      },
      {
        type: 'line',
        title: 'Eficiência Operacional',
        xAxis: 'periodo',
        yAxis: 'eficiencia',
        data: []
      },
      {
        type: 'pie',
        title: 'Distribuição de Recursos',
        xAxis: 'recurso',
        yAxis: 'utilizacao',
        data: []
      }
    ]
  }
];