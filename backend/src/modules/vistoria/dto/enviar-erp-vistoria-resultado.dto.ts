import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EnviarErpVistoriaItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['ENVIADO', 'FALHA', 'IGNORADA'] })
  resultado: 'ENVIADO' | 'FALHA' | 'IGNORADA';

  @ApiPropertyOptional()
  erpNumeroVistoria?: string;

  @ApiPropertyOptional()
  erro?: string;
}

export class EnviarErpVistoriaRespostaDto {
  @ApiProperty()
  enviadas: number;

  @ApiProperty()
  falhas: number;

  @ApiProperty()
  ignoradas: number;

  @ApiProperty({ type: [EnviarErpVistoriaItemDto] })
  itens: EnviarErpVistoriaItemDto[];
}

export class ErpVistoriaStatusDto {
  @ApiProperty({
    description: 'Integração ERP habilitada na configuração do sistema',
  })
  ativo: boolean;
}
