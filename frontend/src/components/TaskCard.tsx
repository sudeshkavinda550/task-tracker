import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { useTasks } from '../contexts/TasksContext';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask, startTimer, stopTimer } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || '',
    category: task.category || '',
    priority: task.priority,
    status: task.status
  });
  const [elapsedTime, setElapsedTime] = useState(0);

  const activeTimer = task.timeEntries?.find(e => !e.endTime);
  const totalTime = task.timeEntries?.reduce((sum, e) => sum + (e.duration || 0), 0) || 0;

  useEffect(() => {
    if (activeTimer) {
      const interval = setInterval(() => {
        const start = new Date(activeTimer.startTime).getTime();
        const now = Date.now();
        setElapsedTime(Math.floor((now - start) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTimer]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (editedTask.title.trim()) {
      await updateTask(task.id, editedTask);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTask({
      title: task.title,
      description: task.description || '',
      category: task.category || '',
      priority: task.priority,
      status: task.status
    });
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const markComplete = async () => {
    await updateTask(task.id, { status: TaskStatus.COMPLETED });
  };

  const isCompleted = task.status === TaskStatus.COMPLETED;

  if (isEditing) {
    return (
      <div className={`task-card ${task.status}`}>
        <div className="task-edit-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleInputChange}
              placeholder="Task title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleInputChange}
              placeholder="Task description"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={editedTask.category}
              onChange={handleInputChange}
              placeholder="Category"
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={editedTask.priority}
              onChange={handleInputChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={editedTask.status}
              onChange={handleInputChange}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-actions">
            <button onClick={handleSaveEdit} className="btn btn-primary">
              Save Changes
            </button>
            <button onClick={handleCancelEdit} className="btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-card ${task.status}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-header-actions">
          <button onClick={handleEdit} className="edit-btn" title="Edit task">
            Edit
          </button>
          <button onClick={handleDelete} className="delete-btn" title="Delete task">
            Delete
          </button>
        </div>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        <span className={`badge priority-${task.priority}`}>{task.priority}</span>
        {task.category && <span className="badge category">{task.category}</span>}
        <span className={`badge status-${task.status}`}>{task.status.replace('_', ' ')}</span>
      </div>

      <div className="task-time">
        <div className="total-time">
          Total: {formatTime(totalTime + (activeTimer ? elapsedTime : 0))}
        </div>
        {activeTimer && (
          <div className="active-timer">
            Running: {formatTime(elapsedTime)}
          </div>
        )}
      </div>

      <div className="task-actions">
        {!isCompleted ? (
          <>
            <button 
              className="btn"
              onClick={markComplete}
            >
              Mark Complete
            </button>
            {activeTimer ? (
              <button className="btn timer-btn stop" onClick={() => stopTimer(task.id)}>
                ⏸ Stop Timer
              </button>
            ) : (
              <button className="btn timer-btn start" onClick={() => startTimer(task.id)}>
                ▶ Start Timer
              </button>
            )}
          </>
        ) : (
          <div className="completed-indicator">
            ✓ Task Completed
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;