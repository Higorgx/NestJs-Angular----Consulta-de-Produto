// products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]), // Isso fornece o repositório
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
