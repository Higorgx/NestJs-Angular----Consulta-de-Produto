import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { RequestProdutoDto } from './dto/request-produto.dto';
import { NotFoundException } from '@nestjs/common';

const mockProdutosService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProdutosController', () => {
  let controller: ProdutosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutosController],
      providers: [
        {
          provide: ProdutosService,
          useValue: mockProdutosService,
        },
      ],
    }).compile();

    controller = module.get<ProdutosController>(ProdutosController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a new product and return success response', async () => {
      const dto: RequestProdutoDto = {
        descricao: 'Produto Teste',
        custo: 10,
        imagem: 'data:image/png;base64,imagem',
      };

      const response = {
        success: true,
        data: {
          id: 1,
          ...dto,
        },
        message: 'Produto criado com sucesso',
      };

      mockProdutosService.create.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(mockProdutosService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('findAll', () => {
    it('should return paginated list of products', async () => {
      const paginationDto = { page: 1, limit: 10 };

      const response = {
        success: true,
        data: [],
        total: 0,
        page: 1,
        lastPage: 0,
        message: 'Produtos encontrados com sucesso',
      };

      mockProdutosService.findAll.mockResolvedValue(response);

      const result = await controller.findAll(paginationDto);

      expect(mockProdutosService.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(response);
    });
  });

  describe('findOne', () => {
    it('should return product by id', async () => {
      const produto = {
        id: 1,
        descricao: 'Produto A',
        custo: 100,
        imagem: null,
        produtoLoja: [],
      };

      mockProdutosService.findOne.mockResolvedValue(produto);

      const result = await controller.findOne('1');

      expect(mockProdutosService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(produto);
    });
  });

  describe('update', () => {
    it('should update and return the updated product', async () => {
      const id = '1';
      const dto = {
        descricao: 'Produto Atualizado',
        custo: 150,
        imagem: 'data:image/png;base64,imagem',
      };

      const updated = {
        id: 1,
        ...dto,
        produtoLoja: [],
      };

      mockProdutosService.update.mockResolvedValue({
        success: true,
        data: updated,
      });

      const result = await controller.update(id, dto);

      expect(mockProdutosService.update).toHaveBeenCalledWith(1, dto);
      expect(result.data).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove the product', async () => {
      const response = {
        success: true,
        message: 'Produto removido com sucesso',
      };

      mockProdutosService.remove.mockResolvedValue(response);

      const result = await controller.remove('1');

      expect(mockProdutosService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(response);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProdutosService.remove.mockRejectedValue(
        new NotFoundException('Produto não encontrado'),
      );

      await expect(controller.remove('999')).rejects.toThrow(
        'Produto não encontrado',
      );
    });
  });
});
