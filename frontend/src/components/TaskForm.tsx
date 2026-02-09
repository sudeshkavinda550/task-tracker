import React, { useState } from 'react';
import { TaskPriority } from '../types';
import { useTasks } from '../contexts/TasksContext';

const TaskForm: React.FC = () => {
  const { createTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title,
        description: description || undefined,
        category: category || undefined,
        priority,
      });

      setTitle('');
      setDescription('');
      setCategory('');
      setPriority(TaskPriority.MEDIUM);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  if (!isOpen) {
    return (
      <button className="btn btn-primary new-task-btn" onClick={() => setIsOpen(true)}>
        + New Task
      </button>
    );
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>Create New Task</h3>
      
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <input
        type="text"
        placeholder="Category (optional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
        <option value={TaskPriority.LOW}>Low Priority</option>
        <option value={TaskPriority.MEDIUM}>Medium Priority</option>
        <option value={TaskPriority.HIGH}>High Priority</option>
      </select>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Create Task</button>
        <button type="button" className="btn" onClick={() => setIsOpen(false)}>Cancel</button>
      </div>
    </form>
  );
};

export default TaskForm;