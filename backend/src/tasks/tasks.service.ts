import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { TimeEntry } from './time-entry.entity';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TimeEntry)
    private timeEntriesRepository: Repository<TimeEntry>,
  ) {}

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      userId,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(
    userId: string,
    status?: TaskStatus,
    category?: string,
    priority?: string,
    search?: string,
  ): Promise<Task[]> {
    const where: any = { userId };

    if (status) where.status = status;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (search) where.title = Like(`%${search}%`);

    return this.tasksRepository.find({
      where,
      relations: ['timeEntries'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, userId },
      relations: ['timeEntries'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id, userId);
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
  }

  async startTimer(id: string, userId: string): Promise<TimeEntry> {
    const task = await this.findOne(id, userId);

    const activeTimer = await this.timeEntriesRepository.findOne({
      where: { taskId: id, endTime: IsNull() },
    });

    if (activeTimer) {
      throw new BadRequestException('Timer is already running for this task');
    }

    task.status = TaskStatus.IN_PROGRESS;
    await this.tasksRepository.save(task);

    const timeEntry = this.timeEntriesRepository.create({
      taskId: id,
      startTime: new Date(),
    });

    return this.timeEntriesRepository.save(timeEntry);
  }

  async stopTimer(id: string, userId: string): Promise<TimeEntry> {
    const task = await this.findOne(id, userId);

    const activeTimer = await this.timeEntriesRepository.findOne({
      where: { taskId: id, endTime: IsNull() },
    });

    if (!activeTimer) {
      throw new BadRequestException('No active timer found for this task');
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeTimer.startTime.getTime()) / 1000);

    activeTimer.endTime = endTime;
    activeTimer.duration = duration;

    return this.timeEntriesRepository.save(activeTimer);
  }

  async getTotalTime(taskId: string): Promise<number> {
    const timeEntries = await this.timeEntriesRepository.find({
      where: { taskId },
    });

    return timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0);
  }
}