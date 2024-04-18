import { applyDecorators } from '@nestjs/common';
import {
    ApiCookieAuth,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SwaggerDecoratorsByRefreshToken(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Refresh access token' }),
        ApiUnauthorizedResponse({
            description: 'Invalid refresh token',
        }),
        ApiOkResponse({
            description: 'New access token',
            schema: {
                type: 'object',
                properties: {
                    accessToken: {
                        type: 'string',
                    },
                },
            },
        }),
        ApiCookieAuth('RefreshToken'),
    );
}
