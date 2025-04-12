import { Injectable } from '@nestjs/common';
import { RequestProductDto } from './dto/request-product.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ProductsRepository } from './products.repository';
import { ResponseProductDTO } from './dto/response-product.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { ProductEntity } from './entities/product.entity';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  private isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error;
  }

  private getErrorMessage(error: unknown): string {
    if (this.isErrorWithMessage(error)) {
      return error.message;
    }
    return 'Erro desconhecido';
  }

  private toResponseDto(product: ProductEntity): ResponseProductDTO {
    return {
      id: product.id,
      descricao: product.descricao,
      custo: product.custo,
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
    requestProductDto: RequestProductDto,
  ): Promise<BaseResponseDto<ResponseProductDTO>> {
    try {
      const { imagem, ...rest } = requestProductDto;

      if (imagem && !this.isValidImageType(imagem)) {
        return new BaseResponseDto<ResponseProductDTO>({
          success: false,
          message:
            'Imagem inválida. Apenas formatos .png e .jpg são permitidos.',
        });
      }

      const productData: Partial<ProductEntity> = {
        ...rest,
        imagem: imagem ? this.base64ToBuffer(imagem) : undefined,
      };

      const product = await this.productsRepository.create(productData);

      return new BaseResponseDto<ResponseProductDTO>({
        success: true,
        data: this.toResponseDto(product),
        message: 'Produto criado com sucesso',
      });
    } catch (error) {
      return new BaseResponseDto<ResponseProductDTO>({
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
  ): Promise<PaginatedResponseDto<ResponseProductDTO>> {
    try {
      const { limit = 10, page = 1 } = paginationDto || {};
      const paginatedResult = (await this.productsRepository.findAllPaginated(
        page,
        limit,
        filters,
      )) as PaginationResult<ProductEntity>;

      const { data, total, page: currentPage, lastPage } = paginatedResult;

      return new PaginatedResponseDto<ResponseProductDTO>({
        success: true,
        data: data.map((product) => this.toResponseDto(product)),
        total,
        page: currentPage,
        lastPage,
      });
    } catch (error) {
      return new PaginatedResponseDto<ResponseProductDTO>({
        success: false,
        message: 'Erro ao buscar produtos',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async findOne(id: number): Promise<BaseResponseDto<ResponseProductDTO>> {
    try {
      const product = await this.productsRepository.findById(id);
      if (!product) {
        return new BaseResponseDto<ResponseProductDTO>({
          success: false,
          message: 'Produto não encontrado',
        });
      }
      return new BaseResponseDto<ResponseProductDTO>({
        success: true,
        data: this.toResponseDto(product),
      });
    } catch (error) {
      return new BaseResponseDto<ResponseProductDTO>({
        success: false,
        message: 'Erro ao buscar produto',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async update(
    id: number,
    updateProductDto: Partial<RequestProductDto>,
  ): Promise<BaseResponseDto<ResponseProductDTO>> {
    try {
      const { imagem, ...rest } = updateProductDto;

      if (imagem && !this.isValidImageType(imagem)) {
        return new BaseResponseDto<ResponseProductDTO>({
          success: false,
          message:
            'Imagem inválida. Apenas formatos .png e .jpg são permitidos.',
        });
      }

      const productData: Partial<ProductEntity> = {
        ...rest,
        imagem: imagem ? this.base64ToBuffer(imagem) : undefined,
      };

      const product = await this.productsRepository.update(id, productData);

      if (!product) {
        return new BaseResponseDto<ResponseProductDTO>({
          success: false,
          message: 'Produto não encontrado',
        });
      }

      return new BaseResponseDto<ResponseProductDTO>({
        success: true,
        data: this.toResponseDto(product),
        message: 'Produto atualizado com sucesso',
      });
    } catch (error) {
      return new BaseResponseDto<ResponseProductDTO>({
        success: false,
        message: 'Erro ao atualizar produto',
        errors: [this.getErrorMessage(error)],
      });
    }
  }

  async remove(id: number): Promise<BaseResponseDto<void>> {
    try {
      await this.productsRepository.delete(id);
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
