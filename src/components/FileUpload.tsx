import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { SpreadsheetData, ProcessingStatus } from '../types';
import { FileProcessor } from '../utils/fileProcessor';

interface FileUploadProps {
  onDataProcessed: (data: SpreadsheetData) => void;
  onError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataProcessed, onError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [processing, setProcessing] = useState<ProcessingStatus | null>(null);

  const processFile = useCallback(async (file: File) => {
    setProcessing({
      stage: 'uploading',
      progress: 0,
      message: 'Iniciando upload...'
    });

    try {
      setProcessing({
        stage: 'processing',
        progress: 30,
        message: 'Processando arquivo...'
      });

      const data = await FileProcessor.processFile(file);

      setProcessing({
        stage: 'generating',
        progress: 80,
        message: 'Analisando dados...'
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProcessing({
        stage: 'complete',
        progress: 100,
        message: 'Processamento concluído!'
      });

      setTimeout(() => {
        setProcessing(null);
        onDataProcessed(data);
      }, 500);

    } catch (error) {
      setProcessing({
        stage: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      onError(error instanceof Error ? error.message : 'Erro desconhecido');
      
      setTimeout(() => {
        setProcessing(null);
      }, 3000);
    }
  }, [onDataProcessed, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const getProgressColor = () => {
    if (!processing) return 'bg-blue-500';
    switch (processing.stage) {
      case 'error': return 'bg-red-500';
      case 'complete': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusIcon = () => {
    if (!processing) return null;
    switch (processing.stage) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'complete': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Upload className="w-5 h-5 text-blue-500 animate-pulse" />;
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : processing
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        {processing ? (
          <div className="space-y-4">
            {getStatusIcon()}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {processing.message}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
                  style={{ width: `${processing.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {processing.progress}% concluído
              </p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Arraste e solte sua planilha aqui
            </h3>
            <p className="text-gray-600 mb-4">
              Ou clique para selecionar um arquivo
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Suporte para Excel (.xlsx, .xls) e CSV (até 50MB)
            </p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-5 h-5 mr-2" />
              Selecionar Arquivo
            </label>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center mb-2">
            <FileSpreadsheet className="w-5 h-5 text-green-500 mr-2" />
            <span className="font-medium text-gray-900">Excel</span>
          </div>
          <p className="text-sm text-gray-600">
            Arquivos .xlsx e .xls com até 10.000 linhas
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center mb-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-500 mr-2" />
            <span className="font-medium text-gray-900">CSV</span>
          </div>
          <p className="text-sm text-gray-600">
            Arquivos separados por vírgula ou ponto e vírgula
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center mb-2">
            <Upload className="w-5 h-5 text-purple-500 mr-2" />
            <span className="font-medium text-gray-900">Processamento</span>
          </div>
          <p className="text-sm text-gray-600">
            Análise automática em menos de 30 segundos
          </p>
        </div>
      </div>
    </div>
  );
};