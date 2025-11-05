import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('config/google-maps-key')
  getGoogleMapsKey(): { key: string } {
    try {
      return this.appService.getGoogleMapsKey();
    } catch (error) {
      this.logger.error('Erro ao obter Google Maps Key', error);
      throw error;
    }
  }
}
