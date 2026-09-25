import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MobileAppVersionEntryDto {
  @ApiProperty({ example: '1.3.10' })
  version: string;

  @ApiPropertyOptional({
    example: '2026-09-25',
    nullable: true,
    description: 'Data da geração (yyyy-MM-dd), quando conhecida',
  })
  date: string | null;
}

export class MobileVersaoMinimaDto {
  @ApiPropertyOptional({
    description: 'Versão mínima exigida do app (semver). Null = não bloqueia.',
    example: '1.3.9',
    nullable: true,
  })
  versaoMinima: string | null;

  @ApiProperty({
    description: 'Indica se o bloqueio por versão está ativo',
    example: true,
  })
  bloqueioAtivo: boolean;

  @ApiProperty({
    description: 'Catálogo de versões geradas do app',
    type: [MobileAppVersionEntryDto],
  })
  versoes: MobileAppVersionEntryDto[];
}
