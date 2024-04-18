import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDTO } from '../dto/create-task.dto';
import { GetAllTasksQuery } from '../dto/get-all tasks.dto';
import { UpdateTaskDTO } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { AllTasksViewModel } from '../services/task.service';

@Injectable()
export class TaskRepository {
    constructor(@InjectRepository(TaskEntity) private taskRepo: Repository<TaskEntity>) {}

    async getAllWithPagination(query: GetAllTasksQuery): Promise<AllTasksViewModel> {
        const page = +query.page || 1;
        const pageSize = +query.pageSize || 10;
        const sortOrder = query.sortOrder || 'DESC';
        const sortBy = query.sortBy || 'title';

        const [results, total] = await this.taskRepo
            .createQueryBuilder('task')
            .orderBy(`task.${sortBy}`, sortOrder)
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        return {
            meta: {
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
                totalRecords: total,
                sortOrder: sortOrder === 'ASC' ? 'ascending' : 'descending',
                sortBy: sortBy,
            },
            data: results,
        };
    }

    async create(userId: string, data: CreateTaskDTO): Promise<TaskEntity> {
        try {
            const task = new TaskEntity();
            task.author = userId;
            task.description = data.description;
            task.title = data.title;
            task.status = data.status ? data.status : false;
            return this.taskRepo
                .createQueryBuilder()
                .insert()
                .values(task)
                .returning('*')
                .execute()
                .then((result) => result.generatedMaps[0] as TaskEntity);
        } catch (e) {
            console.log('Error creating a task', e);
            throw e;
        }
    }

    async getById(id: number): Promise<TaskEntity | undefined> {
        try {
            return await this.taskRepo.createQueryBuilder().where({ id }).getOne();
        } catch (e) {
            console.log('Error getting a task', e);
            throw e;
        }
    }

    async update(id: number, data: UpdateTaskDTO): Promise<void> {
        try {
            await this.taskRepo
                .createQueryBuilder()
                .update()
                .set({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                })
                .where({ id })
                .execute();
        } catch (e) {
            console.log('Error updating a task', e);
            throw e;
        }
    }
    async delete(id: number): Promise<void> {
        try {
            await this.taskRepo.createQueryBuilder().delete().where({ id }).execute();
        } catch (e) {
            console.log('Error deleting a task', e);
            throw e;
        }
    }
}
