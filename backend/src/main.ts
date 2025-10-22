import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  
  // Configurações de encoding UTF-8
  app.use((req: Request, res: Response, next) => {
    res.charset = 'utf-8';
    next();
  });
  
  // Middleware para HEAD /
  app.use((req: Request, res: Response, next) => {
    if (req.method === 'HEAD' && req.path === '/') {
      res.status(200).end();
    } else {
      next();
    }
  });

  // Servir arquivos estáticos da pasta uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  const configService = app.get(ConfigService);

  // Configuração global de validação
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro global de exceções genérico
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configuração de CORS - Apenas para desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: [
        'http://localhost:4200',    // Angular dev server
        'http://localhost:3000',    // Backend dev
        'http://localhost:8080',    // Backend dev alternativo
        'http://127.0.0.1:4200',    // Alternativa localhost
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8080'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    });
  }

  // Prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  // Configuração do Swagger
  const swaggerConfig = configService.get('app.swagger');
  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Debug do ambiente
  console.log(`🔍 NODE_ENV: "${process.env.NODE_ENV}"`);
  console.log(`🔍 Ambiente detectado: ${process.env.NODE_ENV === 'production' ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);

  const isProduction = process.env.NODE_ENV === 'production';
  const port = isProduction ? 8080 : (process.env.PORT || configService.get('app.port') || 3000);

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Aplicação rodando na porta ${port}`);

  if (isProduction) {
    console.log(`📱 Frontend: http://gestaodetransporte.com/omni`);
    console.log(`🔧 API: http://gestaodetransporte.com/api`);
    console.log(`📚 Documentação Swagger: http://gestaodetransporte.com/api/docs`);
  } else {
    console.log(`📱 Frontend: http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
    console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
