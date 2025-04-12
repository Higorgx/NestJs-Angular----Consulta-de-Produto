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
import { ProductsService } from './products.service';
import { RequestProductDto } from './dto/request-product.dto';
import { PaginationDto } from './dto/pagination.dto';
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
} from '@nestjs/swagger';

//TODO CRIAÇÂO DE PRODUTO nAO TA VINDO CAMPO IMAGEM ADICIONAR VALIDAÇÂO DE  TIPO DE IMAGEM
@ApiTags('produtos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  //Cria um novo produto
  @Post()
  @ApiOperation({
    summary: 'Cria um novo produto',
    description: 'Endpoint para cadastrar um novo produto no sistema',
  })
  @ApiCreatedResponse({
    description: 'Produto criado com sucesso',
    type: RequestProductDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou faltando campos obrigatórios',
  })
  @ApiBody({
    type: RequestProductDto,
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
  create(@Body() RequestProductDto: RequestProductDto) {
    return this.productsService.create(RequestProductDto);
  }

  //Lista todos os produtos com possibilidade de filtros
  @Get()
  @ApiOperation({
    summary: 'Lista produtos',
    description:
      'Retorna lista paginada de produtos com possibilidade de filtro',
  })
  @ApiOkResponse({
    description: 'Lista de produtos retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
        },
        total: {
          type: 'integer',
          example: 100,
        },
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
    @Query() paginationDto: PaginationDto,
    @Query('id') id?: number,
    @Query('descricao') descricao?: string,
    @Query('custoMin') custoMin?: number,
    @Query('custoMax') custoMax?: number,
  ) {
    return this.productsService.findAll(paginationDto, {
      id,
      descricao,
      custoMin,
      custoMax,
    });
  }

  //Busca um produto especifico
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
    type: RequestProductDto,
  })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  //atualiza um produto
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
    type: RequestProductDto,
  })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiBody({
    type: RequestProductDto,
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
    @Body() UpdateProductDTO: Partial<RequestProductDto>,
  ) {
    return this.productsService.update(+id, UpdateProductDTO);
  }

  //deleta um produto
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
    return this.productsService.remove(+id);
  }
}
