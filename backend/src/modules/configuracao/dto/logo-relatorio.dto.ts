import { ApiProperty } from '@nestjs/swagger';

export class LogoRelatorioDto {
  @ApiProperty({
    description: 'Caminho ou URL da logo do relatório; nulo se não cadastrada',
    nullable: true,
  })
  logoRelatorio: string | null;

  @ApiProperty({
    description: 'Logo em data URL (base64) para preview/impressão sem depender de /uploads no IIS',
    nullable: true,
  })
  dataUrl: string | null;
}
