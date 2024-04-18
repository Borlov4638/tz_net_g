import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../utils/utils.module';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), UtilsModule],
    providers: [UserService, UserRepository],
    exports: [UserService],
})
export class UserModule {}
