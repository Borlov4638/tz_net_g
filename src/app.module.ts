import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/db/database.module';
import { UserModule } from './modules/users/user.module';
import { TaskModule } from './modules/tasks/task.module';
import { ConfigModule } from '@nestjs/config';
import getConfig from './modules/db/config/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [getConfig] }),
        DatabaseModule,
        UserModule,
        TaskModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
