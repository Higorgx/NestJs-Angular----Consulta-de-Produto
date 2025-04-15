import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoLojaController } from './produto-loja.controller';
import { produtoLojaservice } from './produto-loja.service';
import { ProdutoLojaRepository } from './produto-loja.repository';
import { ProdutoLoja } from './entities/produto-loja.entity';
import { ProdutosModule } from '../produtos/produtos.module';
import { LojasModule } from '../lojas/lojas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProdutoLoja]),
    forwardRef(() => ProdutosModule),
    LojasModule,
  ],
  controllers: [ProdutoLojaController],
  providers: [produtoLojaservice, ProdutoLojaRepository],
})
export class ProdutoLojaModule {}
