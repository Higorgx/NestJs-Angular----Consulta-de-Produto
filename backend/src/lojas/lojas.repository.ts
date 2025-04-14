import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Loja } from './entities/loja.entity';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';

@Injectable()
export class LojasRepository {
  constructor(
    @InjectRepository(Loja)
    private readonly repository: Repository<Loja>,
  ) {}

  async create(lojaData: Partial<Loja>): Promise<Loja> {
    const loja = this.repository.create(lojaData);
    return await this.repository.save(loja);
  }

  async findById(id: number): Promise<Loja | null> {
    return this.repository.findOneBy({ id });
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: {
      id?: number;
      descricao?: string;
    },
    orderBy: string = 'id',
    orderDirection: 'asc' | 'desc' = 'asc',
  ): Promise<PaginationResult<Loja>> {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Loja> = {};

    if (filters) {
      if (filters.id) where.id = filters.id;
      if (filters.descricao) where.descricao = Like(`%${filters.descricao}%`);
    }

    const [data, total]: [Loja[], number] = await this.repository.findAndCount({
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

  async update(id: number, updateData: Partial<Loja>): Promise<Loja | null> {
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
