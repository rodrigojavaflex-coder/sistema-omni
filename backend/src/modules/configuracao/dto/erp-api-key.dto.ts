import { ApiProperty } from '@nestjs/swagger';

export class ErpApiKeyDto {
  @ApiProperty({ description: 'Indica se existe API Key salva' })
  configurada: boolean;

  @ApiProperty({ description: 'API Key em claro; vazia se não houver' })
  apiKey: string;
}
