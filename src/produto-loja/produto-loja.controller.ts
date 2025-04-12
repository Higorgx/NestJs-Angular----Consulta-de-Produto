import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProdutoLojaService } from './produto-loja.service';
import { CreateProdutoLojaDto } from './dto/create-produto-loja.dto';
import { UpdateProdutoLojaDto } from './dto/update-produto-loja.dto';

@Controller('produto-loja')
export class ProdutoLojaController {
  constructor(private readonly produtoLojaService: ProdutoLojaService) {}

  @Post()
  create(@Body() createProdutoLojaDto: CreateProdutoLojaDto) {
    return this.produtoLojaService.create(createProdutoLojaDto);
  }

  @Get()
  findAll() {
    return this.produtoLojaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtoLojaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutoLojaDto: UpdateProdutoLojaDto) {
    return this.produtoLojaService.update(+id, updateProdutoLojaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtoLojaService.remove(+id);
  }
}
