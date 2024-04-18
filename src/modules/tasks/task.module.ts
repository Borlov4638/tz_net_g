import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisManagerModule } from '../redis/redis-manager.module';
import { TaskController } from './controllers/task.controller';
import { TaskEntity } from './entities/task.entity';
import { TaskRepository } from './repositories/task.repository';
import { TaskService } from './services/task.service';
@Module({
    controllers: [TaskController],
    providers: [TaskService, TaskRepository],
    imports: [TypeOrmModule.forFeature([TaskEntity]), RedisManagerModule],
})
export class TaskModule {}
