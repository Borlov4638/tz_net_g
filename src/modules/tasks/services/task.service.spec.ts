import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { RedisManagerService } from '../../../modules/redis/services/redis-manager.service';
import { UserEntity } from '../../../modules/users/entities/user.entity';
import { CreateTaskDTO } from '../dto/create-task.dto';
import { GetAllTasksQuery } from '../dto/get-all tasks.dto';
import { UpdateTaskDTO } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';
import { AllTasksViewModel, TaskService } from './task.service';

describe('TaskService', () => {
    let taskService: TaskService;
    let taskRepository: TaskRepository;
    let redisService: RedisManagerService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskService,
                {
                    provide: TaskRepository,
                    useValue: {
                        create: jest.fn(),
                        getAllWithPagination: jest.fn(),
                        getById: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: RedisManagerService,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        remove: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        taskService = module.get<TaskService>(TaskService);
        taskRepository = module.get<TaskRepository>(TaskRepository);
        redisService = module.get<RedisManagerService>(RedisManagerService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(taskService).toBeDefined();
    });

    describe('createTask', () => {
        it('should create a task', async () => {
            const userId = 'user123';
            const createTaskDto: CreateTaskDTO = {
                title: 'Task Title',
                description: 'Task Description',
            };
            const createdTask: TaskEntity = {
                id: 1,
                ...createTaskDto,
                status: createTaskDto.status,
                author: userId,
                user: {} as UserEntity,
            };

            jest.spyOn(taskRepository, 'create').mockResolvedValue(createdTask);

            const result = await taskService.createTask(userId, createTaskDto);

            expect(result).toEqual(createdTask);
            expect(taskRepository.create).toHaveBeenCalledWith(userId, createTaskDto);
        });
    });

    describe('getAllTasks', () => {
        it('should get all tasks', async () => {
            const query: GetAllTasksQuery = { page: 1, pageSize: 10 };
            const tasks: AllTasksViewModel = {
                meta: {
                    page: 1,
                    pageSize: 1,
                    totalPages: 1,
                    totalRecords: 1,
                    sortOrder: 'asc',
                    sortBy: 'title',
                },
                data: [],
            };

            jest.spyOn(redisService, 'get').mockResolvedValue(null);
            jest.spyOn(taskRepository, 'getAllWithPagination').mockResolvedValue(tasks);
            jest.spyOn(configService, 'get').mockReturnValue(300);

            const result = await taskService.getAllTasks(query);

            expect(result).toEqual(tasks);
            expect(redisService.get).toHaveBeenCalledWith('ALL_TASKS');
            expect(taskRepository.getAllWithPagination).toHaveBeenCalledWith(query);
            expect(redisService.set).toHaveBeenCalledWith('ALL_TASKS', tasks, 300);
        });

        it('should get all tasks from cache if available', async () => {
            const query: GetAllTasksQuery = { page: 1, pageSize: 10 };
            const tasks: AllTasksViewModel = {
                meta: {
                    page: 1,
                    pageSize: 1,
                    totalPages: 1,
                    totalRecords: 1,
                    sortOrder: 'asc',
                    sortBy: 'title',
                },
                data: [],
            };

            jest.spyOn(redisService, 'get').mockResolvedValue(tasks);

            const result = await taskService.getAllTasks(query);

            expect(result).toEqual(tasks);
            expect(redisService.get).toHaveBeenCalledWith('ALL_TASKS');
            expect(taskRepository.getAllWithPagination).not.toHaveBeenCalled();
        });
    });

    describe('TaskService', () => {
        // Предыдущий код...

        describe('getTaskById', () => {
            it('should get a task by ID', async () => {
                const taskId = 1;
                const task: TaskEntity = {
                    id: taskId,
                    title: 'Task Title',
                    description: 'Task Description',
                    status: false,
                    author: 'user123',
                    user: {} as UserEntity,
                };

                jest.spyOn(redisService, 'get').mockResolvedValue(null);
                jest.spyOn(taskRepository, 'getById').mockResolvedValue(task);
                jest.spyOn(configService, 'get').mockReturnValue(300);

                const result = await taskService.getTaskById(taskId);

                expect(result).toEqual(task);
                expect(redisService.get).toHaveBeenCalledWith(`ONE_TASK/${taskId}`);
                expect(taskRepository.getById).toHaveBeenCalledWith(taskId);
                expect(redisService.set).toHaveBeenCalledWith(
                    `ONE_TASK/${taskId}`,
                    task,
                    300,
                );
            });

            it('should get a task by ID from cache if available', async () => {
                const taskId = 1;
                const task: TaskEntity = {
                    id: taskId,
                    title: 'Task Title',
                    description: 'Task Description',
                    status: false,
                    author: 'user123',
                    user: {} as UserEntity,
                };

                jest.spyOn(redisService, 'get').mockResolvedValue(task);

                const result = await taskService.getTaskById(taskId);

                expect(result).toEqual(task);
                expect(redisService.get).toHaveBeenCalledWith(`ONE_TASK/${taskId}`);
                expect(taskRepository.getById).not.toHaveBeenCalled();
            });

            it('should throw NotFoundException if task not found', async () => {
                const taskId = 1;

                jest.spyOn(redisService, 'get').mockResolvedValue(null);
                jest.spyOn(taskRepository, 'getById').mockResolvedValue(null);

                await expect(taskService.getTaskById(taskId)).rejects.toThrow(
                    NotFoundException,
                );
                expect(redisService.get).toHaveBeenCalledWith(`ONE_TASK/${taskId}`);
                expect(taskRepository.getById).toHaveBeenCalledWith(taskId);
            });
        });

        describe('updateTask', () => {
            it('should update a task', async () => {
                const userId = 'user123';
                const taskId = 1;
                const updateTaskDto: UpdateTaskDTO = { title: 'Updated Task Title' };
                const task: TaskEntity = {
                    id: taskId,
                    title: 'Task Title',
                    description: 'Task Description',
                    status: false,
                    author: userId,
                    user: {} as UserEntity,
                };

                jest.spyOn(taskRepository, 'getById').mockResolvedValue(task);
                jest.spyOn(taskRepository, 'update').mockResolvedValue(undefined);

                await taskService.updateTask(userId, taskId, updateTaskDto);

                expect(taskRepository.getById).toHaveBeenCalledWith(taskId);
                expect(taskRepository.update).toHaveBeenCalledWith(taskId, updateTaskDto);
                expect(redisService.remove).toHaveBeenCalledWith(`ONE_TASK/${taskId}`);
            });

            it('should throw NotFoundException if task not found', async () => {
                const userId = 'user123';
                const taskId = 1;
                const updateTaskDto: UpdateTaskDTO = { title: 'Updated Task Title' };

                jest.spyOn(taskRepository, 'getById').mockResolvedValue(null);

                await expect(
                    taskService.updateTask(userId, taskId, updateTaskDto),
                ).rejects.toThrow(NotFoundException);
                expect(taskRepository.getById).toHaveBeenCalledWith(taskId);
                expect(taskRepository.update).not.toHaveBeenCalled();
                expect(redisService.remove).not.toHaveBeenCalled();
            });

            it('should throw UnauthorizedException if user is not the author of the task', async () => {
                const userId = 'user456';
                const taskId = 1;
                const updateTaskDto: UpdateTaskDTO = { title: 'Updated Task Title' };
                const task: TaskEntity = {
                    id: taskId,
                    title: 'Task Title',
                    description: 'Task Description',
                    status: false,
                    author: 'user123',
                    user: {} as UserEntity,
                };

                jest.spyOn(taskRepository, 'getById').mockResolvedValue(task);

                await expect(
                    taskService.updateTask(userId, taskId, updateTaskDto),
                ).rejects.toThrow(UnauthorizedException);
                expect(taskRepository.getById).toHaveBeenCalledWith(taskId);
                expect(taskRepository.update).not.toHaveBeenCalled();
                expect(redisService.remove).not.toHaveBeenCalled();
            });
        });

        describe('deleteTask', () => {
            it('should delete a task', async () => {
                const userId = 'user123';
                const taskId = 1;
                const task: TaskEntity = {
                    id: taskId,
                    title: 'Task Title',
                    description: 'Task Description',
                    status: false,
                    author: userId,
                    user: {} as UserEntity,
                };

                jest.spyOn(taskRepository, 'getById').mockResolvedValue(task);
                jest.spyOn(taskRepository, 'delete').mockResolvedValue(undefined);

                await taskService.deleteTask(userId, taskId);

                expect(taskRepository.getById).toHaveBeenCalledWith(taskId);
                expect(taskRepository.delete).toHaveBeenCalledWith(taskId);
                expect(redisService.remove).toHaveBeenCalledWith(`ONE_TASK/${taskId}`);
            });

            it('should throw NotFoundException if task not found', async () => {
                const userId = 'user123';
                const taskId = 1;

                jest.spyOn(taskRepository, 'getById').mockResolvedValue(null);

                await expect(taskService.deleteTask(userId, taskId)).rejects.toThrow(
                    NotFoundException,
                );
                expect(taskRepository.getById).toHaveBeenCalledWith(taskId);
                expect(taskRepository.delete).not.toHaveBeenCalled();
                expect(redisService.remove).not.toHaveBeenCalled();
            });

            it('should throw UnauthorizedException if user is not the author of the task', async () => {
                const userId = 'user456';
                const taskId = 1;
                const task: TaskEntity = {
                    id: taskId,
                    title: 'Task Title',
                    description: 'Task Description',
                    status: false,
                    author: 'user123',
                    user: {} as UserEntity,
                };

                jest.spyOn(taskRepository, 'getById').mockResolvedValue(task);

                await expect(taskService.deleteTask(userId, taskId)).rejects.toThrow(
                    UnauthorizedException,
                );
                expect(taskRepository.getById).toHaveBeenCalledWith(taskId);
                expect(taskRepository.delete).not.toHaveBeenCalled();
                expect(redisService.remove).not.toHaveBeenCalled();
            });
        });
    });
});
