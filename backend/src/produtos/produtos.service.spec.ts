import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { ProdutosRepository } from './produtos.repository';
import { RequestProdutoDto } from './dto/request-produto.dto';
import { NotFoundException } from '@nestjs/common';

const mockProdutosRepository = {
  findAllPaginated: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  delete: jest.fn(),
};

describe('ProdutosService', () => {
  let service: ProdutosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: ProdutosRepository,
          useValue: mockProdutosRepository,
        },
      ],
    }).compile();

    service = module.get<ProdutosService>(ProdutosService);
  });

  describe('findAll', () => {
    it('should return an array of produtos', async () => {
      jest.clearAllMocks();
      const result = {
        success: true,
        message: 'Produtos encontrados com sucesso',
        data: [],
        errors: undefined,
        total: 0,
        page: 1,
        lastPage: 0,
      };
      mockProdutosRepository.findAllPaginated.mockResolvedValue(result);

      const response = await service.findAll({ page: 1, limit: 10 });

      expect(response.success).toBe(true);
      expect(response.message).toBe('Produtos encontrados com sucesso');
      expect(response).toMatchObject(result);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      jest.clearAllMocks();

      const mockProduto: RequestProdutoDto = {
        descricao: 'Produto Teste',
        custo: 10,
        imagem: 'data:image/png;base64,image-content',
      };

      const created = {
        id: 1,
        ...mockProduto,
        produtoLoja: [],
      };

      mockProdutosRepository.create.mockResolvedValue(created);
      mockProdutosRepository.save.mockResolvedValue(created);

      const result = await service.create(mockProduto);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        descricao: 'Produto Teste',
        custo: 10,
      });
    });

    it('should throw an error if invalid image format', async () => {
      jest.clearAllMocks();

      const invalidProduto = {
        descricao: 'Produto Inválido',
        custo: 10,
        imagem: 'sem-base64',
      };

      await expect(service.create(invalidProduto)).rejects.toThrowError(
        'Imagem inválida. Apenas formatos .png e .jpg são permitidos.',
      );
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      jest.clearAllMocks();
      const id = 1;
      const produtoExistente = {
        id,
        descricao: 'Antigo',
        custo: 20,
        imagem: 'data:image/png;base64,imagem',
        produtoLoja: [],
      };

      mockProdutosRepository.findOne.mockResolvedValue(produtoExistente);
      const produtoAtualizado = produtoExistente;
      produtoAtualizado.descricao = 'Atualizado';
      mockProdutosRepository.update.mockResolvedValue(produtoAtualizado);

      const result = await service.update(id, {
        descricao: 'Atualizado',
        custo: 20,
        imagem: 'data:image/png;base64,imagem',
      });
      expect(result.success).toBe(true);
      expect(result?.data?.descricao).toBe('Atualizado');
    });

    it('should throw an error if product to update not found', async () => {
      jest.clearAllMocks();
      const id = 999;
      mockProdutosRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(id, {
          descricao: 'Inexistente',
          custo: 10,
          imagem: 'data:image/png;base64,imagem',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.clearAllMocks();
      const id = 1;
      const produto = {
        id,
        descricao: 'Produto',
        custo: 10,
        imagem: 'data:image/png;base64,img',
        produtoLoja: [],
      };

      mockProdutosRepository.findOne.mockResolvedValue(produto);
      mockProdutosRepository.remove.mockResolvedValue(id);

      const result = await service.remove(id);
      expect(result.success).toBe(true);
      expect(result.data).toBeUndefined();
    });

    it('should throw an error if product to remove not found', async () => {
      jest.clearAllMocks();
      mockProdutosRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
    it('should throw an error if produto has associated prices', async () => {
      jest.clearAllMocks();
      const produtoComPrecos = {
        id: 4,
        descricao: 'Produto com preços',
        custo: 104.84,
        imagem: null,
        produtoLoja: [
          {
            id: 1,
            idproduto: 4,
            idloja: { id: 2, descricao: 'Loja centro' },
            precovenda: 1231.0,
          },
        ],
      };

      mockProdutosRepository.findOne.mockResolvedValue(produtoComPrecos);

      await expect(service.remove(4)).rejects.toThrow(
        'Remova os preços associados ao produto antes de excluí-lo.',
      );
    });
  });
});
