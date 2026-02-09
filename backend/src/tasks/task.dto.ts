import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus, TaskPriority } from './task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}