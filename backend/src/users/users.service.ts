import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(email: string, password: string, name: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getStats(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['tasks', 'tasks.timeEntries'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const tasksCompletedToday = user.tasks.filter(
      task => task.status === 'completed' && task.updatedAt >= todayStart
    ).length;

    const tasksCompletedWeek = user.tasks.filter(
      task => task.status === 'completed' && task.updatedAt >= weekStart
    ).length;

    let totalTimeToday = 0;
    let totalTimeWeek = 0;

    user.tasks.forEach(task => {
      task.timeEntries?.forEach(entry => {
        if (entry.startTime >= todayStart) {
          totalTimeToday += entry.duration || 0;
        }
        if (entry.startTime >= weekStart) {
          totalTimeWeek += entry.duration || 0;
        }
      });
    });

    return {
      tasksCompletedToday,
      tasksCompletedWeek,
      totalHoursToday: Math.round((totalTimeToday / 3600) * 10) / 10,
      totalHoursWeek: Math.round((totalTimeWeek / 3600) * 10) / 10,
      totalTasks: user.tasks.length,
      completedTasks: user.tasks.filter(t => t.status === 'completed').length,
    };
  }
}