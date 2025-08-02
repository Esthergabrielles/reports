import React from 'react';
import { SpreadsheetData } from '../types';
import { FileSpreadsheet, Database, TrendingUp } from 'lucide-react';
import { FileProcessor } from '../utils/fileProcessor';

interface DataPreviewProps {
  data: SpreadsheetData;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  const dataTypes = FileProcessor.detectDataTypes(data);
  const suggestions = FileProcessor.suggestCharts(data);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'number': return '🔢';
      case 'currency': return '💰';
      case 'date': return '📅';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number': return 'bg-blue-100 text-blue-800';
      case 'currency': return 'bg-green-100 text-green-800';
      case 'date': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* File Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <FileSpreadsheet className="w-6 h-6 text-blue-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Informações do Arquivo</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{data.totalRows.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Linhas</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{data.totalColumns}</div>
            <div className="text-sm text-gray-600">Colunas</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{data.fileType.toUpperCase()}</div>
            <div className="text-sm text-gray-600">Formato</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{suggestions.length}</div>
            <div className="text-sm text-gray-600">Gráficos Sugeridos</div>
          </div>
        </div>
      </div>

      {/* Data Types */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <Database className="w-6 h-6 text-green-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Tipos de Dados Detectados</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(dataTypes).map(([column, type]) => (
            <div key={column} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-lg mr-2">{getTypeIcon(type)}</span>
                <span className="font-medium text-gray-900 truncate">{column}</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(type)}`}>
                {type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-purple-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Gráficos Sugeridos</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 capitalize">{suggestion.type}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>X: {suggestion.xAxis}</p>
                  <p>Y: {suggestion.yAxis}</p>
                  <p>Pontos: {suggestion.data.length}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Preview Table */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview dos Dados</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {data.headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{getTypeIcon(dataTypes[header])}</span>
                      {header}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.rows.slice(0, 10).map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cell || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.totalRows > 10 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Mostrando 10 de {data.totalRows.toLocaleString()} registros
          </div>
        )}
      </div>
    </div>
  );
};