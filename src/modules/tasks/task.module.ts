import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskEntity } from './entities/task.entity';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import { TaskRepository } from './repositories/task.repository';
import { RedisManagerModule } from '../redis/redis-manager.module';
@Module({
    controllers: [TaskController],
    providers: [TaskService, TaskRepository],
    imports: [TypeOrmModule.forFeature([TaskEntity]), RedisManagerModule],
})
export class TaskModule {}
