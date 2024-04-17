import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { User } from 'src/decorators/get-user-from-request.decorator';
import { AccessTokenAuthGuard } from 'src/modules/auth/guards/access-jwt.guard';
import { UsersAccessTokenPayload } from 'src/modules/auth/types/access-token-payload.type';

import { CreateTaskDTO } from '../dto/create-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { TaskService } from '../services/task.service';
import { UpdateTaskDTO } from '../dto/update-task.dto';
import { GetAllTasksQuery } from '../dto/get-all tasks.dto';

@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get()
    async getAllTasks(@Query() query: GetAllTasksQuery) {
        return this.taskService.getAllTasks(query);
    }

    @Get(':id')
    async getTaskById(@Param('id', new ParseIntPipe()) id: number): Promise<TaskEntity> {
        return this.taskService.getTaskById(id);
    }

    @UseGuards(AccessTokenAuthGuard)
    @Post()
    async createTask(
        @User() user: UsersAccessTokenPayload,
        @Body() dto: CreateTaskDTO,
    ): Promise<TaskEntity> {
        return this.taskService.createTask(user.id, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AccessTokenAuthGuard)
    @Put(':id')
    async updateTask(
        @Param('id', new ParseIntPipe()) taskId: number,
        @Body() dto: UpdateTaskDTO,
        @User() user: UsersAccessTokenPayload,
    ): Promise<void> {
        await this.taskService.updateTask(user.id, taskId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AccessTokenAuthGuard)
    @Delete(':id')
    async deleteTask(
        @Param('id', new ParseIntPipe()) taskId: number,
        @User() user: UsersAccessTokenPayload,
    ): Promise<void> {
        await this.taskService.deleteTask(user.id, taskId);
    }
}