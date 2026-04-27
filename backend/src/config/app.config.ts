import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10), // Porta 3000 padrão para servidor local
  environment: process.env.NODE_ENV || 'development',
  // Deve coincidir com JwtModule / JwtStrategy (default: default-secret-key)
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  swagger: {
    title: process.env.SWAGGER_TITLE || 'Sistema OMNI - API Documentation',
    description: process.env.SWAGGER_DESCRIPTION || 'API do Sistema OMNI',
    version: process.env.SWAGGER_VERSION || '1.0',
  },
}));
