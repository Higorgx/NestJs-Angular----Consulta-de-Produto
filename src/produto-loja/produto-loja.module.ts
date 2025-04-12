import { Module } from '@nestjs/common';
import { ProdutoLojaService } from './produto-loja.service';
import { ProdutoLojaController } from './produto-loja.controller';

@Module({
  controllers: [ProdutoLojaController],
  providers: [ProdutoLojaService],
})
export class ProdutoLojaModule {}
