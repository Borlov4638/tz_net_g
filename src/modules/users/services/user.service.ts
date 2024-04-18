import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CryptoService } from '../../utils/crypto/crypto.service';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserDataWithoutPassword } from '../types/user-without-pass.type';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private cryptoService: CryptoService,
    ) {}

    async createUser(
        email: string,
        password: string,
        username: string,
    ): Promise<UserDataWithoutPassword> {
        const user = new UserEntity();
        user.email = email;
        user.username = username;
        user.password = await this.cryptoService.hashData(password);
        return this.userRepository.createUser(user);
    }

    async findUserByEmail(email: string): Promise<UserEntity> {
        return this.userRepository.getByEmail(email);
    }

    async validateUser(email: string, pass: string): Promise<UserDataWithoutPassword> {
        const user = await this.findUserByEmail(email);
        if (!user || !(await this.cryptoService.compareHash(pass, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { password, ...userData } = user;
        return userData;
    }
}
