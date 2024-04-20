import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { TokenPair } from '../types/token-pair.type';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private sessionService: SessionService,
    ) {}
    private readonly logger = new Logger(AuthService.name);

    async refresh(
        userId: string,
        username: string,
        deviceId: string,
    ): Promise<TokenPair> {
        this.logger.log(`Refreshing token for ${username} (User ID: ${userId})`);
        const tokens = await this.getTokens(userId, username, deviceId);
        const refreshHash = tokens.refreshToken.split('.')[2];
        await this.sessionService.createSession(userId, deviceId, refreshHash);
        return tokens;
    }

    async login(userId: string, username: string): Promise<TokenPair> {
        this.logger.log(`User ${username} is logging in`);

        const deviceId = uuidv4();
        const tokens = await this.getTokens(userId, username, deviceId);
        const refreshHash = tokens.refreshToken.split('.')[2];
        await this.sessionService.createSession(userId, deviceId, refreshHash);
        return tokens;
    }

    async logout(deviceId: string): Promise<void> {
        this.logger.log(`Device ${deviceId} is logging out`);
        await this.sessionService.deleteSession(deviceId);
    }

    private async getTokens(
        userId: string,
        username: string,
        deviceId: string,
    ): Promise<TokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    id: userId,
                    username,
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: +this.configService.get<number>('JWT_ACCESS_EXP'),
                },
            ),
            this.jwtService.signAsync(
                {
                    id: userId,
                    username,
                    deviceId,
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: +this.configService.get<number>('JWT_REFRESH_EXP'),
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
