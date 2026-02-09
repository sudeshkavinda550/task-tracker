import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { useTasks } from '../contexts/TasksContext';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask, startTimer, stopTimer } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
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

  const handleSave = async () => {
    if (title.trim()) {
      await updateTask(task.id, { title });
      setIsEditing(false);
    }
  };

  const markComplete = async () => {
    await updateTask(task.id, { status: TaskStatus.COMPLETED });
  };

  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <div className={`task-card ${task.status}`}>
      <div className="task-header">
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        ) : (
          <h3 onClick={() => setIsEditing(true)}>{task.title}</h3>
        )}
        <button className="delete-btn" onClick={() => deleteTask(task.id)}>×</button>
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