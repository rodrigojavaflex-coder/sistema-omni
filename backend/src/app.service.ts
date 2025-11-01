import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Retorna a chave do Google Maps de forma segura
   * Em desenvolvimento: retorna a chave diretamente (localhost)
   * Em produção: gera um token que será validado no backend
   */
  getGoogleMapsKey(): { key: string } | { token: string } {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    const apiKey = this.configService.get<string>('googleMaps.apiKey') || 
                   this.configService.get<string>('app.googleMapsApiKey') || 
                   process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      throw new Error('Google Maps API Key não configurada');
    }

    if (nodeEnv === 'production') {
      // Em produção, retorna um token em vez da chave
      const token = this.generateSecureToken(apiKey);
      return { token };
    }

    // Em desenvolvimento, retorna a chave (apenas para localhost)
    return { key: apiKey };
  }

  /**
   * Gera um token seguro para produção
   * Token contém hash da chave com timestamp
   */
  private generateSecureToken(apiKey: string): string {
    const timestamp = Date.now();
    const hash = crypto
      .createHash('sha256')
      .update(`${apiKey}:${timestamp}`)
      .digest('hex');
    
    return Buffer.from(JSON.stringify({ hash, timestamp })).toString('base64');
  }

  /**
   * Valida um token de produção
   */
  validateToken(token: string): boolean {
    try {
      const decoded = JSON.parse(
        Buffer.from(token, 'base64').toString('utf-8')
      );
      const apiKey = this.configService.get<string>('googleMaps.apiKey') || 
                     this.configService.get<string>('app.googleMapsApiKey') || 
                     process.env.GOOGLE_MAPS_API_KEY;
      const expectedHash = crypto
        .createHash('sha256')
        .update(`${apiKey}:${decoded.timestamp}`)
        .digest('hex');

      return decoded.hash === expectedHash;
    } catch {
      return false;
    }
  }

  /**
   * Endpoint para produção: valida o token e retorna a chave
   * Este endpoint será chamado apenas do backend, não do frontend
   */
  getGoogleMapsKeyFromToken(token: string): { key: string } {
    if (!this.validateToken(token)) {
      throw new Error('Token inválido');
    }
    const apiKey = this.configService.get<string>('googleMaps.apiKey') || 
                   this.configService.get<string>('app.googleMapsApiKey') || 
                   process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API Key não configurada');
    }
    return { key: apiKey };
  }
}
