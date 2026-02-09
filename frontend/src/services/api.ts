import axios from 'axios';
import { AuthResponse, Task, UserStats } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (email: string, password: string, name: string): Promise<AuthResponse> =>
    api.post('/auth/register', { email, password, name }).then(res => res.data),
  
  login: (email: string, password: string): Promise<AuthResponse> =>
    api.post('/auth/login', { email, password }).then(res => res.data),
};

export const tasksApi = {
  getAll: (params?: { status?: string; category?: string; priority?: string; search?: string }): Promise<Task[]> =>
    api.get('/tasks', { params }).then(res => res.data),
  
  getOne: (id: string): Promise<Task> =>
    api.get(`/tasks/${id}`).then(res => res.data),
  
  create: (data: { title: string; description?: string; category?: string; priority?: string }): Promise<Task> =>
    api.post('/tasks', data).then(res => res.data),
  
  update: (id: string, data: Partial<Task>): Promise<Task> =>
    api.patch(`/tasks/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/tasks/${id}`).then(res => res.data),
  
  startTimer: (id: string) =>
    api.post(`/tasks/${id}/start`).then(res => res.data),
  
  stopTimer: (id: string) =>
    api.post(`/tasks/${id}/stop`).then(res => res.data),
};

export const usersApi = {
  getProfile: () =>
    api.get('/users/profile').then(res => res.data),
  
  getStats: (): Promise<UserStats> =>
    api.get('/users/stats').then(res => res.data),
};

export default api;