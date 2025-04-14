import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ProdutoLojaService } from './produto-loja.service';
import { RequestProdutoLojaDto } from './dto/request-produto-loja.dto';
import { ResponseProdutoLojaDto } from './dto/response-produto-loja.dto';
import { PaginationProdutoLojaDto } from './dto/pagination-produto-loja.dto';

@ApiTags('Produto Loja')
@Controller('produtoloja')
export class ProdutoLojaController {
  constructor(private readonly produtoLojaService: ProdutoLojaService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria uma nova relação produto-loja',
    description: 'Endpoint para cadastrar um produto em uma loja com seu preço',
  })
  @ApiCreatedResponse({
    description: 'Relação produto-loja criada com sucesso',
    type: ResponseProdutoLojaDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou faltando campos obrigatórios',
  })
  @ApiBody({
    type: RequestProdutoLojaDto,
    description: 'Payload com dados da relação produto-loja',
    examples: {
      exemplo1: {
        value: {
          idproduto: 1,
          idloja: 1,
          precovenda: 19.99,
        },
      },
    },
  })
  create(@Body() dto: RequestProdutoLojaDto) {
    return this.produtoLojaService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista relações produto-loja',
    description:
      'Retorna lista paginada de relações produto-loja com possibilidade de filtro',
  })
  @ApiExtraModels(ResponseProdutoLojaDto)
  @ApiOkResponse({
    description: 'Listagem de relações produto-loja',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(ResponseProdutoLojaDto) },
          example: [
            {
              id: 1,
              idproduto: 1,
              idloja: 1,
              precovenda: 19.99,
            },
            {
              id: 2,
              idproduto: 2,
              idloja: 1,
              precovenda: 29.99,
            },
          ],
        },
        total: { type: 'number', example: 2 },
        page: { type: 'string', example: '1' },
        lastPage: { type: 'number', example: 1 },
      },
    },
  })
  @ApiQuery({
    name: 'id',
    required: false,
    type: Number,
    description: 'Filtro por ID da relação',
  })
  @ApiQuery({
    name: 'idproduto',
    required: false,
    type: Number,
    description: 'Filtro por ID do produto',
  })
  @ApiQuery({
    name: 'idloja',
    required: false,
    type: Number,
    description: 'Filtro por ID da loja',
  })
  @ApiQuery({
    name: 'precovenda',
    required: false,
    type: Number,
    description: 'Filtro por preço de venda',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de itens por página (padrão: 10)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
  })
  async findAll(
    @Query() paginationDto: PaginationProdutoLojaDto,
    @Query('id') id?: number,
    @Query('idproduto') idproduto?: number,
    @Query('idloja') idloja?: number,
    @Query('precovenda') precovenda?: number,
  ) {
    return this.produtoLojaService.findAll(paginationDto, {
      id,
      idproduto,
      idloja,
      precovenda,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca relação produto-loja por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da relação produto-loja',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Relação produto-loja encontrada',
    type: ResponseProdutoLojaDto,
  })
  @ApiNotFoundResponse({
    description: 'Relação produto-loja não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.produtoLojaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma relação produto-loja' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da relação produto-loja a ser atualizada',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Relação produto-loja atualizada com sucesso',
    type: ResponseProdutoLojaDto,
  })
  @ApiNotFoundResponse({
    description: 'Relação produto-loja não encontrada',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiBody({
    type: RequestProdutoLojaDto,
    description: 'Campos para atualização',
    examples: {
      exemplo1: {
        value: {
          idproduto: 1,
          idloja: 1,
          precovenda: 24.99,
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: Partial<RequestProdutoLojaDto>) {
    return this.produtoLojaService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma relação produto-loja' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da relação produto-loja a ser removida',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Relação produto-loja removida com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Relação produto-loja não encontrada',
  })
  remove(@Param('id') id: string) {
    return this.produtoLojaService.remove(+id);
  }
}
