import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoLojaController } from './produto-loja.controller';
import { produtoLojaservice } from './produto-loja.service';
import { RequestProdutoLojaDto } from './dto/request-produto-loja.dto';
import { NotFoundException } from '@nestjs/common';

const mockProdutoLojaService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProdutoLojaController', () => {
  let controller: ProdutoLojaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoLojaController],
      providers: [
        {
          provide: produtoLojaservice,
          useValue: mockProdutoLojaService,
        },
      ],
    }).compile();

    controller = module.get<ProdutoLojaController>(ProdutoLojaController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a new product-store relation', async () => {
      const dto: RequestProdutoLojaDto = {
        idproduto: 1,
        idloja: 2,
        precovenda: 19.99,
      };

      const response = {
        success: true,
        data: { id: 1, ...dto },
        message: 'Relação produto-loja criada com sucesso',
      };

      mockProdutoLojaService.create.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(mockProdutoLojaService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of product-store relations', async () => {
      const paginationDto = { page: 1, limit: 10 };
      const filters = { id: 1, idproduto: 1, idloja: 2, precovenda: 19.99 };

      const response = {
        success: true,
        data: [],
        total: 0,
        page: 1,
        lastPage: 0,
        message: 'Relações produto-loja encontradas com sucesso',
      };

      mockProdutoLojaService.findAll.mockResolvedValue(response);

      const result = await controller.findAll(
        paginationDto,
        filters.id,
        filters.idproduto,
        filters.idloja,
        filters.precovenda,
      );

      expect(mockProdutoLojaService.findAll).toHaveBeenCalledWith(
        paginationDto,
        filters,
      );
      expect(result).toEqual(response);
    });
  });

  describe('findOne', () => {
    it('should return a relation by id', async () => {
      const relation = {
        id: 1,
        idproduto: 1,
        idloja: 1,
        precovenda: 19.99,
      };

      mockProdutoLojaService.findOne.mockResolvedValue(relation);

      const result = await controller.findOne('1');

      expect(mockProdutoLojaService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(relation);
    });

    it('should throw an error if relation not found', async () => {
      mockProdutoLojaService.findOne.mockRejectedValue(
        new NotFoundException('Relação não encontrada'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        'Relação não encontrada',
      );
    });
  });

  describe('update', () => {
    it('should update an existing relation', async () => {
      const id = '1';
      const dto: Partial<RequestProdutoLojaDto> = {
        precovenda: 24.99,
      };

      const updated = {
        id: 1,
        idproduto: 1,
        idloja: 2,
        precovenda: 24.99,
      };

      mockProdutoLojaService.update.mockResolvedValue({
        success: true,
        data: updated,
        message: 'Relação produto-loja atualizada com sucesso',
      });

      const result = await controller.update(id, dto);

      expect(mockProdutoLojaService.update).toHaveBeenCalledWith(1, dto);
      expect(result.data).toEqual(updated);
    });

    it('should throw an error if relation to update not found', async () => {
      mockProdutoLojaService.update.mockRejectedValue(
        new NotFoundException('Relação não encontrada'),
      );

      await expect(
        controller.update('999', { precovenda: 12.99 }),
      ).rejects.toThrow('Relação não encontrada');
    });
  });

  describe('remove', () => {
    it('should remove the relation', async () => {
      const response = {
        success: true,
        message: 'Relação produto-loja removida com sucesso',
      };

      mockProdutoLojaService.remove.mockResolvedValue(response);

      const result = await controller.remove('1');

      expect(mockProdutoLojaService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(response);
    });

    it('should throw NotFoundException if relation not found', async () => {
      mockProdutoLojaService.remove.mockRejectedValue(
        new NotFoundException('Relação não encontrada'),
      );

      await expect(controller.remove('999')).rejects.toThrow(
        'Relação não encontrada',
      );
    });
  });
});
