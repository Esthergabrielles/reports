import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { ChartConfig } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartRendererProps {
  config: ChartConfig;
  color: string;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ config, color }) => {
  const chartRef = useRef<any>(null);

  const generateColors = (count: number, baseColor: string) => {
    const colors = [];
    const opacity = [0.8, 0.6, 0.4, 0.7, 0.5, 0.9, 0.3];
    
    for (let i = 0; i < count; i++) {
      const alpha = opacity[i % opacity.length];
      colors.push(`${baseColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
    }
    
    return colors;
  };

  const prepareChartData = () => {
    if (!config.data || config.data.length === 0) {
      return {
        labels: ['Sem dados'],
        datasets: [{
          label: 'Sem dados disponíveis',
          data: [1],
          backgroundColor: ['#E5E7EB'],
          borderColor: ['#9CA3AF'],
          borderWidth: 1
        }]
      };
    }

    const labels = config.data.map(item => String(item.x));
    const values = config.data.map(item => Number(item.y) || 0);
    
    const backgroundColors = generateColors(values.length, color);
    const borderColors = backgroundColors.map(color => color.replace(/[^,]+(?=\))/, '1'));

    return {
      labels,
      datasets: [{
        label: config.title,
        data: values,
        backgroundColor: config.type === 'line' ? `${color}20` : backgroundColors,
        borderColor: config.type === 'line' ? color : borderColors,
        borderWidth: 2,
        fill: config.type === 'line' ? false : true,
        tension: config.type === 'line' ? 0.4 : undefined,
        pointBackgroundColor: config.type === 'line' ? color : undefined,
        pointBorderColor: config.type === 'line' ? '#ffffff' : undefined,
        pointBorderWidth: config.type === 'line' ? 2 : undefined,
        pointRadius: config.type === 'line' ? 4 : undefined,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: config.title,
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: color,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y || context.parsed;
            return `${context.dataset.label}: ${typeof value === 'number' ? value.toLocaleString() : value}`;
          }
        }
      }
    },
    scales: config.type !== 'pie' && config.type !== 'doughnut' ? {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value: any) {
            return typeof value === 'number' ? value.toLocaleString() : value;
          }
        }
      }
    } : undefined,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    }
  };

  const renderChart = () => {
    const data = prepareChartData();
    
    switch (config.type) {
      case 'bar':
        return <Bar ref={chartRef} data={data} options={chartOptions} />;
      case 'line':
        return <Line ref={chartRef} data={data} options={chartOptions} />;
      case 'pie':
        return <Pie ref={chartRef} data={data} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut ref={chartRef} data={data} options={chartOptions} />;
      default:
        return <Bar ref={chartRef} data={data} options={chartOptions} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="h-80">
        {renderChart()}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {config.data.length} pontos de dados • {config.xAxis} vs {config.yAxis}
        </p>
      </div>
    </div>
  );
};