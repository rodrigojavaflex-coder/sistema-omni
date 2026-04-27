import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { Request, Response, json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });

  // Aumentar limite de payload para imagens em base64
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ extended: true, limit: '20mb' }));

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

  const configService = app.get(ConfigService);
  const environment =
    configService.get<string>('app.environment') || 'development';
  const isProduction = environment === 'production';
  const allowedOrigins = isProduction
    ? [
        'https://gestaodetransporte.com',
        'https://www.gestaodetransporte.com',
        'https://sistemas.metrobus.go.gov.br',
        'http://gestaodetransporte.com',
        'http://www.gestaodetransporte.com',
        'https://api.sistemasfarmamais.com',
        'https://localhost',
        'http://localhost',
        'capacitor://localhost',
        'ionic://localhost',
      ]
    : [
        'http://localhost:4200',
        'http://localhost:3000',
        'http://localhost:8080',
        'http://localhost:8100',
        'http://localhost:8101',
        'http://127.0.0.1:4200',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:8100',
        'http://127.0.0.1:8101',
        'http://10.244.4.243:4200',
        'http://10.244.4.243:3000',
        'http://10.244.4.243:8080',
        'http://10.244.4.243:8100',
        'http://10.244.4.243:8101',
        'https://localhost',
        'http://localhost',
        'https://api-dev.sistemasfarmamais.com',
        'capacitor://localhost',
        'ionic://localhost',
      ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Servir arquivos estáticos da pasta uploads (após CORS para /uploads receberem os headers)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

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
  console.log(`🔍 NODE_ENV: "${environment}"`);
  console.log(
    `🔍 Ambiente detectado: ${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`,
  );

  const port = isProduction
    ? 8080
    : configService.get<number>('app.port') || 3000;

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Aplicação rodando na porta ${port}`);

  if (isProduction) {
    console.log(`📱 Frontend: http://gestaodetransporte.com/omni`);
    console.log(`🔧 API: http://gestaodetransporte.com/api`);
    console.log(
      `📚 Documentação Swagger: http://gestaodetransporte.com/api/docs`,
    );
  } else {
    console.log(`📱 Frontend: http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
    console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
