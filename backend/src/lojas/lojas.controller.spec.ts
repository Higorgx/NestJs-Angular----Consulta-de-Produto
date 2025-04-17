/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { LojasController } from './lojas.controller';
import { LojasService } from './lojas.service';
import { RequestLojaDto } from './dto/request-loja.dto';
import { PaginationLojaDto } from './dto/pagination-loja.dto';

describe('LojasController', () => {
  let controller: LojasController;
  let service: LojasService;

  const mockLojasService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LojasController],
      providers: [
        {
          provide: LojasService,
          useValue: mockLojasService,
        },
      ],
    }).compile();

    controller = module.get<LojasController>(LojasController);
    service = module.get<LojasService>(LojasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a loja', async () => {
      const dto: RequestLojaDto = { descricao: 'Loja Nova', id: 0 };
      const result = { success: true, data: { id: 1, descricao: 'Loja Nova' } };

      mockLojasService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockLojasService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all lojas with pagination and filters', async () => {
      const pagination: PaginationLojaDto = { page: 1, limit: 10 };
      const filters = { id: 1, descricao: 'Teste' };
      const result = {
        success: true,
        data: [{ id: 1, descricao: 'Teste' }],
        total: 1,
        page: 1,
        lastPage: 1,
      };

      mockLojasService.findAll.mockResolvedValue(result);

      const response = await controller.findAll(
        pagination,
        filters.id,
        filters.descricao,
      );

      expect(response).toEqual(result);
      expect(mockLojasService.findAll).toHaveBeenCalledWith(
        pagination,
        filters,
      );
    });
  });

  describe('findOne', () => {
    it('should return a loja by id', async () => {
      const result = {
        success: true,
        data: { id: 1, descricao: 'Loja Teste' },
      };

      mockLojasService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockLojasService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a loja', async () => {
      const dto = { descricao: 'Loja Atualizada' };
      const result = {
        success: true,
        data: { id: 1, descricao: 'Loja Atualizada' },
      };

      mockLojasService.update.mockResolvedValue(result);

      expect(await controller.update('1', dto)).toEqual(result);
      expect(mockLojasService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a loja', async () => {
      const result = { success: true };

      mockLojasService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(mockLojasService.remove).toHaveBeenCalledWith(1);
    });
  });
});
