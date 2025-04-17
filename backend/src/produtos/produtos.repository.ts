import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findOne(id: number): Promise<Produto | null> {
    const query = this.repository
      .createQueryBuilder('produto')
      .leftJoinAndSelect('produto.produtoLoja', 'produtoLoja')
      .leftJoinAndSelect('produtoLoja.idloja', 'loja')
      .addSelect(['loja.id', 'loja.descricao'])
      .andWhere('produto.id = :id', { id: id });

    const data = await query.getOne();

    return data;
  }

  async findAllPaginated(
    page = 1,
    limit = 10,
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
  ): Promise<PaginationResult<Produto>> {
    const skip = (page - 1) * limit;
    const query = this.repository
      .createQueryBuilder('produto')
      .leftJoinAndSelect('produto.produtoLoja', 'produtoLoja')
      .leftJoin('produtoLoja.idloja', 'loja')
      .addSelect(['loja.id', 'loja.descricao']);

    if (filters?.orderBy) {
      query.orderBy(
        `produto.${filters.orderBy}`,
        filters.orderDirection || 'ASC',
      );
    }

    query.skip(skip).take(limit);

    if (filters?.id) {
      query.andWhere('produto.id = :id', { id: filters.id });
    }

    if (filters?.descricao) {
      query.andWhere('produto.descricao ILIKE :descricao', {
        descricao: `%${filters.descricao}%`,
      });
    }

    if (filters?.custoMin != null) {
      query.andWhere('produto.custo >= :custoMin', {
        custoMin: filters.custoMin,
      });
    }

    if (filters?.custoMax != null) {
      query.andWhere('produto.custo <= :custoMax', {
        custoMax: filters.custoMax,
      });
    }

    if (filters?.vendaMin != null) {
      query.andWhere('produtoLoja.precovenda >= :vendaMin', {
        vendaMin: filters.vendaMin,
      });
    }

    if (filters?.vendaMax != null) {
      query.andWhere('produtoLoja.precovenda <= :vendaMax', {
        vendaMax: filters.vendaMax,
      });
    }

    const [data, total] = await query.getManyAndCount();

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
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
