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
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Middleware para HEAD /
  app.use((req: Request, res: Response, next) => {
    if (req.method === 'HEAD' && req.path === '/') {
      res.status(200).end();
    } else {
      next();
    }
  });

  //configurações pra gerar versão de produção do front-end
  // Usar process.cwd() para garantir compatibilidade com Render
  // Corrigir para apontar para a subpasta 'browser', onde está o index.html
  // Corrigir caminho para subir um nível na estrutura
  const angularDistPath = join(
    process.cwd(),
    '..',
    'frontend',
    'dist',
    'frontend',
    'browser',
  );
  app.useStaticAssets(angularDistPath);
  app.setBaseViewsDir(angularDistPath);

  // Middleware para servir index.html do Angular em rotas não-API
  app.use((req: Request, res: Response, next) => {
    if (
      req.method === 'GET' &&
      !req.path.startsWith('/api') &&
      !req.path.startsWith('/uploads') &&
      !req.path.startsWith('/swagger') &&
      !req.path.startsWith('/docs')
    ) {
      const indexPath = join(angularDistPath, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Erro ao servir index.html:', indexPath, err);
          res.status(404).send('index.html não encontrado');
        }
      });
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

  // Configuração de CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? [
          'http://192.168.1.100:4200',  // IP do servidor onde o frontend vai rodar
          'http://192.168.1.100:80',    // Porta 80 se for servir via nginx/apache
          'http://localhost:4200',      // Para desenvolvimento local
          'http://localhost:3000'       // Para testes locais
        ]
      : [
          'http://localhost:4200',
          'http://localhost:3000'
        ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

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

  const port = process.env.PORT || configService.get('app.port') || 10000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Aplicação rodando na porta ${port}`);
  console.log(
    `📚 Documentação Swagger disponível em: http://localhost:${port}/api/docs`,
  );
}

bootstrap();
