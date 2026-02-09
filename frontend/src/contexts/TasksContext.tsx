import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { tasksApi } from '../services/api';

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  filters: {
    status?: TaskStatus;
    category?: string;
    priority?: TaskPriority;
    search?: string;
  };
  setFilters: (filters: any) => void;
  refreshTasks: () => Promise<void>;
  createTask: (data: any) => Promise<Task>;
  updateTask: (id: string, data: any) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  startTimer: (id: string) => Promise<void>;
  stopTimer: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    refreshTasks();
  }, [filters]);

  const refreshTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksApi.getAll(filters);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: any) => {
    const task = await tasksApi.create(data);
    setTasks([task, ...tasks]);
    return task;
  };

  const updateTask = async (id: string, data: any) => {
    const updated = await tasksApi.update(id, data);
    setTasks(tasks.map(t => t.id === id ? updated : t));
    return updated;
  };

  const deleteTask = async (id: string) => {
    await tasksApi.delete(id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startTimer = async (id: string) => {
    await tasksApi.startTimer(id);
    await refreshTasks();
  };

  const stopTimer = async (id: string) => {
    await tasksApi.stopTimer(id);
    await refreshTasks();
  };

  return (
    <TasksContext.Provider value={{
      tasks,
      loading,
      filters,
      setFilters,
      refreshTasks,
      createTask,
      updateTask,
      deleteTask,
      startTimer,
      stopTimer,
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within TasksProvider');
  }
  return context;
};