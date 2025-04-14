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
import { ProdutosService } from './produtos.service';
import { RequestProdutoDto } from './dto/request-produto.dto';
import { PaginationProdutoDto } from './dto/pagination-produto.dto';
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
import { ResponseProdutoDTO } from './dto/response-produto.dto';

@ApiTags('Produto')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}
  @Post()
  @ApiOperation({
    summary: 'Cria um novo produto',
    description: 'Endpoint para cadastrar um novo produto no sistema',
  })
  @ApiCreatedResponse({
    description: 'Produto criado com sucesso',
    type: RequestProdutoDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou faltando campos obrigatórios',
  })
  @ApiBody({
    type: RequestProdutoDto,
    description: 'Payload com dados do produto',
    examples: {
      exemplo1: {
        value: {
          descricao: 'Notebook Dell Inspiron',
          custo: 3500.0,
          image: 'string',
        },
      },
    },
  })
  create(@Body() RequestProdutoDto: RequestProdutoDto) {
    return this.produtosService.create(RequestProdutoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista produtos',
    description:
      'Retorna lista paginada de produtos com possibilidade de filtro',
  })
  @ApiExtraModels(ResponseProdutoDTO)
  @ApiOkResponse({
    description: 'Listagem de produtos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(ResponseProdutoDTO) },
          example: [
            {
              id: 1,
              descricao: 'Produto A',
              custo: '100.00',
            },
            {
              id: 2,
              descricao: 'Produto B',
              custo: '200.00',
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
    description: 'Filtro por ID do produto',
  })
  @ApiQuery({
    name: 'descricao',
    required: false,
    type: String,
    description: 'Filtro por descrição (busca parcial)',
  })
  @ApiQuery({
    name: 'custoMin',
    required: false,
    type: Number,
    description: 'Valor mínimo para filtro por custo',
  })
  @ApiQuery({
    name: 'custoMax',
    required: false,
    type: Number,
    description: 'Valor máximo para filtro por custo',
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
    description: 'Número da pagina (padrão: 1)',
  })
  async findAll(
    @Query() paginationDto: PaginationProdutoDto,
    @Query('id') id?: number,
    @Query('descricao') descricao?: string,
    @Query('custoMin') custoMin?: number,
    @Query('custoMax') custoMax?: number,
  ) {
    return this.produtosService.findAll(paginationDto, {
      id,
      descricao,
      custoMin,
      custoMax,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca produto por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do produto',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Produto encontrado',
    type: RequestProdutoDto,
  })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um produto' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do produto a ser atualizado',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Produto atualizado com sucesso',
    type: RequestProdutoDto,
  })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiBody({
    type: RequestProdutoDto,
    description: 'Campos para atualização (todos opcionais)',
    examples: {
      exemplo1: {
        value: {
          descricao: 'Novo nome do produto',
        },
      },
      exemplo2: {
        value: {
          custo: 3999.99,
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() UpdateProdutoDTO: Partial<RequestProdutoDto>,
  ) {
    return this.produtosService.update(+id, UpdateProdutoDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um produto' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do produto a ser removido',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Produto removido com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado',
  })
  remove(@Param('id') id: string) {
    return this.produtosService.remove(+id);
  }
}
