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

  //configuraÃ§Ãµes pra gerar versÃ£o de produÃ§Ã£o do front-end
  // Usar process.cwd() para garantir compatibilidade com Render
  // Corrigir para apontar para a subpasta 'browser', onde estÃ¡ o index.html
  // Corrigir caminho para subir um nível na estrutura
  const angularDistPath = join(
    process.cwd(),
    '..',
    'frontend',
    'browser',
  );
  app.useStaticAssets(angularDistPath);
  app.setBaseViewsDir(angularDistPath);

  // Middleware para servir index.html do Angular em rotas nÃ£o-API
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
          res.status(404).send('index.html nÃ£o encontrado');
        }
      });
    } else {
      next();
    }
  });

  // Servir arquivos estÃ¡ticos da pasta uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  const configService = app.get(ConfigService);

  // ConfiguraÃ§Ã£o global de validaÃ§Ã£o
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro global de exceÃ§Ãµes genÃ©rico
  app.useGlobalFilters(new AllExceptionsFilter());

  // ConfiguraÃ§Ã£o de CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? [
          'http://10.6.48.159:80',   // IP do servidor principal na porta 80
          'http://10.6.48.159',      // IP sem porta
          'http://gestaodetransporte.com:80',     
          'http://gestaodetransporte.com',      
        ]
      : [
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

  // Prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  // ConfiguraÃ§Ã£o do Swagger
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
  console.log(`ðŸ” NODE_ENV: "${process.env.NODE_ENV}"`);
  console.log(`ðŸ” Ambiente detectado: ${process.env.NODE_ENV === 'production' ? 'PRODUÃ‡ÃƒO' : 'DESENVOLVIMENTO'}`);
  
  const isProduction = process.env.NODE_ENV === 'production';
  const port = isProduction ? 80 : (process.env.PORT || configService.get('app.port') || 3000);
  
  await app.listen(port, '0.0.0.0');
  console.log(`ðŸš€ AplicaÃ§Ã£o rodando na porta ${port}`);
  
  if (isProduction) {
    console.log(`ðŸ“± Frontend: http://10.6.48.159:${port}`);
    console.log(`ðŸ”§ API: http://10.6.48.159:${port}/api`);
    console.log(`ðŸ“š DocumentaÃ§Ã£o Swagger: http://10.6.48.159:${port}/api/docs`);
  } else {
    console.log(`ðŸ“± Frontend: http://localhost:${port}`);
    console.log(`ðŸ”§ API: http://localhost:${port}/api`);
    console.log(`ðŸ“š DocumentaÃ§Ã£o Swagger: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
