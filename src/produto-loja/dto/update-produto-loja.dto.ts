import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoLojaDto } from './create-produto-loja.dto';

export class UpdateProdutoLojaDto extends PartialType(CreateProdutoLojaDto) {}
