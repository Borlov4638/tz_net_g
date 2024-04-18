import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../entities/user.entity';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
    let userRepository: UserRepository;
    let userRepo: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRepository,
                {
                    provide: getRepositoryToken(UserEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        userRepository = module.get<UserRepository>(UserRepository);
        userRepo = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    });

    describe('createUser', () => {
        it('should create a new user and return user data without password', async () => {
            const mockUser: UserEntity = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testuser',
                articles: [],
                createdAt: new Date().toISOString(),
                id: 'uuid',
            };

            const mockCreatedUser = { ...mockUser };
            delete mockCreatedUser.password;

            jest.spyOn(userRepo, 'createQueryBuilder').mockReturnValueOnce({
                insert: jest.fn().mockReturnThis(),
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    generatedMaps: [mockCreatedUser],
                }),
            } as any);

            const result = await userRepository.createUser(
                mockUser.email,
                mockUser.password,
                mockUser.username,
            );

            expect(result).toEqual(mockCreatedUser);
        });
    });

    describe('getByEmail', () => {
        it('should return user by email', async () => {
            const mockUser: UserEntity = {
                articles: [],
                createdAt: new Date().toISOString(),
                id: 'uuid',
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
            };

            jest.spyOn(userRepo, 'createQueryBuilder').mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValueOnce(mockUser),
            } as any);

            const result = await userRepository.getByEmail(mockUser.email);

            expect(result).toEqual(mockUser);
        });
    });
});
