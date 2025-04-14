import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between, Like } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';

@Injectable()
export class ProdutosRepository {
  constructor(
    @InjectRepository(Produto)
    private readonly repository: Repository<Produto>,
  ) {}

  async create(produtoData: Partial<Produto>): Promise<Produto> {
    const produto = this.repository.create(produtoData);
    return await this.repository.save(produto);
  }

  async findById(id: number): Promise<Produto | null> {
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
    orderBy: string = 'id',
    orderDirection: 'asc' | 'desc' = 'asc',
  ): Promise<PaginationResult<Produto>> {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Produto> = {};

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

    const [data, total]: [Produto[], number] =
      await this.repository.findAndCount({
        where,
        order: {
          [orderBy]: orderDirection.toUpperCase(),
        },
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
    updateData: Partial<Produto>,
  ): Promise<Produto | null> {
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
