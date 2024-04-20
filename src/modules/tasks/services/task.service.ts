import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisManagerService } from '../../../modules/redis/services/redis-manager.service';
import { CreateTaskDTO } from '../dto/create-task.dto';
import { GetAllTasksQuery } from '../dto/get-all tasks.dto';
import { AllTasksViewModel } from '../dto/get-all-tasks.dto';
import { UpdateTaskDTO } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';

@Injectable()
export class TaskService {
    constructor(
        private taskRepository: TaskRepository,
        private redisService: RedisManagerService,
        private configService: ConfigService,
    ) {}

    async createTask(userId: string, data: CreateTaskDTO): Promise<TaskEntity> {
        return this.taskRepository.create(userId, data);
    }

    async getAllTasks(query: GetAllTasksQuery): Promise<AllTasksViewModel> {
        //check if cache exists
        const cache: AllTasksViewModel = await this.redisService.get('ALL_TASKS');
        if (cache) {
            return cache;
        }
        const response = await this.taskRepository.getAllWithPagination(query);

        // Store in cache for 5 minutes
        this.redisService.set(
            `ALL_TASKS`,
            response,
            +this.configService.get<number>('TASK_CACHE_TIME'),
        );
        return response;
    }

    async getTaskById(id: number): Promise<TaskEntity> {
        //check if cache exists
        const cache: TaskEntity = await this.redisService.get(`ONE_TASK/${id}`);
        if (cache) {
            return cache;
        }

        const task = await this.taskRepository.getById(id);
        if (!task) {
            throw new NotFoundException('The task with the given ID was not found');
        }

        // Store in cache for 5 minutes
        this.redisService.set(
            `ONE_TASK/${id}`,
            task,
            +this.configService.get<number>('TASK_CACHE_TIME'),
        );
        return task;
    }

    async updateTask(userId: string, taskId: number, data: UpdateTaskDTO): Promise<void> {
        const task = await this.taskRepository.getById(taskId);
        if (!task) {
            throw new NotFoundException('This task does not exist');
        }
        if (task.author !== userId) {
            throw new UnauthorizedException(
                "You don't have permission to edit this task",
            );
        }
        await this.taskRepository.update(taskId, data);
        //invalidate cache for this article
        await this.redisService.remove(`ONE_TASK/${taskId}`);
    }

    async deleteTask(userId: string, taskId: number): Promise<void> {
        const task = await this.taskRepository.getById(taskId);
        if (!task) {
            throw new NotFoundException('This task is not found');
        }
        if (task.author !== userId) {
            throw new UnauthorizedException(
                "You don't have permission to delete this task",
            );
        }
        await this.taskRepository.delete(taskId);

        //invalidate cache for this article
        await this.redisService.remove(`ONE_TASK/${taskId}`);
    }
}
export { AllTasksViewModel };
