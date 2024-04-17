import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDTO } from '../dto/create-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { UpdateTaskDTO } from '../dto/update-task.dto';
import { GetAllTasksQuery } from '../dto/get-all tasks.dto';

@Injectable()
export class TaskRepository {
    constructor(@InjectRepository(TaskEntity) private taskRepo: Repository<TaskEntity>) {}

    async getAllWithPagination(query: GetAllTasksQuery) {
        const page = +query.page || 1;
        const pageSize = +query.pageSize || 10;
        const skip = (page - 1) * pageSize;
        const sortOrder = query.sortOrder || 'DESC';
        const sortBy = query.sortBy || 'title';
        return this.taskRepo
            .findAndCount({
                where: {},
                order: { [sortBy]: `${sortOrder}` },
                skip: skip,
                take: pageSize,
            })
            .then(([results, total]) => ({
                meta: {
                    page,
                    pageSize,
                    totalPages: Math.ceil(total / pageSize),
                    totalRecords: total,
                    sortOrder: sortOrder === 'ASC' ? 'ascending' : 'descending',
                    sortBy: sortBy,
                },
                data: results,
            }));
    }

    async create(userId: string, data: CreateTaskDTO): Promise<TaskEntity> {
        try {
            const task = new TaskEntity();
            task.author = userId;
            task.description = data.description;
            task.title = data.title;
            task.status = data.status ? data.status : false;
            return await this.taskRepo.save(task);
        } catch (e) {
            console.log('Error creating a task', e);
            throw e;
        }
    }

    async getById(id: number): Promise<TaskEntity | undefined> {
        try {
            return await this.taskRepo.findOne({ where: { id } });
        } catch (e) {
            console.log('Error getting a task', e);
            throw e;
        }
    }

    async update(id: number, data: UpdateTaskDTO): Promise<void> {
        try {
            await this.taskRepo.update({ id }, data);
        } catch (e) {
            console.log('Error updating a task', e);
            throw e;
        }
    }
    async delete(id: number): Promise<void> {
        try {
            await this.taskRepo.delete({ id });
        } catch (e) {
            console.log('Error deleting a task', e);
            throw e;
        }
    }
}
