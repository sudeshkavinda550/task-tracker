import React, { useEffect, useRef } from 'react';
import { Task } from '../types';

interface ProductivityChartsProps {
  tasks: Task[];
}

interface ChartContext {
  raw: number;
}

const calculateTotalTime = (timeEntries: any[]): number => {
  if (!timeEntries || timeEntries.length === 0) return 0;
  return timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0);
};

const ProductivityCharts: React.FC<ProductivityChartsProps> = ({ tasks }) => {
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const timeChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.async = true;
    script.onload = () => {
      renderCharts();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [tasks]);

  const renderCharts = () => {
    if (!(window as any).Chart) return;

    const Chart = (window as any).Chart;

    Chart.getChart(pieChartRef.current)?.destroy();
    Chart.getChart(barChartRef.current)?.destroy();
    Chart.getChart(timeChartRef.current)?.destroy();

    const statusCounts = {
      pending: tasks.filter(t => t.status === 'pending').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };

    new Chart(pieChartRef.current, {
      type: 'pie',
      data: {
        labels: ['Pending', 'In Progress', 'Completed'],
        datasets: [{
          data: [statusCounts.pending, statusCounts.in_progress, statusCounts.completed],
          backgroundColor: ['#FFA726', '#42A5F5', '#66BB6A'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Task Status Distribution',
            font: { size: 16 }
          }
        }
      }
    });

    const priorityCounts = {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
    };

    new Chart(barChartRef.current, {
      type: 'bar',
      data: {
        labels: ['Low', 'Medium', 'High'],
        datasets: [{
          label: 'Number of Tasks',
          data: [priorityCounts.low, priorityCounts.medium, priorityCounts.high],
          backgroundColor: ['#81C784', '#FFD54F', '#E57373'],
          borderWidth: 1,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Tasks by Priority Level',
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });

    const categoryTimeMap: { [key: string]: number } = {};
    
    tasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      const timeInSeconds = calculateTotalTime(task.timeEntries);
      const timeInMinutes = timeInSeconds / 60;
      categoryTimeMap[category] = (categoryTimeMap[category] || 0) + timeInMinutes;
    });

    const categories = Object.keys(categoryTimeMap);
    const times = Object.values(categoryTimeMap);

    const maxTime = Math.max(...times, 10);
    const maxScaleValue = Math.ceil(maxTime / 10) * 10;

    new Chart(timeChartRef.current, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Minutes Tracked',
          data: times,
          backgroundColor: '#5C6BC0',
          borderWidth: 1,
          borderColor: '#fff'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Time Distribution by Category',
            font: { size: 16 }
          },
          tooltip: {
            callbacks: {
              label: function(context: ChartContext) {
                const minutes = context.raw;
                return `${minutes.toFixed(1)} minutes`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Minutes'
            },
            ticks: {
              stepSize: 10,
              max: maxScaleValue
            },
            max: maxScaleValue
          }
        }
      }
    });
  };

  return (
    <div className="productivity-charts">
      <div className="charts-grid">
        <div className="chart-container">
          <canvas ref={pieChartRef}></canvas>
        </div>
        <div className="chart-container">
          <canvas ref={barChartRef}></canvas>
        </div>
        <div className="chart-container chart-wide">
          <canvas ref={timeChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default ProductivityCharts;