import { Task } from '../types';

const calculateTotalTime = (timeEntries: any[]): number => {
  if (!timeEntries || timeEntries.length === 0) return 0;
  return timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0);
};

export const exportTasksToCSV = (tasks: Task[]) => {
  const headers = [
    'Title',
    'Description',
    'Status',
    'Priority',
    'Category',
    'Total Time (Hours)',
    'Created Date',
    'Completed Date'
  ];

  const rows = tasks.map(task => {
    const totalSeconds = calculateTotalTime(task.timeEntries);
    const totalHours = totalSeconds ? (totalSeconds / 3600).toFixed(2) : '0.00';
    const createdDate = new Date(task.createdAt).toLocaleDateString();
    const completedDate = task.status === 'completed' && task.updatedAt 
      ? new Date(task.updatedAt).toLocaleDateString() 
      : 'N/A';

    return [
      `"${task.title.replace(/"/g, '""')}"`, 
      `"${(task.description || '').replace(/"/g, '""')}"`, 
      task.status,
      task.priority || 'N/A',
      task.category || 'N/A',
      totalHours,
      createdDate,
      completedDate
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `tasks_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportProductivityStatsToCSV = (stats: any) => {
  const headers = ['Metric', 'Value'];
  
  const rows = [
    ['Tasks Completed Today', stats.tasksCompletedToday || 0],
    ['Tasks Completed This Week', stats.tasksCompletedThisWeek || 0],
    ['Total Tasks Completed', stats.totalTasksCompleted || 0],
    ['Hours Tracked Today', (stats.hoursTrackedToday || 0).toFixed(2)],
    ['Hours Tracked This Week', (stats.hoursTrackedThisWeek || 0).toFixed(2)],
    ['Total Hours Tracked', (stats.totalHoursTracked || 0).toFixed(2)]
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `productivity_stats_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};