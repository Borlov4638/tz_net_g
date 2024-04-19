import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    ApiBody,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiSecurity,
} from '@nestjs/swagger';
import { UpdateTaskDTO } from '../../modules/tasks/dto/update-task.dto';

export function SwaggerDecoratorsByUpdateTask(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Update task by id' }),
        ApiNotFoundResponse({ description: 'Task with this id does not exist' }),
        ApiResponse({ description: 'Task was updated', status: HttpStatus.NO_CONTENT }),
        ApiBody({ description: 'Data to update selected task', type: UpdateTaskDTO }),
        ApiSecurity('bearer'),
        ApiForbiddenResponse({
            description: 'You do not have permission for this action',
        }),
    );
}
