import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loja } from './entities/loja.entity';
import { LojasService } from './lojas.service';
import { LojasRepository } from './lojas.repository';
import { LojasController } from './lojas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Loja])],
  controllers: [LojasController],
  providers: [LojasService, LojasRepository],
  exports: [LojasService],
})
export class LojasModule {}
