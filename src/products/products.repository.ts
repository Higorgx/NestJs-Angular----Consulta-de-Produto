import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between, Like } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async create(productData: Partial<ProductEntity>): Promise<ProductEntity> {
    const product = this.repository.create(productData);
    return await this.repository.save(product);
  }

  async findById(id: number): Promise<ProductEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: {
      id?: number;
      descricao?: string;
      custoMin?: number;
      custoMax?: number;
    },
  ): Promise<PaginationResult<ProductEntity>> {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<ProductEntity> = {};

    if (filters) {
      if (filters.id) where.id = filters.id;
      if (filters.descricao) where.descricao = Like(`%${filters.descricao}%`);
      if (filters.custoMin || filters.custoMax) {
        where.custo = Between(
          filters.custoMin || 0,
          filters.custoMax || 999999999,
        );
      }
    }

    // Forçando a tipagem explícita aqui
    const [data, total]: [ProductEntity[], number] =
      await this.repository.findAndCount({
        where,
        order: { id: 'ASC' },
        take: limit,
        skip,
      });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async update(
    id: number,
    updateData: Partial<ProductEntity>,
  ): Promise<ProductEntity | null> {
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
