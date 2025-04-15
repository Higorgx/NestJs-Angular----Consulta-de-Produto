import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { ProdutoLoja } from 'src/produto-loja/entities/produto-loja.entity';
import { ProdutosService } from './produtos.service';
import { ProdutosRepository } from './produtos.repository';
import { ProdutoLojaModule } from 'src/produto-loja/produto-loja.module';
import { ProdutoLojaRepository } from 'src/produto-loja/produto-loja.repository';
import { ProdutosController } from './produtos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produto, ProdutoLoja]),
    forwardRef(() => ProdutoLojaModule),
  ],
  controllers: [ProdutosController],
  providers: [ProdutosService, ProdutoLojaRepository, ProdutosRepository],
  exports: [ProdutosService],
})
export class ProdutosModule {}
