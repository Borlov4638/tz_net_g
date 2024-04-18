import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CryptoService } from '../../utils/crypto/crypto.service';
import { UserEntity } from '../entities/user.entity'; // Ensure this import
import { UserRepository } from '../repositories/user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;
    let userRepository: UserRepository;
    let cryptoService: CryptoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                UserRepository,
                CryptoService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get<UserRepository>(UserRepository);
        cryptoService = module.get<CryptoService>(CryptoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createUser', () => {
        const mockedUser = {
            id: 'someuuid',
            email: 'test@example.com',
            username: 'testuser',
            articles: [],
            createdAt: new Date().toISOString(),
            password: 'changeme',
        } as UserEntity;
        it('should create a user and return user data without password', async () => {
            const createUserSpy = jest
                .spyOn(userRepository, 'createUser')
                .mockResolvedValueOnce(mockedUser);

            const email = 'test@example.com';
            const password = 'password';
            const username = 'testuser';

            const result = await service.createUser(email, password, username);

            expect(createUserSpy).toHaveBeenCalledWith(
                email,
                expect.any(String),
                username,
            );
            expect(result).toEqual(mockedUser);
        });
    });

    describe('validateUser', () => {
        const mockedUser = {
            id: 'someuuid',
            email: 'test@example.com',
            username: 'testuser',
            articles: [],
            createdAt: new Date().toISOString(),
            password: 'hashed pass',
        } as UserEntity;
        it('should validate user credentials and return user data without password', async () => {
            const findUserByEmailSpy = jest
                .spyOn(userRepository, 'getByEmail')
                .mockResolvedValueOnce(mockedUser);

            const compareHashSpy = jest
                .spyOn(cryptoService, 'compareHash')
                .mockResolvedValueOnce(true);

            const email = mockedUser.email;
            const pass = mockedUser.password;

            const result = await service.validateUser(email, pass);

            expect(findUserByEmailSpy).toHaveBeenCalledWith(email);
            expect(compareHashSpy).toHaveBeenCalledWith(pass, mockedUser.password);
            const { password, ...userWithoutPass } = mockedUser;
            expect(result).toEqual(userWithoutPass);
        });

        it('should throw UnauthorizedException when user credentials are invalid', async () => {
            jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(null);

            const email = 'test@example.com';
            const password = 'password';

            await expect(service.validateUser(email, password)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });
});
