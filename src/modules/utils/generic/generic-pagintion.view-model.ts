import { ApiProperty } from '@nestjs/swagger';

export class GenericPaginationViewModel {
    @ApiProperty({
        type: 'object',
        properties: {
            page: { type: 'number', example: 1 },
            pageSize: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 1 },
            totalRecords: { type: 'number', example: 1 },
            sortOrder: { type: 'string', example: 'descending' },
            sortBy: { type: 'string', example: 'title' },
        },
    })
    meta: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalRecords: number;
        sortOrder: string;
        sortBy: string;
    };
    @ApiProperty({ isArray: true })
    data: any[];
}
