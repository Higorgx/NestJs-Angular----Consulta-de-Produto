import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  //Logger,
} from '@nestjs/common';
import { RequestProdutoDto } from './dto/request-produto.dto';
import { PaginationProdutoDto } from './dto/pagination-produto.dto';
import { ProdutosRepository } from './produtos.repository';
import { ProdutoLojaRepository } from 'src/produto-loja/produto-loja.repository';
import { ResponseProdutoDTO } from './dto/response-produto.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { Produto } from './entities/produto.entity';

@Injectable()
export class ProdutosService {
  constructor(
    private readonly produtosRepository: ProdutosRepository,
    private readonly produtoLojaRepository: ProdutoLojaRepository,
  ) {}

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
    return new ResponseProdutoDTO(produto);
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
        throw new BadRequestException(
          'Imagem inválida. Apenas formatos .png e .jpg são permitidos.',
        );
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
      throw new InternalServerErrorException(this.getErrorMessage(error));
    }
  }

  async findAll(
    paginationDto?: PaginationProdutoDto,
    filters?: {
      id?: number;
      descricao?: string;
      custoMin?: number;
      custoMax?: number;
      vendaMin?: number;
      vendaMax?: number;
      orderBy?: string;
      orderDirection?: 'ASC' | 'DESC';
    },
  ): Promise<PaginatedResponseDto<ResponseProdutoDTO>> {
    try {
      const { limit = 10, page = 1 } = paginationDto || {};
      Logger.log(paginationDto);
      filters = {
        id: paginationDto?.id,
        descricao: paginationDto?.descricao,
        custoMin: paginationDto?.custoMin,
        custoMax: paginationDto?.custoMax,
        vendaMin: paginationDto?.vendaMin,
        vendaMax: paginationDto?.vendaMax,
        orderBy: paginationDto?.orderBy,
        orderDirection: paginationDto?.orderDirection?.toUpperCase() as
          | 'ASC'
          | 'DESC'
          | undefined,
      };

      const paginatedResult = await this.produtosRepository.findAllPaginated(
        page,
        limit,
        filters,
      );

      const { data, total, page: currentPage, lastPage } = paginatedResult;

      return new PaginatedResponseDto<ResponseProdutoDTO>({
        success: true,
        data: data.map((produto) => this.toResponseDto(produto)),
        total,
        page: currentPage,
        lastPage,
      });
    } catch (error) {
      throw new InternalServerErrorException(this.getErrorMessage(error));
    }
  }

  async findOne(id: number): Promise<BaseResponseDto<ResponseProdutoDTO>> {
    try {
      const produto = await this.produtosRepository.findById(id);
      if (!produto) {
        throw new NotFoundException('Produto não encontrado');
      }
      return new BaseResponseDto<ResponseProdutoDTO>({
        success: true,
        data: this.toResponseDto(produto),
        message: 'Produto encontrado com sucesso',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(this.getErrorMessage(error));
    }
  }

  async update(
    id: number,
    updateProdutoDto: Partial<RequestProdutoDto>,
  ): Promise<BaseResponseDto<ResponseProdutoDTO>> {
    try {
      const { imagem, ...rest } = updateProdutoDto;

      if (imagem && !this.isValidImageType(imagem)) {
        throw new BadRequestException(
          'Imagem inválida. Apenas formatos .png e .jpg são permitidos.',
        );
      }

      const produtoData: Partial<Produto> = {
        ...rest,
        imagem: imagem ? this.base64ToBuffer(imagem) : undefined,
      };

      const produto = await this.produtosRepository.update(id, produtoData);

      if (!produto) {
        throw new NotFoundException('Produto não encontrado');
      }

      return new BaseResponseDto<ResponseProdutoDTO>({
        success: true,
        data: this.toResponseDto(produto),
        message: 'Produto atualizado com sucesso',
      });
    } catch (error) {
      throw new InternalServerErrorException(this.getErrorMessage(error));
    }
  }

  async remove(id: number): Promise<BaseResponseDto<void>> {
    try {
      const produto = await this.produtosRepository.findById(id);

      if (!produto) {
        throw new NotFoundException('Produto não encontrado');
      }

      await this.produtosRepository.delete(id);

      return new BaseResponseDto<void>({
        success: true,
        message: 'Produto removido com sucesso',
      });
    } catch (error) {
      throw new InternalServerErrorException(this.getErrorMessage(error));
      // todo tratar mensagens de excessao
    }
  }
}
