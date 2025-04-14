import { Injectable } from '@nestjs/common';
import { RequestLojaDto } from './dto/request-loja.dto';
import { PaginationLojaDto } from './dto/pagination-loja.dto';
import { LojasRepository } from './lojas.repository';
import { ResponseLojaDto } from './dto/response-loja.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { Loja } from './entities/loja.entity';

@Injectable()
export class LojasService {
  constructor(private readonly lojasRepository: LojasRepository) {}

  private isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error;
  }

  private getErrorMessage(error: unknown): string {
    if (this.isErrorWithMessage(error)) {
      return error.message;
    }
    return 'Erro desconhecido';
  }

  private toResponseDto(loja: Loja): ResponseLojaDto {
    return {
      id: loja.id,
      descricao: loja.descricao,
    };
  }

  async create(
    requestLojaDto: RequestLojaDto,
  ): Promise<BaseResponseDto<ResponseLojaDto>> {
    try {
      const loja = await this.lojasRepository.create(requestLojaDto);
      return new BaseResponseDto<ResponseLojaDto>({
        success: true,
        data: this.toResponseDto(loja),
        message: 'Loja criada com sucesso',
      });
    } catch (error) {
      return new BaseResponseDto<ResponseLojaDto>({
        success: false,
        message: 'Erro ao criar loja',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async findAll(
    paginationDto?: PaginationLojaDto,
    filters?: {
      id?: number;
      descricao?: string;
    },
  ): Promise<PaginatedResponseDto<ResponseLojaDto>> {
    try {
      const { limit = 10, page = 1 } = paginationDto || {};
      const paginatedResult = await this.lojasRepository.findAllPaginated(
        page,
        limit,
        filters,
      );

      const { data, total, page: currentPage, lastPage } = paginatedResult;

      return new PaginatedResponseDto<ResponseLojaDto>({
        success: true,
        data: data.map((loja) => this.toResponseDto(loja)),
        total,
        page: currentPage,
        lastPage,
      });
    } catch (error) {
      return new PaginatedResponseDto<ResponseLojaDto>({
        success: false,
        message: 'Erro ao buscar lojas',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async findOne(id: number): Promise<BaseResponseDto<ResponseLojaDto>> {
    try {
      const loja = await this.lojasRepository.findById(id);
      if (!loja) {
        return new BaseResponseDto<ResponseLojaDto>({
          success: false,
          message: 'Loja não encontrada',
        });
      }
      return new BaseResponseDto<ResponseLojaDto>({
        success: true,
        data: this.toResponseDto(loja),
      });
    } catch (error) {
      return new BaseResponseDto<ResponseLojaDto>({
        success: false,
        message: 'Erro ao buscar loja',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async update(
    id: number,
    updateLojaDto: Partial<RequestLojaDto>,
  ): Promise<BaseResponseDto<ResponseLojaDto>> {
    try {
      const loja = await this.lojasRepository.update(id, updateLojaDto);
      if (!loja) {
        return new BaseResponseDto<ResponseLojaDto>({
          success: false,
          message: 'Loja não encontrada',
        });
      }

      return new BaseResponseDto<ResponseLojaDto>({
        success: true,
        data: this.toResponseDto(loja),
        message: 'Loja atualizada com sucesso',
      });
    } catch (error) {
      return new BaseResponseDto<ResponseLojaDto>({
        success: false,
        message: 'Erro ao atualizar loja',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async remove(id: number): Promise<BaseResponseDto<void>> {
    try {
      await this.lojasRepository.delete(id);
      return new BaseResponseDto<void>({
        success: true,
        message: 'Loja removida com sucesso',
      });
    } catch (error) {
      return new BaseResponseDto<void>({
        success: false,
        message: 'Erro ao remover loja',
        errors: [this.getErrorMessage(error)],
      });
    }
  }
}
