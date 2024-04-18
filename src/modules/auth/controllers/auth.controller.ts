import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { User } from '../../../decorators/get-user-from-request.decorator';
import { UserDataWithoutPassword } from '../../../modules/users/types/user-without-pass.type';
import { UserService } from '../../users/services/user.service';
import { UserRegistrationDTO } from '../dto/user-registration.dto';
import { LocalAuthGuard } from '../guards/local-auth-guard.guard';
import { RefreshTokenAuthGuard } from '../guards/refresh-jwt.guard';
import { UsernameExistGuard } from '../guards/user-exists.guard';
import { AuthService } from '../services/auth.service';
import { UsersRefreshTokenPayload } from '../types/refresh-token-payload.type';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private authService: AuthService) {}

    //TODO: перенести guard в функционал сервиса юзеров при создании сущности
    @UseGuards(UsernameExistGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post('registration')
    async registerUser(
        @Body() dto: UserRegistrationDTO,
    ): Promise<UserDataWithoutPassword> {
        return this.userService.createUser(dto.email, dto.password, dto.username);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async loginUser(
        @User() user: UserDataWithoutPassword,
        @Res() res: Response,
    ): Promise<Response> {
        const tokens = await this.authService.login(user.id, user.username);

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
        });
        return res.status(200).json({ accessToken: tokens.accessToken });
    }

    @UseGuards(RefreshTokenAuthGuard)
    @Post('refresh')
    async refreshToken(
        @User() user: UsersRefreshTokenPayload,
        @Res() res: Response,
    ): Promise<Response> {
        const tokens = await this.authService.refresh(
            user.id,
            user.username,
            user.deviceId,
        );
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
        });
        return res.status(200).json({ accessToken: tokens.accessToken });
    }

    @UseGuards(RefreshTokenAuthGuard)
    @Post('logout')
    async logout(@User() user: UsersRefreshTokenPayload): Promise<void> {
        await this.authService.logout(user.deviceId);
    }
}
