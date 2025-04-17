import { Test, TestingModule } from '@nestjs/testing';
import { produtoLojaservice } from './produto-loja.service';
import { ProdutoLojaRepository } from './produto-loja.repository';
import { ProdutosService } from '../produtos/produtos.service';
import { LojasService } from '../lojas/lojas.service';

describe('produtoLojaservice', () => {
  let service: produtoLojaservice;
  let repository: jest.Mocked<ProdutoLojaRepository>;
  let produtosService: jest.Mocked<ProdutosService>;
  let lojasService: jest.Mocked<LojasService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        produtoLojaservice,
        {
          provide: ProdutoLojaRepository,
          useValue: {
            create: jest.fn(),
            findAllPaginated: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ProdutosService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: LojasService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(produtoLojaservice);
    repository = module.get(ProdutoLojaRepository);
    produtosService = module.get(ProdutosService);
    lojasService = module.get(LojasService);
  });

  describe('create', () => {
    const dto = { idproduto: 1, idloja: 1, precovenda: 9.99 };

    it('should create a produto-loja relation', async () => {
      produtosService.findOne.mockResolvedValue({ success: true });
      lojasService.findOne.mockResolvedValue({ success: true });
      repository.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: 1, ...dto });
    });

    it('should return error if produto not found', async () => {
      produtosService.findOne.mockResolvedValue({ success: false });

      const result = await service.create(dto);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Produto não encontrado');
    });

    it('should return error if loja not found', async () => {
      produtosService.findOne.mockResolvedValue({ success: true });
      lojasService.findOne.mockResolvedValue({ success: false });

      const result = await service.create(dto);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Loja não encontrada');
    });

    it('should handle exception', async () => {
      produtosService.findOne.mockResolvedValue({ success: true });
      lojasService.findOne.mockResolvedValue({ success: true });
      repository.create.mockRejectedValue(new Error('DB error'));

      const result = await service.create(dto);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Erro ao criar Produto-Loja');
    });
  });

  describe('findAll', () => {
    it('should return paginated result', async () => {
      const mockData = [{ id: 1, idproduto: 1, idloja: 1, precovenda: 9.99 }];
      repository.findAllPaginated.mockResolvedValue({
        data: mockData,
        total: 1,
        page: 1,
        lastPage: 1,
      });

      const result = await service.findAll({ page: 1, limit: 10 }, {});
      expect(result.success).toBe(true);
      expect(result?.data?.length).toBe(1);
    });

    it('should handle exception', async () => {
      repository.findAllPaginated.mockRejectedValue(new Error('Fail'));
      const result = await service.findAll({ page: 1, limit: 10 }, {});
      expect(result.success).toBe(false);
      expect(result.message).toBe('Erro ao buscar Produto-Loja');
    });
  });

  describe('findOne', () => {
    it('should return entity by id', async () => {
      repository.findOne.mockResolvedValue({
        id: 1,
        idproduto: 1,
        idloja: 1,
        precovenda: 19.99,
      });

      const result = await service.findOne(1);
      expect(result.success).toBe(true);
      expect(result?.data?.id).toBe(1);
    });

    it('should return not found if entity is missing', async () => {
      repository.findOne.mockResolvedValue(null);
      const result = await service.findOne(1);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Produto-Loja não encontrado');
    });

    it('should handle exception', async () => {
      repository.findOne.mockRejectedValue(new Error('Erro interno'));
      const result = await service.findOne(1);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Erro ao buscar Produto-Loja');
    });
  });

  describe('update', () => {
    const dto = { precovenda: 20.0 };

    it('should update and return entity', async () => {
      repository.update.mockResolvedValue({
        id: 1,
        idproduto: 1,
        idloja: 1,
        precovenda: 20.0,
      });

      const result = await service.update(1, dto);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Produto-Loja atualizado com sucesso');
    });

    it('should return not found if missing', async () => {
      repository.update.mockResolvedValue(null);
      const result = await service.update(1, dto);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Produto-Loja não encontrado');
    });

    it('should handle exception', async () => {
      repository.update.mockRejectedValue(new Error('DB error'));
      const result = await service.update(1, dto);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Erro ao atualizar Produto-Loja');
    });
  });

  describe('remove', () => {
    it('should delete entity successfully', async () => {
      repository.delete.mockResolvedValue(undefined);
      const result = await service.remove(1);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Produto-Loja removido com sucesso');
    });

    it('should handle exception', async () => {
      repository.delete.mockRejectedValue(new Error('Erro ao remover'));
      const result = await service.remove(1);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Erro ao remover Produto-Loja');
    });
  });
});
