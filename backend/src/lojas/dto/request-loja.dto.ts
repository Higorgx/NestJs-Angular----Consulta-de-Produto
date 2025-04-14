import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestLojaDto {
  @ApiProperty({
    example: 'Loja Centro',
    description: 'Nome ou descrição da loja (máx. 60 caracteres)',
    maxLength: 60,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  descricao: string;

  @ApiPropertyOptional({
    example: 'Rua das Lojas, 123',
    description: 'Endereço da loja (opcional, máx. 100 caracteres)',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  endereco?: string;

  @ApiPropertyOptional({
    description: 'Imagem da fachada da loja em formato binário (opcional)',
    format: 'binary',
    type: 'string',
  })
  @IsOptional()
  imagem?: string;
}
