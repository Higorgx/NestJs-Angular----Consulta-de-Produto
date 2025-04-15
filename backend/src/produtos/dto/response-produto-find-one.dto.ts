import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class LojaResponseDto {
  @ApiProperty({ example: 2, description: 'ID da loja' })
  id: number;

  @ApiProperty({ example: 'Loja Centro 1', description: 'Nome da loja' })
  descricao: string;
}

class ProdutoLojaResponseDto {
  @ApiProperty({ example: 1, description: 'ID do relacionamento produto-loja' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID do produto' })
  idproduto: number;

  @ApiProperty({ example: 2, description: 'ID da loja' })
  idloja: number;

  @ApiProperty({ example: 19.99, description: 'Preço de venda na loja' })
  precovenda: number;

  @ApiProperty({ type: LojaResponseDto, description: 'Dados da loja' })
  loja: LojaResponseDto;
}

type ProdutoLojaLike = {
  id: number;
  precovenda: number | string;
  idloja: {
    id: number;
    descricao: string;
  };
};

export class ResponseProdutoDTO {
  @ApiProperty({ example: 1, description: 'ID do produto' })
  id: number;

  @ApiProperty({ example: 'Produto 1', description: 'Descrição do produto' })
  descricao: string;

  @ApiProperty({ example: 7.65, description: 'Custo do produto' })
  custo: number;

  @ApiPropertyOptional({ description: 'Imagem do produto em base64' })
  imagem?: string;

  @ApiProperty({
    type: [ProdutoLojaResponseDto],
    description: 'Preços nas lojas',
  })
  produtoLojas: ProdutoLojaResponseDto[];

  constructor(produto: {
    id: number;
    descricao: string;
    custo: number;
    imagem?: Buffer;
    produtoLoja?: ProdutoLojaLike[];
  }) {
    this.id = produto.id;
    this.descricao = produto.descricao;
    this.custo = produto.custo;
    this.imagem = produto.imagem?.toString('base64');

    this.produtoLojas =
      produto.produtoLoja?.map((pl) => {
        const precoVenda =
          typeof pl.precovenda === 'string'
            ? parseFloat(pl.precovenda)
            : pl.precovenda;

        return {
          id: pl.id,
          idproduto: produto.id,
          idloja: pl.idloja.id,
          precovenda: precoVenda,
          loja: {
            id: pl.idloja.id,
            descricao: pl.idloja.descricao,
          },
        };
      }) || [];
  }
}
