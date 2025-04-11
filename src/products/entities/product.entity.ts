import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, nullable: false })
  descricao: string;

  @Column({ type: 'numeric', precision: 13, scale: 3 })
  custo: number;

  @Column({ type: 'bytea', nullable: true })
  imagem: Buffer;
}