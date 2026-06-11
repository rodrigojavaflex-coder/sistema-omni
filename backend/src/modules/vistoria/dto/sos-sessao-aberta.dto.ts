import { ApiProperty } from '@nestjs/swagger';

export class SosSessaoIrregularidadeDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  numeroIrregularidade?: number;

  @ApiProperty()
  nomeArea: string;

  @ApiProperty()
  nomeComponente: string;

  @ApiProperty()
  descricaoSintoma: string;

  @ApiProperty()
  qtdFotos: number;

  @ApiProperty()
  qtdAudios: number;

  @ApiProperty()
  exigeFoto: boolean;
}

export class SosSessaoAbertaDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  idVeiculo: string;

  @ApiProperty()
  idMotorista: string;

  @ApiProperty()
  odometro: number;

  @ApiProperty({ required: false, nullable: true })
  porcentagembateria: number | null;

  @ApiProperty()
  datavistoria: string;

  @ApiProperty({ required: false })
  numeroVistoria?: number;

  @ApiProperty({ required: false })
  veiculoDescricao?: string;

  @ApiProperty({ required: false })
  veiculoPlaca?: string;

  @ApiProperty({ required: false })
  motoristaNome?: string;

  @ApiProperty({ type: [SosSessaoIrregularidadeDto] })
  irregularidades: SosSessaoIrregularidadeDto[];
}
