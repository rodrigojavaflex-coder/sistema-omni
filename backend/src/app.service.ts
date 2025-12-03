import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Retorna a chave do Google Maps
   * A segurança é feita por HTTP Referrer Restriction no Google Cloud Console
   * e CORS no backend
   */
  getGoogleMapsKey(): { key: string } {
    const apiKey =
      this.configService.get<string>('googleMaps.apiKey') ||
      this.configService.get<string>('app.googleMapsApiKey');

    if (!apiKey) {
      this.logger.error('Google Maps API Key não configurada');
      throw new Error('Google Maps API Key não configurada');
    }

    this.logger.log(
      `Retornando chave do Google Maps (ambiente: ${this.configService.get<string>('app.environment') || 'development'})`,
    );
    return { key: apiKey };
  }
}
