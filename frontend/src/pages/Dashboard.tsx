import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TasksContext';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import Stats from '../components/Stats';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { tasks, loading } = useTasks();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Tracker</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stats-section">
          <h2>Productivity Stats</h2>
          <Stats tasks={tasks} />
        </section>

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