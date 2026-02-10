import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TasksContext';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import Stats from '../components/Stats';
import ProductivityCharts from '../components/ProductivityCharts';
import { exportTasksToCSV, exportProductivityStatsToCSV } from '../utils/csvExport';
import '../components/ProductivityCharts.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { tasks, loading } = useTasks();
  const [showCharts, setShowCharts] = useState(false);

  const calculateTotalTime = (timeEntries: any[]): number => {
    if (!timeEntries || timeEntries.length === 0) return 0;
    return timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0);
  };

  // CSV Export Handlers
  const handleExportTasks = () => {
    if (tasks.length === 0) {
      alert('No tasks to export!');
      return;
    }
    exportTasksToCSV(tasks);
  };

  const handleExportStats = () => {
    if (tasks.length === 0) {
      alert('No tasks available for statistics export!');
      return;
    }
    
    const stats = calculateStats(tasks);
    exportProductivityStatsToCSV(stats);
  };

  const handleToggleCharts = () => {
    setShowCharts(prev => !prev);
  };

  const calculateStats = (tasks: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const tasksCompletedToday = tasks.filter(
      t => t.status === 'completed' && new Date(t.updatedAt) >= today
    ).length;

    const tasksCompletedThisWeek = tasks.filter(
      t => t.status === 'completed' && new Date(t.updatedAt) >= weekAgo
    ).length;

    const totalTasksCompleted = tasks.filter(t => t.status === 'completed').length;

    const hoursTrackedToday = tasks
      .filter(t => new Date(t.updatedAt) >= today)
      .reduce((sum, t) => sum + calculateTotalTime(t.timeEntries), 0) / 3600;

    const hoursTrackedThisWeek = tasks
      .filter(t => new Date(t.updatedAt) >= weekAgo)
      .reduce((sum, t) => sum + calculateTotalTime(t.timeEntries), 0) / 3600;

    const totalHoursTracked = tasks.reduce(
      (sum, t) => sum + calculateTotalTime(t.timeEntries), 0
    ) / 3600;

    return {
      tasksCompletedToday,
      tasksCompletedThisWeek,
      totalTasksCompleted,
      hoursTrackedToday,
      hoursTrackedThisWeek,
      totalHoursTracked
    };
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Tracker</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn btn-logout">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stats-section">
          <h2>Productivity Stats</h2>
          <Stats tasks={tasks} />
        </section>

        {/* Export and Visualization Controls */}
        <section className="controls-section">
          <div className="export-buttons">
            <button 
              onClick={handleExportTasks} 
              className="btn-export"
              disabled={tasks.length === 0}
              type="button"
            >
              Export Tasks to CSV
            </button>
            <button 
              onClick={handleExportStats} 
              className="btn-export"
              disabled={tasks.length === 0}
              type="button"
            >
             Export Stats to CSV
            </button>
            <button 
              onClick={handleToggleCharts} 
              className="btn-toggle-charts"
              disabled={tasks.length === 0}
              type="button"
            >
              {showCharts ? 'Hide Charts' : 'Show Charts'}
            </button>
          </div>
        </section>

        {/* Data Visualization */}
        {showCharts && tasks.length > 0 && (
          <section className="productivity-charts">
            <ProductivityCharts tasks={tasks} />
          </section>
        )}

        <section className="tasks-section">
          <div className="tasks-header">
            <h2>My Tasks</h2>
            <TaskForm />
          </div>

          <TaskFilters />

          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found. Create your first task to get started!</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;