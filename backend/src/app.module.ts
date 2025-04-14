import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Produto } from './produtos/entities/produto.entity';
import { Loja } from './lojas/entities/loja.entity';
import { ProdutoLoja } from './produto-loja/entities/produto-loja.entity';
import { ProdutosModule } from './produtos/produtos.module';
import { LojasModule } from './lojas/lojas.module';
import { ProdutoLojaModule } from './produto-loja/produto-loja.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, ProdutosModule, LojasModule, ProdutoLojaModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Produto, Loja, ProdutoLoja],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
