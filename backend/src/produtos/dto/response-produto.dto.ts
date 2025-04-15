import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Produto } from '../entities/produto.entity';
import { ResponseProdutoLojaDto } from '../../produto-loja/dto/response-produto-loja.dto';

export class ResponseProdutoDTO {
  @ApiProperty({
    example: 1,
    description: 'ID único do produto',
  })
  id: number;

  @ApiProperty({
    example: 'Notebook Dell Inspiron',
    description: 'Descrição completa do produto',
  })
  descricao: string;

  @ApiProperty({
    example: 3500.99,
    description: 'Custo do produto',
    type: Number,
  })
  custo: number;

  @ApiPropertyOptional({
    description: 'Imagem do produto em base64',
    type: String,
  })
  imagem?: string | null | undefined;

  @ApiProperty({
    type: [ResponseProdutoLojaDto],
    description: 'Lista de preços de venda do produto por loja',
  })
  produtoLoja: ResponseProdutoLojaDto[];

  constructor(produto: Produto) {
    this.id = produto.id;
    this.descricao = produto.descricao;
    this.custo = produto.custo;
    this.imagem = produto.imagem?.toString('base64');

    this.produtoLoja =
      produto.produtoLoja?.map((pl) => ({
        id: pl.id,
        idproduto: pl.idproduto,
        idloja: pl.idloja,
        precovenda: pl.precovenda,
      })) || [];
  }
}
