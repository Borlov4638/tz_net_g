import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiSecurity,
} from '@nestjs/swagger';

export function SwaggerDecoratorsByDeleteTask(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Delete task by id' }),
        ApiNotFoundResponse({ description: 'Task with this id does not exist' }),
        ApiResponse({ description: 'Task was deleted', status: HttpStatus.NO_CONTENT }),
        ApiSecurity('bearer'),
        ApiForbiddenResponse({
            description: 'You do not have permission for this action',
        }),
    );
}
