import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GenericFilter } from '../../../modules/utils/generic/generic-parigation-filter';

enum TasksSortByEnum {
    id = 'id',
    title = 'title',
    description = 'description',
    status = 'status',
    author = 'author',
}

export class GetAllTasksQuery extends GenericFilter {
    @IsString()
    @IsEnum(TasksSortByEnum)
    @IsOptional()
    public sortBy?: TasksSortByEnum;
}
