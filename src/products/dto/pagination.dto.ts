import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    example: 10,
    description: 'Limite de itens por página (padrão: 10)',
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 1,
    description: 'numero da pagina (padrão: 1)',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number = 1;
}
