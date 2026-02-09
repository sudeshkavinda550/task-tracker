import React, { useEffect, useState } from 'react';
import { UserStats, Task } from '../types';
import { usersApi } from '../services/api';

interface StatsProps {
  tasks: Task[]; 
}

const Stats: React.FC<StatsProps> = ({ tasks }) => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    loadStats();
  }, [tasks]); 

  const loadStats = async () => {
    try {
      const data = await usersApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h4>Today</h4>
        <div className="stat-value">{stats.tasksCompletedToday}</div>
        <div className="stat-label">Tasks Completed</div>
        <div className="stat-time">{stats.totalHoursToday}h tracked</div>
      </div>

      <div className="stat-card">
        <h4>This Week</h4>
        <div className="stat-value">{stats.tasksCompletedWeek}</div>
        <div className="stat-label">Tasks Completed</div>
        <div className="stat-time">{stats.totalHoursWeek}h tracked</div>
      </div>

      <div className="stat-card">
        <h4>Total</h4>
        <div className="stat-value">{stats.completedTasks} / {stats.totalTasks}</div>
        <div className="stat-label">Tasks Completed</div>
      </div>
    </div>
  );
};

export default Stats;