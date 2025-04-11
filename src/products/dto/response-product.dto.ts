import { Product } from './../entities/product.entity';

export class ResponseProductDTO {
  id: number;
  descricao: string;
  custo: number;
  imagem?: Buffer;

  constructor(product: Partial<Product>) {
    this.id = product.id;
    this.descricao = product.descricao;
    this.custo = product.custo;
    this.imagem = product.imagem;
  }
}