import { Test, TestingModule } from '@nestjs/testing';
import { LojasService } from './lojas.service';
import { LojasRepository } from './lojas.repository';
import { RequestLojaDto } from './dto/request-loja.dto';

const mockLojasRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAllPaginated: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('LojasService', () => {
  let service: LojasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LojasService,
        {
          provide: LojasRepository,
          useValue: mockLojasRepository,
        },
      ],
    }).compile();

    service = module.get<LojasService>(LojasService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('deve criar uma loja com sucesso', async () => {
      const dto: RequestLojaDto = { id: 0, descricao: 'Loja Teste' };
      const mockLoja = { id: 1, descricao: 'Loja Teste' };

      mockLojasRepository.create.mockResolvedValue(mockLoja);

      const result = await service.create(dto);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLoja);
    });

    it('deve lançar exceção ao criar loja com erro', async () => {
      mockLojasRepository.create.mockRejectedValue(new Error('Erro DB'));
      await expect(
        service.create({ id: 0, descricao: 'Loja' }),
      ).rejects.toThrow('Erro ao criar loja: Erro DB');
    });
  });

  describe('findAll', () => {
    it('deve retornar lojas paginadas com sucesso', async () => {
      const mockResponse = {
        data: [{ id: 1, descricao: 'Loja A' }],
        total: 1,
        page: 1,
        lastPage: 1,
      };
      mockLojasRepository.findAllPaginated.mockResolvedValue(mockResponse);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.success).toBe(true);
      expect(result.total).toBe(1);
      expect(result?.data?.length).toBe(1);
    });

    it('deve lançar exceção ao buscar lojas com erro', async () => {
      mockLojasRepository.findAllPaginated.mockRejectedValue(
        new Error('Falha DB'),
      );
      await expect(service.findAll({ page: 1, limit: 10 })).rejects.toThrow(
        'Erro ao buscar lojas: Falha DB',
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar uma loja pelo ID', async () => {
      const mockLoja = { id: 1, descricao: 'Loja A' };
      mockLojasRepository.findOne.mockResolvedValue(mockLoja);

      const result = await service.findOne(1);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLoja);
    });

    it('deve lançar erro se a loja não for encontrada', async () => {
      mockLojasRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(
        'Erro ao buscar loja: Loja não encontrada',
      );
    });

    it('deve capturar erro inesperado ao buscar loja', async () => {
      mockLojasRepository.findOne.mockRejectedValue(new Error('DB falhou'));
      await expect(service.findOne(1)).rejects.toThrow(
        'Erro ao buscar loja: DB falhou',
      );
    });
  });

  describe('update', () => {
    it('deve atualizar loja com sucesso', async () => {
      const lojaAtualizada = { id: 1, descricao: 'Atualizada' };
      mockLojasRepository.update.mockResolvedValue(lojaAtualizada);

      const result = await service.update(1, { descricao: 'Atualizada' });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(lojaAtualizada);
    });

    it('deve lançar erro se loja não for encontrada na atualização', async () => {
      mockLojasRepository.update.mockResolvedValue(null);

      await expect(
        service.update(999, { descricao: 'Qualquer' }),
      ).rejects.toThrow('Erro ao atualizar loja: Loja não encontrada');
    });

    it('deve capturar erro ao atualizar loja', async () => {
      mockLojasRepository.update.mockRejectedValue(new Error('Erro update'));

      await expect(service.update(1, { descricao: 'Nova' })).rejects.toThrow(
        'Erro ao atualizar loja: Erro update',
      );
    });
  });

  describe('remove', () => {
    it('deve remover loja sem produtos associados', async () => {
      const lojaMock = { id: 1, descricao: 'Loja', produtosLoja: [] };
      mockLojasRepository.findOne.mockResolvedValue(lojaMock);
      mockLojasRepository.delete.mockResolvedValue(undefined);

      const result = await service.remove(1);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Loja removida com sucesso');
    });

    it('deve lançar erro se loja não for encontrada', async () => {
      mockLojasRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        'Erro ao remover loja: Loja não encontrada',
      );
    });

    it('deve lançar erro se houver produtos associados', async () => {
      const lojaComProdutos = {
        id: 2,
        descricao: 'Com Produtos',
        produtosLoja: [{ id: 1, precovenda: 10 }],
      };

      mockLojasRepository.findOne.mockResolvedValue(lojaComProdutos);

      await expect(service.remove(2)).rejects.toThrow(
        'Erro ao remover loja: Remova os preços associados à loja antes de excluí-la.',
      );
    });

    it('deve capturar erro ao remover loja', async () => {
      mockLojasRepository.findOne.mockResolvedValue({
        id: 3,
        descricao: 'Erro',
        produtosLoja: [],
      });
      mockLojasRepository.delete.mockRejectedValue(new Error('Erro remoção'));

      await expect(service.remove(3)).rejects.toThrow(
        'Erro ao remover loja: Erro remoção',
      );
    });
  });
});
