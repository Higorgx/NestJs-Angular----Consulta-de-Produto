import { Injectable } from '@nestjs/common';
import { RequestProdutoDto } from './dto/request-produto.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ProdutosRepository } from './produtos.repository';
import { ResponseProdutoDTO } from './dto/response-produto.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { Produto } from './entities/produto.entity';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';

@Injectable()
export class ProdutosService {
  constructor(private readonly produtosRepository: ProdutosRepository) {}

  private isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error;
  }

  private getErrorMessage(error: unknown): string {
    if (this.isErrorWithMessage(error)) {
      return error.message;
    }
    return 'Erro desconhecido';
  }

  private toResponseDto(produto: Produto): ResponseProdutoDTO {
    return {
      id: produto.id,
      descricao: produto.descricao,
      custo: produto.custo,
    };
  }

  private isValidImageType(imageBase64: string): boolean {
    const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch?.[1];
    return (
      mimeType === 'image/png' ||
      mimeType === 'image/jpeg' ||
      mimeType === 'image/jpg'
    );
  }

  private base64ToBuffer(imageBase64: string): Buffer {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }

  async create(
    requestProdutoDto: RequestProdutoDto,
  ): Promise<BaseResponseDto<ResponseProdutoDTO>> {
    try {
      const { imagem, ...rest } = requestProdutoDto;

      if (imagem && !this.isValidImageType(imagem)) {
        return new BaseResponseDto<ResponseProdutoDTO>({
          success: false,
          message:
            'Imagem inválida. Apenas formatos .png e .jpg são permitidos.',
        });
      }

      const produtoData: Partial<Produto> = {
        ...rest,
        imagem: imagem ? this.base64ToBuffer(imagem) : undefined,
      };

      const produto = await this.produtosRepository.create(produtoData);

      return new BaseResponseDto<ResponseProdutoDTO>({
        success: true,
        data: this.toResponseDto(produto),
        message: 'Produto criado com sucesso',
      });
    } catch (error) {
      return new BaseResponseDto<ResponseProdutoDTO>({
        success: false,
        message: 'Erro ao criar produto',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async findAll(
    paginationDto?: PaginationDto,
    filters?: {
      id?: number;
      descricao?: string;
      custoMin?: number;
      custoMax?: number;
    },
  ): Promise<PaginatedResponseDto<ResponseProdutoDTO>> {
    try {
      const { limit = 10, page = 1 } = paginationDto || {};
      const paginatedResult = (await this.produtosRepository.findAllPaginated(
        page,
        limit,
        filters,
      )) as PaginationResult<Produto>;

      const { data, total, page: currentPage, lastPage } = paginatedResult;

      return new PaginatedResponseDto<ResponseProdutoDTO>({
        success: true,
        data: data.map((produto) => this.toResponseDto(produto)),
        total,
        page: currentPage,
        lastPage,
      });
    } catch (error) {
      return new PaginatedResponseDto<ResponseProdutoDTO>({
        success: false,
        message: 'Erro ao buscar produtos',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async findOne(id: number): Promise<BaseResponseDto<ResponseProdutoDTO>> {
    try {
      const produto = await this.produtosRepository.findById(id);
      if (!produto) {
        return new BaseResponseDto<ResponseProdutoDTO>({
          success: false,
          message: 'Produto não encontrado',
        });
      }
      return new BaseResponseDto<ResponseProdutoDTO>({
        success: true,
        data: this.toResponseDto(produto),
      });
    } catch (error) {
      return new BaseResponseDto<ResponseProdutoDTO>({
        success: false,
        message: 'Erro ao buscar produto',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async update(
    id: number,
    updateProdutoDto: Partial<RequestProdutoDto>,
  ): Promise<BaseResponseDto<ResponseProdutoDTO>> {
    try {
      const { imagem, ...rest } = updateProdutoDto;

      if (imagem && !this.isValidImageType(imagem)) {
        return new BaseResponseDto<ResponseProdutoDTO>({
          success: false,
          message:
            'Imagem inválida. Apenas formatos .png e .jpg são permitidos.',
        });
      }

      const produtoData: Partial<Produto> = {
        ...rest,
        imagem: imagem ? this.base64ToBuffer(imagem) : undefined,
      };

      const produto = await this.produtosRepository.update(id, produtoData);

      if (!produto) {
        return new BaseResponseDto<ResponseProdutoDTO>({
          success: false,
          message: 'Produto não encontrado',
        });
      }

      return new BaseResponseDto<ResponseProdutoDTO>({
        success: true,
        data: this.toResponseDto(produto),
        message: 'Produto atualizado com sucesso',
      });
    } catch (error) {
      return new BaseResponseDto<ResponseProdutoDTO>({
        success: false,
        message: 'Erro ao atualizar produto',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async remove(id: number): Promise<BaseResponseDto<void>> {
    try {
      await this.produtosRepository.delete(id);
      return new BaseResponseDto<void>({
        success: true,
        message: 'Produto removido com sucesso',
      });
    } catch (error) {
      return new BaseResponseDto<void>({
        success: false,
        message: 'Erro ao remover produto',
        errors: [this.getErrorMessage(error)],
      });
    }
  }
}
