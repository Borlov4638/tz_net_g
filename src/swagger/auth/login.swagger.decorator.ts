import { applyDecorators } from '@nestjs/common';
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiSecurity,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserLoginDTO } from '../../modules/auth/dto/user-login.dto';

export function SwaggerDecoratorsByLogin(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Login a user' }),
        ApiUnauthorizedResponse({ description: 'Invalid credentials' }),
        ApiSecurity('basic'),
        ApiBody({ type: UserLoginDTO }),
        ApiOkResponse({
            description: 'Access token and refresh token',
            schema: {
                type: 'object',
                properties: {
                    accessToken: {
                        type: 'string',
                    },
                    refreshToken: {
                        type: 'string',
                    },
                },
            },
        }),
    );
}
