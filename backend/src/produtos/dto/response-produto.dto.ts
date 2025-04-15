import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Produto } from '../entities/produto.entity';
import { ProdutoLoja } from '../../produto-loja/entities/produto-loja.entity';

// Interface para o objeto de relação que o TypeORM injeta
interface ProdutoLojaComRelacao extends ProdutoLoja {
  loja?: {
    id: number;
    descricao: string;
  };
}

class LojaResponseDto {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: 'Loja Centro' }) descricao: string;
}

class ProdutoLojaResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() idproduto: number;
  @ApiProperty() idloja: number;
  @ApiProperty() precovenda: number;
  @ApiPropertyOptional({ type: LojaResponseDto }) loja?: LojaResponseDto;
}

export class ResponseProdutoDTO {
  @ApiProperty() id: number;
  @ApiProperty() descricao: string;
  @ApiProperty() custo: number;
  @ApiPropertyOptional() imagem?: string;
  @ApiProperty({ type: [ProdutoLojaResponseDto] })
  produtoLoja: ProdutoLojaResponseDto[];

  constructor(produto: Produto) {
    this.id = produto.id;
    this.descricao = produto.descricao;
    this.custo = produto.custo;
    this.imagem = produto.imagem?.toString('base64');

    this.produtoLoja =
      produto.produtoLoja?.map((pl: ProdutoLojaComRelacao) => {
        const item: ProdutoLojaResponseDto = {
          id: pl.id,
          idproduto: pl.idproduto,
          idloja: pl.idloja, // Usando o campo idloja direto da entidade
          precovenda: pl.precovenda,
        };

        // Acesso seguro à relação carregada (se existir)
        if (pl['loja']) {
          item.loja = {
            id: pl['loja'].id,
            descricao: pl['loja'].descricao,
          };
        }

        return item;
      }) || [];
  }
}
