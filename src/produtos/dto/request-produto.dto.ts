import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestProdutoDto {
  @ApiProperty({
    example: 'Notebook Dell Inspiron',
    description: 'Descrição do produto (máx. 60 caracteres)',
    maxLength: 60,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  descricao: string;

  @ApiPropertyOptional({
    example: 3500.99,
    description: 'Custo do produto (opcional)',
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  custo?: number;

  @ApiPropertyOptional({
    description: 'Imagem do produto em formato binário (opcional)',
    format: 'binary',
    type: 'string',
  })
  @IsOptional()
  imagem?: string;
}
