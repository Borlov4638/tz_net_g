import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { TaskEntity } from '../../modules/tasks/entities/task.entity';

export function SwaggerDecoratorsByGetOneTask(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Get task by id' }),
        ApiOkResponse({
            description: 'Returns a single task',
            type: TaskEntity,
        }),
        ApiNotFoundResponse({ description: 'Task with selected id does not exists' }),
    );
}
