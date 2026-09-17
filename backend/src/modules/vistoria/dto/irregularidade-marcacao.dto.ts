import { ApiProperty } from '@nestjs/swagger';
import { StatusIrregularidade } from '../../../common/enums/status-irregularidade.enum';

export class IrregularidadeMarcacaoDto {
  @ApiProperty({ format: 'uuid' })
  idVista: string;

  @ApiProperty()
  descricaoVista: string;

  @ApiProperty({ description: 'Posição X percentual (0-100)' })
  posXPct: number;

  @ApiProperty({ description: 'Posição Y percentual (0-100)' })
  posYPct: number;
}

export class VistaMarcacaoItemDto {
  @ApiProperty({ format: 'uuid' })
  idIrregularidade: string;

  @ApiProperty()
  numeroIrregularidade: number;

  @ApiProperty({ format: 'uuid' })
  idsintoma: string;

  @ApiProperty({ required: false })
  descricaoSintoma?: string;

  @ApiProperty({ enum: StatusIrregularidade })
  statusAtual: StatusIrregularidade;

  @ApiProperty()
  resolvido: boolean;

  @ApiProperty()
  posXPct: number;

  @ApiProperty()
  posYPct: number;
}
