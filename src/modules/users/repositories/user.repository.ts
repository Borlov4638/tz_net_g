import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../entities/user.entity';
import { UserDataWithoutPassword } from '../types/user-without-pass.type';

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {}

    async createUser(user: UserEntity): Promise<UserDataWithoutPassword> {
        return this.userRepo
            .createQueryBuilder()
            .insert()
            .into(UserEntity)
            .values(user)
            .returning('*')
            .execute()
            .then((result) => {
                delete result.generatedMaps[0].password; // remove password for safe
                return result.generatedMaps[0] as UserDataWithoutPassword;
            });
    }

    async getByEmail(email: string): Promise<UserEntity> {
        return this.userRepo
            .createQueryBuilder('u')
            .where('u.email = :email', { email })
            .getOne();
    }
}
