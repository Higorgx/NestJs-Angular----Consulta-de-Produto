import { ApiProperty } from '@nestjs/swagger';

export class ResponseProdutoLojaDto {
  @ApiProperty({ description: 'ID da relação produto-loja' })
  id: number;

  @ApiProperty({ description: 'ID do produto' })
  idproduto: number;

  @ApiProperty({ description: 'ID da loja' })
  idloja: number;

  @ApiProperty({ description: 'Preço de venda' })
  precovenda: number;
}
