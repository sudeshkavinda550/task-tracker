import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskStatus } from './task.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(@Request() req: any, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.userId, createTaskDto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('status') status?: TaskStatus,
    @Query('category') category?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
  ) {
    return this.tasksService.findAll(req.user.userId, status, category, priority, search);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, req.user.userId, updateTaskDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.tasksService.remove(id, req.user.userId);
  }

  @Post(':id/start')
  startTimer(@Request() req: any, @Param('id') id: string) {
    return this.tasksService.startTimer(id, req.user.userId);
  }

  @Post(':id/stop')
  stopTimer(@Request() req: any, @Param('id') id: string) {
    return this.tasksService.stopTimer(id, req.user.userId);
  }
}