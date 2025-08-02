import React, { useState } from 'react';
import { FileSpreadsheet, BarChart3, Settings, Download, ArrowRight, CheckCircle } from 'lucide-react';
import { SpreadsheetData, ReportTemplate } from './types';
import { FileUpload } from './components/FileUpload';
import { DataPreview } from './components/DataPreview';
import { TemplateSelector } from './components/TemplateSelector';
import { ReportGenerator } from './components/ReportGenerator';

type Step = 'upload' | 'preview' | 'template' | 'generate';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 'upload', name: 'Upload', icon: FileSpreadsheet, completed: !!spreadsheetData },
    { id: 'preview', name: 'Preview', icon: BarChart3, completed: !!spreadsheetData && currentStep !== 'upload' },
    { id: 'template', name: 'Template', icon: Settings, completed: !!selectedTemplate },
    { id: 'generate', name: 'Gerar', icon: Download, completed: false }
  ];

  const handleDataProcessed = (data: SpreadsheetData) => {
    setSpreadsheetData(data);
    setError(null);
    setCurrentStep('preview');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'upload': return !!spreadsheetData;
      case 'preview': return !!spreadsheetData;
      case 'template': return !!selectedTemplate;
      case 'generate': return !!selectedTemplate && !!spreadsheetData;
      default: return false;
    }
  };

  const getNextStep = (): Step => {
    switch (currentStep) {
      case 'upload': return 'preview';
      case 'preview': return 'template';
      case 'template': return 'generate';
      default: return 'generate';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <FileUpload 
            onDataProcessed={handleDataProcessed}
            onError={handleError}
          />
        );
      case 'preview':
        return spreadsheetData ? (
          <DataPreview data={spreadsheetData} />
        ) : null;
      case 'template':
        return (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
          />
        );
      case 'generate':
        return spreadsheetData && selectedTemplate ? (
          <ReportGenerator
            data={spreadsheetData}
            template={selectedTemplate}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FileSpreadsheet className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Conversor de Planilhas
                </h1>
                <p className="text-sm text-gray-600">
                  Transforme suas planilhas em relatórios corporativos profissionais
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">MVP v1.0</p>
              <p className="text-xs text-gray-400">Business Intelligence</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <nav className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = step.completed;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                          isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : isActive
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p
                          className={`text-sm font-medium ${
                            isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                          }`}
                        >
                          {step.name}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-gray-300 ml-8" />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro no processamento</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          {currentStep !== 'upload' && (
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  const stepOrder: Step[] = ['upload', 'preview', 'template', 'generate'];
                  const currentIndex = stepOrder.indexOf(currentStep);
                  if (currentIndex > 0) {
                    setCurrentStep(stepOrder[currentIndex - 1]);
                  }
                }}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Voltar
              </button>
              
              {currentStep !== 'generate' && (
                <button
                  onClick={() => setCurrentStep(getNextStep())}
                  disabled={!canProceedToNext()}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Sistema MVP de Conversão de Planilhas para Relatórios Corporativos
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Suporte para Excel, CSV • Templates por setor • Exportação PDF/HTML • Integração Power BI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;