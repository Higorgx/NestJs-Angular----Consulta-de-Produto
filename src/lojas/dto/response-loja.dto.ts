import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Loja } from '../entities/loja.entity';

export class ResponseLojaDto {
  @ApiProperty({
    example: 1,
    description: 'ID único da loja',
  })
  id: number;

  @ApiProperty({
    example: 'Loja Centro',
    description: 'Nome ou descrição da loja',
  })
  descricao: string;

  @ApiPropertyOptional({
    example: 'Rua das Lojas, 123',
    description: 'Endereço da loja (opcional)',
    type: String,
  })
  endereco?: string;

  @ApiPropertyOptional({
    description: 'Imagem da fachada da loja em base64',
    type: String,
  })
  imagem?: string | null | undefined;

  constructor(loja: Loja) {
    this.id = loja.id;
    this.descricao = loja.descricao;
  }
}
