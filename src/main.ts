import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RequestProductDto } from './products/dto/request-product.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cadastro de Produtos')
    .setDescription(
      'Esta é uma API de teste para o processo seletivo da vaga de Desenvolvedor de Software Jr. da empresa VR Software.',
    )
    .setVersion('1.0')
    .addTag('produtos')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      extraModels: [RequestProductDto],
    });
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
