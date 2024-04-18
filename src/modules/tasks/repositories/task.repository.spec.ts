import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRepository } from './task.repository';
import { TaskEntity } from '../entities/task.entity';
import { CreateTaskDTO } from '../dto/create-task.dto';
import { GetAllTasksQuery, TasksSortByEnum } from '../dto/get-all tasks.dto';
import { SortOrder } from '../../../modules/utils/generic/generic-parigation-filter';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UpdateTaskDTO } from '../dto/update-task.dto';

describe('TaskRepository', () => {
    let taskRepository: TaskRepository;
    let taskRepo: Repository<TaskEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskRepository,
                {
                    provide: getRepositoryToken(TaskEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        taskRepository = module.get<TaskRepository>(TaskRepository);
        taskRepo = module.get<Repository<TaskEntity>>(getRepositoryToken(TaskEntity));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllWithPagination', () => {
        it('should return all tasks with pagination information', async () => {
            const mockQuery: GetAllTasksQuery = {
                page: 1,
                pageSize: 10,
                sortOrder: SortOrder.DESC,
                sortBy: TasksSortByEnum.title,
            };
            const mockTasks: TaskEntity[] = [
                {
                    id: 1,
                    title: 'Task 1',
                    author: 'some uuid',
                    description: 'some descr',
                    status: true,
                    user: {} as UserEntity,
                },
                {
                    id: 2,
                    title: 'Task 2',
                    author: 'some uuid',
                    description: 'some descr',
                    status: true,
                    user: {} as UserEntity,
                },
            ];
            const mockTotal = 2;

            jest.spyOn(taskRepo, 'createQueryBuilder').mockReturnValueOnce({
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValueOnce([mockTasks, mockTotal]),
            } as any);

            const result = await taskRepository.getAllWithPagination(mockQuery);

            expect(result.data).toEqual(mockTasks);
            expect(result.meta.totalRecords).toEqual(mockTotal);
            expect(result.meta.page).toEqual(mockQuery.page);
            expect(result.meta.pageSize).toEqual(mockQuery.pageSize);
        });
    });

    describe('create', () => {
        it('should create a new task', async () => {
            const mockUserId = 'user123';
            const mockData: CreateTaskDTO = {
                title: 'New Task',
                description: 'Task description',
                status: false,
            };
            const mockTask: TaskEntity = {
                id: 1,
                ...mockData,
                status: mockData.status,
                author: mockUserId,
                user: {} as UserEntity,
            };

            jest.spyOn(taskRepo, 'createQueryBuilder').mockReturnValueOnce({
                insert: jest.fn().mockReturnThis(),
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    generatedMaps: [mockTask],
                }),
            } as any);

            const result = await taskRepository.create(mockUserId, mockData);

            expect(result).toEqual(mockTask);
        });
    });

    describe('getById', () => {
        it('should return a task by id', async () => {
            const mockId = 1;
            const mockTask = { id: mockId, title: 'Task 1' };

            jest.spyOn(taskRepo, 'createQueryBuilder').mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValueOnce(mockTask),
            } as any);

            const result = await taskRepository.getById(mockId);

            expect(result).toEqual(mockTask);
        });

        it('should return undefined if task with given id does not exist', async () => {
            const mockId = 999;

            jest.spyOn(taskRepo, 'createQueryBuilder').mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValueOnce(undefined),
            } as any);

            const result = await taskRepository.getById(mockId);

            expect(result).toBeUndefined();
        });
    });

    describe('update', () => {
        it('should update a task', async () => {
            const mockId = 1;
            const mockData: UpdateTaskDTO = {
                title: 'Updated Task',
                description: 'Updated description',
                status: true,
            };

            const mockQueryBuilder = {
                update: jest.fn().mockReturnThis(),
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                execute: jest.fn(),
            };

            jest.spyOn(taskRepo, 'createQueryBuilder').mockReturnValueOnce(
                mockQueryBuilder as any,
            );

            await taskRepository.update(mockId, mockData);

            expect(mockQueryBuilder.update).toHaveBeenCalled();
            expect(mockQueryBuilder.set).toHaveBeenCalledWith(mockData);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: mockId });
            expect(mockQueryBuilder.execute).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete a task by id', async () => {
            const mockId = 1;

            const mockQueryBuilder = {
                delete: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                execute: jest.fn(),
            };

            jest.spyOn(taskRepo, 'createQueryBuilder').mockReturnValueOnce(
                mockQueryBuilder as any,
            );

            await taskRepository.delete(mockId);

            expect(mockQueryBuilder.delete).toHaveBeenCalledWith();
            expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: mockId });
            expect(mockQueryBuilder.execute).toHaveBeenCalled();
        });
    });
});
