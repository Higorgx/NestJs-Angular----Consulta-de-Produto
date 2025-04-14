import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  data?: T;

  @ApiProperty()
  errors?: string[];

  constructor(partial: Partial<BaseResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
