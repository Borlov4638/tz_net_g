import { applyDecorators } from '@nestjs/common';
import {
    ApiCookieAuth,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SwaggerDecoratorsByLogout(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Logout user' }),
        ApiOkResponse({ description: 'User logged out successfully' }),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        ApiCookieAuth('refreshToken'),
    );
}
