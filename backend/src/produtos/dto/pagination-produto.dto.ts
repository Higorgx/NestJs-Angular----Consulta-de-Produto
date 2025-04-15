import { IsOptional, IsInt, Min, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationProdutoDto {
  @ApiPropertyOptional({
    example: 10,
    description: 'Limite de itens por página',
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 1,
    description: 'Número da página',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 'descricao',
    description: 'Campo de ordenação',
    default: 'id',
  })
  @IsOptional()
  @IsString()
  orderBy?: string = 'id';

  @ApiPropertyOptional({
    example: 'asc',
    description: 'Direção da ordenação',
    default: 'asc',
  })
  @IsOptional()
  @IsString()
  orderDirection?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({ example: 100, description: 'Preço de venda mínimo' })
  @IsOptional()
  @IsNumber()
  vendaMin?: number;

  @ApiPropertyOptional({ example: 500, description: 'Preço de venda máximo' })
  @IsOptional()
  @IsNumber()
  vendaMax?: number;
}
