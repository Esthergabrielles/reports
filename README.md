# MVP - Conversor de Planilhas para Relatórios Corporativos

## 🎯 Visão Geral

Sistema web completo que transforma planilhas Excel/CSV simples em **relatórios executivos profissionais** com análise avançada de dados, insights automatizados, recomendações estratégicas e visualizações interativas.

## ✨ Funcionalidades Principais

### 📤 Upload e Processamento
- **Formatos suportados**: Excel (.xlsx, .xls) e CSV
- **Validação automática** da estrutura dos dados
- **Detecção inteligente** de tipos de dados (numérico, texto, data, moeda)
- **Processamento otimizado** para até 10.000 linhas
- **Preview completo** dos dados importados

### 📊 Geração de Relatórios
- **5 templates pré-definidos** por setor:
  - Dashboard de Vendas (Comercial)
  - Relatório Financeiro (Financeiro)
  - Analytics de RH (Recursos Humanos)
  - Performance de Marketing (Marketing)
  - Dashboard Operacional (Operações)
- **Geração automática** de gráficos (barras, pizza, linhas, rosca)
- **Sugestões inteligentes** de visualizações baseadas nos dados
- **Personalização visual** completa (cores, logo, identidade corporativa)

### 📋 Exportação e Integração
- **Export em PDF** com layout profissional
- **Export em HTML** responsivo e interativo
- **Integração Power BI** (.pbids) para conexão direta
- **Templates otimizados** para cada setor empresarial

### 🧠 Análise Inteligente de Dados
- **Detecção automática** de padrões e correlações
- **Análise de qualidade** dos dados com métricas de completude
- **Identificação de outliers** e anomalias
- **Previsões básicas** baseadas em tendências históricas
- **Insights automatizados** com níveis de confiança

### 📋 Relatórios Executivos
- **Sumário executivo** com principais descobertas
- **Metodologia detalhada** e fonte dos dados
- **Insights principais** categorizados por impacto
- **Recomendações estratégicas** priorizadas por urgência
- **Análise de correlações** com significância estatística
- **Previsões** com intervalos de confiança

## 🚀 Como Usar

### 1. Upload de Dados
1. Arraste e solte sua planilha ou clique para selecionar
2. Aguarde o processamento automático (máx. 30 segundos)
3. Visualize o preview dos dados detectados

### 2. Seleção de Template
1. Escolha o template adequado ao seu setor
2. Visualize os gráficos que serão gerados
3. Confirme a seleção

### 3. Personalização
1. Configure nome da empresa e título do relatório
2. Ajuste as cores corporativas
3. Visualize o preview do relatório

### 4. Geração e Download
1. Baixe em PDF para apresentações
2. Baixe em HTML para compartilhamento web
3. Gere arquivo Power BI para análises avançadas

### 5. Relatório Executivo (Novo!)
1. Selecione "Relatório Executivo" no gerador
2. Visualize análise automática de dados
3. Explore insights e recomendações
4. Exporte relatório completo para stakeholders

## 📁 Arquivos de Exemplo

O sistema inclui 3 planilhas de exemplo na pasta `public/sample-data/`:

- **vendas-exemplo.csv**: Dados de vendas por região e vendedor
- **financeiro-exemplo.csv**: Receitas e despesas por categoria
- **rh-exemplo.csv**: Dados de funcionários e avaliações

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Processamento**: XLSX.js, PapaParse
- **Visualizações**: Chart.js + React-Chart.js-2
- **PDF**: jsPDF + html2canvas
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Análise de Dados
- **Correlações**: Algoritmos estatísticos para detecção de padrões
- **Outliers**: Método IQR (Interquartile Range)
- **Qualidade**: Métricas de completude e consistência
- **Previsões**: Análise de tendências lineares

## 📊 Especificações Técnicas

- **Limite de arquivo**: 50MB
- **Máximo de linhas**: 10.000 registros
- **Tempo de processamento**: < 30 segundos
- **Formatos de entrada**: .xlsx, .xls, .csv
- **Formatos de saída**: PDF, HTML, .pbids (Power BI)
- **Navegadores suportados**: Chrome, Firefox, Safari, Edge

## 🎨 Templates Disponíveis

### 1. Dashboard de Vendas
- Vendas por período (gráfico de barras)
- Vendas por região (gráfico de pizza)
- Tendência de vendas (gráfico de linha)

### 2. Relatório Financeiro
- Receitas vs Despesas (gráfico de barras)
- Fluxo de caixa (gráfico de linha)
- Distribuição de custos (gráfico de rosca)

### 3. Analytics de RH
- Colaboradores por departamento (gráfico de barras)
- Distribuição por cargo (gráfico de pizza)
- Evolução do quadro (gráfico de linha)

### 4. Performance de Marketing
- Conversões por canal (gráfico de barras)
- ROI por campanha (gráfico de linha)
- Investimento por canal (gráfico de rosca)

### 5. Dashboard Operacional
- Produção por linha (gráfico de barras)
- Eficiência operacional (gráfico de linha)
- Distribuição de recursos (gráfico de pizza)

## 🎯 Relatórios Executivos

### Estrutura Padrão
1. **Sumário Executivo**
   - Métricas principais
   - Descobertas-chave
   - Metodologia aplicada

2. **Análise Detalhada**
   - Visualizações interativas
   - Correlações identificadas
   - Previsões e tendências

3. **Insights Principais**
   - Categorizados por impacto (Alto/Médio/Baixo)
   - Níveis de confiança estatística
   - Classificação por tipo (Performance/Oportunidade/Risco/Tendência)

4. **Recomendações Estratégicas**
   - Priorizadas por urgência (Crítica/Alta/Média/Baixa)
   - Cronograma de implementação
   - Recursos necessários
   - KPIs de acompanhamento
   - Impacto esperado

## 🔧 Instalação e Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📈 Roadmap Futuro

- [ ] Machine Learning para insights avançados
- [ ] Análise de sentimento em dados textuais
- [ ] Detecção automática de anomalias
- [ ] Benchmarking com dados de mercado
- [ ] Integração com Google Sheets
- [ ] Conectores para bancos de dados
- [ ] Templates personalizáveis
- [ ] Dashboard em tempo real
- [ ] API para integração externa
- [ ] Autenticação e multi-tenancy
- [ ] Agendamento de relatórios
- [ ] Notificações por email

## 🎯 Diferenciais Competitivos

- **Simplicidade**: Interface intuitiva sem necessidade de treinamento
- **Inteligência**: Análise automática com insights e recomendações
- **Velocidade**: Processamento em menos de 30 segundos
- **Flexibilidade**: Templates adaptáveis a qualquer setor
- **Profissionalismo**: Relatórios executivos de nível corporativo
- **Integração**: Compatibilidade nativa com Power BI
- **Qualidade**: Relatórios com padrão corporativo profissional
- **Custo**: Solução mais acessível que ferramentas enterprise

---

**MVP v2.0** - Sistema completo com análise inteligente de dados e geração automática de relatórios executivos profissionais.