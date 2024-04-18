import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../entities/user.entity';
import { UserDataWithoutPassword } from '../types/user-without-pass.type';

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {}

    async createUser(
        email: string,
        password: string,
        username: string,
    ): Promise<UserDataWithoutPassword> {
        const user = new UserEntity();
        user.email = email;
        user.username = username;
        user.password = password;

        return this.userRepo
            .createQueryBuilder()
            .insert()
            .values(user)
            .returning('*')
            .execute()
            .then((result) => {
                delete result.generatedMaps[0].password; // remove password for safe
                return result.generatedMaps[0] as UserDataWithoutPassword;
            });
    }

    async getByEmail(email: string): Promise<UserEntity> {
        return this.userRepo.createQueryBuilder().where({ email }).getOne();
    }
}
