import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RequestProdutoLojaDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsNumber()
  idproduto: number;

  @ApiProperty({ description: 'ID da loja' })
  @IsNumber()
  idloja: number;

  @ApiProperty({ description: 'Preço de venda' })
  @IsNumber()
  precovenda: number;
}
