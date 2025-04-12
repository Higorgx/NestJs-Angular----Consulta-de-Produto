import { Injectable } from '@nestjs/common';
import { CreateProdutoLojaDto } from './dto/create-produto-loja.dto';
import { UpdateProdutoLojaDto } from './dto/update-produto-loja.dto';

@Injectable()
export class ProdutoLojaService {
  create(createProdutoLojaDto: CreateProdutoLojaDto) {
    return 'This action adds a new produtoLoja';
  }

  findAll() {
    return `This action returns all produtoLoja`;
  }

  findOne(id: number) {
    return `This action returns a #${id} produtoLoja`;
  }

  update(id: number, updateProdutoLojaDto: UpdateProdutoLojaDto) {
    return `This action updates a #${id} produtoLoja`;
  }

  remove(id: number) {
    return `This action removes a #${id} produtoLoja`;
  }
}
