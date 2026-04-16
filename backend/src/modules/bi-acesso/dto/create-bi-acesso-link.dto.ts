import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class CreateBiAcessoLinkDto {
  @ApiProperty({
    description: 'Nome exibido no menu',
    example: 'Painel Operacional',
  })
  @IsString()
  @IsNotEmpty()
  nomeMenu: string;

  @ApiProperty({
    description: 'URL do dashboard de BI',
    example: 'https://app.powerbi.com/view?r=abc123',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  url: string;

  @ApiPropertyOptional({
    description: 'Ordem de exibição',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(9999)
  ordem?: number;

  @ApiPropertyOptional({
    description: 'Se o link está ativo',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  ativo?: boolean;
}
