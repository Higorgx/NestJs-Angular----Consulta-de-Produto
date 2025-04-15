import { ApiProperty } from '@nestjs/swagger';
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

  constructor(loja: Loja) {
    this.id = loja.id;
    this.descricao = loja.descricao;
  }
}
