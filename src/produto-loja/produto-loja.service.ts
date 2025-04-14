import { Injectable } from '@nestjs/common';
import { ProdutoLojaRepository } from './produto-loja.repository';
import { RequestProdutoLojaDto } from './dto/request-produto-loja.dto';
import { ResponseProdutoLojaDto } from './dto/response-produto-loja.dto';
import { PaginationProdutoLojaDto } from './dto/pagination-produto-loja.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { ProdutoLoja } from './entities/produto-loja.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { LojasService } from '../lojas/lojas.service';

@Injectable()
export class ProdutoLojaService {
  constructor(
    private readonly repository: ProdutoLojaRepository,
    private readonly lojaService: LojasService,
    private readonly produtoService: ProdutosService,
  ) {}

  private isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error;
  }

  private getErrorMessage(error: unknown): string {
    if (this.isErrorWithMessage(error)) return error.message;
    return 'Erro desconhecido';
  }

  private toResponseDto(produtoLoja: ProdutoLoja): ResponseProdutoLojaDto {
    return {
      id: produtoLoja.id,
      precovenda: produtoLoja.precovenda,
      idproduto: produtoLoja.idproduto,
      idloja: produtoLoja.idloja,
    };
  }

  async create(
    dto: RequestProdutoLojaDto,
  ): Promise<BaseResponseDto<ResponseProdutoLojaDto>> {
    const produtoExists = await this.produtoService.findOne(dto.idproduto);
    if (!produtoExists.success) {
      return new BaseResponseDto({
        success: false,
        message: 'Produto não encontrado',
        errors: [`Produto com ID ${dto.idproduto} não existe`],
      });
    }

    const lojaExists = await this.lojaService.findOne(dto.idloja);
    if (!lojaExists.success) {
      return new BaseResponseDto({
        success: false,
        message: 'Loja não encontrada',
        errors: [`Loja com ID ${dto.idloja} não existe`],
      });
    }
    try {
      const created = await this.repository.create(dto);
      return new BaseResponseDto({
        success: true,
        message: 'Produto-Loja criado com sucesso',
        data: this.toResponseDto(created),
      });
    } catch (error) {
      return new BaseResponseDto({
        success: false,
        message: 'Erro ao criar Produto-Loja',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async findAll(
    paginationDto?: PaginationProdutoLojaDto,
    filters?: {
      id?: number;
      idproduto?: number;
      idloja?: number;
      precovenda?: number;
    },
  ): Promise<PaginatedResponseDto<ResponseProdutoLojaDto>> {
    try {
      const { page = 1, limit = 10 } = paginationDto || {};
      const paginated = await this.repository.findAllPaginated(
        page,
        limit,
        filters,
      );

      return new PaginatedResponseDto({
        success: true,
        data: paginated.data.map((produtoLoja) =>
          this.toResponseDto(produtoLoja),
        ),
        total: paginated.total,
        page: paginated.page,
        lastPage: paginated.lastPage,
      });
    } catch (error) {
      return new PaginatedResponseDto({
        success: false,
        message: 'Erro ao buscar Produto-Loja',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async findOne(id: number): Promise<BaseResponseDto<ResponseProdutoLojaDto>> {
    try {
      const entity = await this.repository.findById(id);
      if (!entity) {
        return new BaseResponseDto({
          success: false,
          message: 'Produto-Loja não encontrado',
        });
      }

      return new BaseResponseDto({
        success: true,
        data: this.toResponseDto(entity),
      });
    } catch (error) {
      return new BaseResponseDto({
        success: false,
        message: 'Erro ao buscar Produto-Loja',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async update(
    id: number,
    dto: Partial<RequestProdutoLojaDto>,
  ): Promise<BaseResponseDto<ResponseProdutoLojaDto>> {
    try {
      const updated = await this.repository.update(id, dto);
      if (!updated) {
        return new BaseResponseDto({
          success: false,
          message: 'Produto-Loja não encontrado',
        });
      }

      return new BaseResponseDto({
        success: true,
        message: 'Produto-Loja atualizado com sucesso',
        data: this.toResponseDto(updated),
      });
    } catch (error) {
      return new BaseResponseDto({
        success: false,
        message: 'Erro ao atualizar Produto-Loja',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async remove(id: number): Promise<BaseResponseDto<void>> {
    try {
      await this.repository.delete(id);
      return new BaseResponseDto({
        success: true,
        message: 'Produto-Loja removido com sucesso',
      });
    } catch (error) {
      return new BaseResponseDto({
        success: false,
        message: 'Erro ao remover Produto-Loja',
        errors: [this.getErrorMessage(error)],
      });
    }
  }
}
