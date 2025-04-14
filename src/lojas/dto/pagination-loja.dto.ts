import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationLojaDto {
  @ApiPropertyOptional({
    example: 10,
    description: 'Limite de lojas por página (padrão: 10)',
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 1,
    description: 'Número da página de lojas (padrão: 1)',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 'descricao',
    description: 'Campo pelo qual ordenar as lojas',
    default: 'id',
  })
  @IsOptional()
  @IsString()
  orderBy?: string = 'id';

  @ApiPropertyOptional({
    example: 'asc',
    description: 'Direção da ordenação (asc ou desc)',
    default: 'asc',
  })
  @IsOptional()
  @IsString()
  orderDirection?: 'asc' | 'desc' = 'asc';
}
