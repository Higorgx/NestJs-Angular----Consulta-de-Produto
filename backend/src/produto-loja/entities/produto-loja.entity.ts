import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Produto } from '../../produtos/entities/produto.entity';
import { Loja } from '../../lojas/entities/loja.entity';

@Entity('produtoloja')
export class ProdutoLoja {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Produto, (produto) => produto.id)
  @JoinColumn({ name: 'idProduto' })
  idproduto: number;

  @ManyToOne(() => Loja, (loja) => loja.produtosLoja)
  @JoinColumn({ name: 'idLoja' })
  idloja: number;

  @Column('numeric', { precision: 13, scale: 3 })
  precovenda: number;
}
