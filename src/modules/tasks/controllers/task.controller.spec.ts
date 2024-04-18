import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../services/task.service';
import { CreateTaskDTO } from '../dto/create-task.dto';
import { GetAllTasksQuery } from '../dto/get-all tasks.dto';
import { UpdateTaskDTO } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { AllTasksViewModel } from '../services/task.service';
import { UserEntity } from '../../../modules/users/entities/user.entity';

describe('TaskController', () => {
    let controller: TaskController;
    let taskService: TaskService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TaskController],
            providers: [
                {
                    provide: TaskService,
                    useValue: {
                        getAllTasks: jest.fn(),
                        getTaskById: jest.fn(),
                        createTask: jest.fn(),
                        updateTask: jest.fn(),
                        deleteTask: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TaskController>(TaskController);
        taskService = module.get<TaskService>(TaskService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAllTasks', () => {
        it('should return all tasks', async () => {
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
            jest.spyOn(taskService, 'getAllTasks').mockResolvedValue(tasks);

            const result = await controller.getAllTasks(query);

            expect(result).toBe(tasks);
            expect(taskService.getAllTasks).toHaveBeenCalledWith(query);
        });
    });

    describe('getTaskById', () => {
        it('should return a task by ID', async () => {
            const taskId = 1;
            const task: TaskEntity = {
                id: taskId,
                title: 'Task Title',
                description: 'Task Description',
                status: false,
                author: 'some uuid',
                user: {} as UserEntity,
            };
            jest.spyOn(taskService, 'getTaskById').mockResolvedValue(task);

            const result = await controller.getTaskById(taskId);

            expect(result).toBe(task);
            expect(taskService.getTaskById).toHaveBeenCalledWith(taskId);
        });
    });

    describe('createTask', () => {
        it('should create a task', async () => {
            const userId = 'user123';
            const createTaskDto: CreateTaskDTO = {
                title: 'Task Title',
                description: 'Task Description',
            };
            const createdTask: TaskEntity = {
                ...createTaskDto,
                id: 1,
                status: false,
                author: 'some uuid',
                user: {} as UserEntity,
            };
            jest.spyOn(taskService, 'createTask').mockResolvedValue(createdTask);

            const result = await controller.createTask(
                { id: userId, username: 'username' },
                createTaskDto,
            );

            expect(result).toBe(createdTask);
            expect(taskService.createTask).toHaveBeenCalledWith(userId, createTaskDto);
        });
    });

    describe('updateTask', () => {
        it('should update a task', async () => {
            const userId = 'user123';
            const taskId = 1;
            const updateTaskDto: UpdateTaskDTO = { title: 'Updated Task Title' };
            jest.spyOn(taskService, 'updateTask').mockResolvedValue(undefined);

            await controller.updateTask(taskId, updateTaskDto, {
                id: userId,
                username: 'username',
            });

            expect(taskService.updateTask).toHaveBeenCalledWith(
                userId,
                taskId,
                updateTaskDto,
            );
        });
    });

    describe('deleteTask', () => {
        it('should delete a task', async () => {
            const userId = 'user123';
            const taskId = 1;
            jest.spyOn(taskService, 'deleteTask').mockResolvedValue(undefined);

            await controller.deleteTask(taskId, { id: userId, username: 'username' });

            expect(taskService.deleteTask).toHaveBeenCalledWith(userId, taskId);
        });
    });
});
