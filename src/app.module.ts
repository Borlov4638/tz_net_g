import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import getConfig from './modules/db/config/config';
import { DatabaseModule } from './modules/db/database.module';
import { RedisManagerModule } from './modules/redis/redis-manager.module';
import { TaskModule } from './modules/tasks/task.module';
import { UserModule } from './modules/users/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [getConfig] }),
        DatabaseModule,
        UserModule,
        TaskModule,
        AuthModule,
        RedisManagerModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
