import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RequestProdutoDto } from './produtos/dto/request-produto.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cadastro de Produtos')
    .setDescription(
      'Esta é uma API de teste para o processo seletivo da vaga de Desenvolvedor de Software Jr. da empresa VR Software.',
    )
    .setVersion('1.0')
    .addTag('Produto')
    .addTag('Loja')
    .addTag('Produto Loja')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      extraModels: [RequestProdutoDto],
    });
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  //TODO env origin frontend, version

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
