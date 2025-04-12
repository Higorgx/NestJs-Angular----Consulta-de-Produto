import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductEntity } from '../entities/product.entity';

export class ResponseProductDTO {
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
  imagem?: string;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.descricao = product.descricao;
    this.custo = product.custo;
    this.imagem = product.imagem?.toString('base64');
  }
}
