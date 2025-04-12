// common/dto/paginated-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base-response.dto';

export class PaginatedResponseDto<T> extends BaseResponseDto<T[]> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  lastPage: number;

  constructor(partial: Partial<PaginatedResponseDto<T>>) {
    super(partial);
    Object.assign(this, partial);
  }
}
