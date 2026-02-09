import React from 'react';
import { TaskStatus, TaskPriority } from '../types';
import { useTasks } from '../contexts/TasksContext';

const TaskFilters: React.FC = () => {
  const { filters, setFilters } = useTasks();

  return (
    <div className="task-filters">
      <input
        type="text"
        placeholder="Search tasks..."
        value={filters.search || ''}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        className="search-input"
      />

      <select
        value={filters.status || ''}
        onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
      >
        <option value="">All Statuses</option>
        <option value={TaskStatus.PENDING}>Pending</option>
        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
        <option value={TaskStatus.COMPLETED}>Completed</option>
      </select>

      <select
        value={filters.priority || ''}
        onChange={(e) => setFilters({ ...filters, priority: e.target.value || undefined })}
      >
        <option value="">All Priorities</option>
        <option value={TaskPriority.LOW}>Low</option>
        <option value={TaskPriority.MEDIUM}>Medium</option>
        <option value={TaskPriority.HIGH}>High</option>
      </select>

      <input
        type="text"
        placeholder="Filter by category..."
        value={filters.category || ''}
        onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
      />

      {Object.keys(filters).length > 0 && (
        <button className="btn" onClick={() => setFilters({})}>
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default TaskFilters;