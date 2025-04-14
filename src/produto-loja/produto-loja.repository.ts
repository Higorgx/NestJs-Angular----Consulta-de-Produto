import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ProdutoLoja } from './entities/produto-loja.entity';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';

@Injectable()
export class ProdutoLojaRepository {
  constructor(
    @InjectRepository(ProdutoLoja)
    private readonly repository: Repository<ProdutoLoja>,
  ) {}

  async create(produtoLojaData: Partial<ProdutoLoja>): Promise<ProdutoLoja> {
    const produtoLoja = this.repository.create(produtoLojaData);
    return await this.repository.save(produtoLoja);
  }

  async findById(id: number): Promise<ProdutoLoja | null> {
    return this.repository.findOneBy({ id });
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: {
      id?: number;
      idproduto?: number;
      idloja?: number;
    },
    orderBy: string = 'id',
    orderDirection: 'asc' | 'desc' = 'asc',
  ): Promise<PaginationResult<ProdutoLoja>> {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<ProdutoLoja> = {};

    if (filters) {
      if (filters.id) where.id = filters.id;
      if (filters.idproduto) where.idproduto = filters.idproduto;
      if (filters.idloja) where.idloja = filters.idloja;
    }

    const [data, total] = await this.repository.findAndCount({
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
    updateData: Partial<ProdutoLoja>,
  ): Promise<ProdutoLoja | null> {
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
