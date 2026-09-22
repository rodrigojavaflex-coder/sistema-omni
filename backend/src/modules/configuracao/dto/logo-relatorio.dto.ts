import { ApiProperty } from '@nestjs/swagger';

export class LogoRelatorioDto {
  @ApiProperty({
    description:
      'Marcador `db` quando a logo está em bytea; path legado se ainda não migrada; nulo se não cadastrada',
    nullable: true,
  })
  logoRelatorio: string | null;

  @ApiProperty({
    description:
      'Logo em data URL (base64) lida de `logo_relatorio_bytes`; não depende de arquivos em /uploads',
    nullable: true,
  })
  dataUrl: string | null;
}
