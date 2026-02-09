export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface TimeEntry {
  id: string;
  taskId: string;
  startTime: string;
  endTime: string | null;
  duration: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  category?: string;
  priority: TaskPriority;
  userId: string;
  timeEntries: TimeEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  tasksCompletedToday: number;
  tasksCompletedWeek: number;
  totalHoursToday: number;
  totalHoursWeek: number;
  totalTasks: number;
  completedTasks: number;
}