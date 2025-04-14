import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProdutoLoja } from '../../produto-loja/entities/produto-loja.entity';

@Entity('loja')
export class Loja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  descricao: string;

  @OneToMany(() => ProdutoLoja, (produtoLoja) => produtoLoja.idloja)
  produtosLoja: ProdutoLoja[];
}
