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
import { LojasService } from './lojas.service';
import { RequestLojaDto } from './dto/request-loja.dto';
import { PaginationLojaDto } from './dto/pagination-loja.dto';
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
import { ResponseLojaDto } from './dto/response-loja.dto';

@ApiTags('Loja')
@Controller('lojas')
export class LojasController {
  constructor(private readonly lojasService: LojasService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria uma nova loja',
    description: 'Endpoint para cadastrar uma nova loja no sistema',
  })
  @ApiCreatedResponse({
    description: 'Loja criada com sucesso',
    type: ResponseLojaDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou faltando campos obrigatórios',
  })
  @ApiBody({
    type: RequestLojaDto,
    description: 'Payload com dados da loja',
    examples: {
      exemplo1: {
        value: {
          descricao: 'Loja Centro',
        },
      },
    },
  })
  create(@Body() dto: RequestLojaDto) {
    return this.lojasService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista lojas',
    description: 'Retorna lista paginada de lojas com possibilidade de filtro',
  })
  @ApiExtraModels(ResponseLojaDto)
  @ApiOkResponse({
    description: 'Listagem de lojas',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(ResponseLojaDto) },
          example: [
            {
              id: 1,
              descricao: 'Loja A',
            },
            {
              id: 2,
              descricao: 'Loja B',
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
    description: 'Filtro por ID da loja',
  })
  @ApiQuery({
    name: 'descricao',
    required: false,
    type: String,
    description: 'Filtro por descrição da loja (busca parcial)',
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
    @Query() paginationDto: PaginationLojaDto,
    @Query('id') id?: number,
    @Query('descricao') descricao?: string,
  ) {
    return this.lojasService.findAll(paginationDto, { id, descricao });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca loja por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da loja',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Loja encontrada',
    type: ResponseLojaDto,
  })
  @ApiNotFoundResponse({
    description: 'Loja não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.lojasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma loja' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da loja a ser atualizada',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Loja atualizada com sucesso',
    type: ResponseLojaDto,
  })
  @ApiNotFoundResponse({
    description: 'Loja não encontrada',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiBody({
    type: RequestLojaDto,
    description: 'Campos para atualização',
    examples: {
      exemplo1: {
        value: {
          descricao: 'Loja Centro Atualizada',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: Partial<RequestLojaDto>) {
    return this.lojasService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma loja' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da loja a ser removida',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Loja removida com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Loja não encontrada',
  })
  remove(@Param('id') id: string) {
    return this.lojasService.remove(+id);
  }
}
