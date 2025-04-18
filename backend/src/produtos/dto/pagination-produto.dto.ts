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
    description: 'Campo de ordenação (id, descricao, custo, precovenda)',
    default: 'id',
  })
  @IsOptional()
  @IsString()
  orderBy?: string = 'id';

  @ApiPropertyOptional({
    example: 'asc',
    description: 'Direção da ordenação (asc ou desc)',
    default: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  orderDirection?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar por ID do produto',
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiPropertyOptional({
    example: 'Notebook',
    description: 'Filtrar por descrição (busca parcial)',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Preço de custo mínimo',
  })
  @IsOptional()
  @IsNumber()
  custoMin?: number;

  @ApiPropertyOptional({
    example: 500,
    description: 'Preço de custo máximo',
  })
  @IsOptional()
  @IsNumber()
  custoMax?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Preço de venda mínimo',
  })
  @IsOptional()
  @IsNumber()
  vendaMin?: number;

  @ApiPropertyOptional({
    example: 500,
    description: 'Preço de venda máximo',
  })
  @IsOptional()
  @IsNumber()
  vendaMax?: number;
}
