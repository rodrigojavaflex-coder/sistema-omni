import { ApiProperty } from '@nestjs/swagger';

export class IrregularidadeAudioResumoItemDto {
  @ApiProperty({ description: 'ID da mídia', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Nome do arquivo' })
  nomeArquivo: string;

  @ApiProperty({ description: 'Duração em ms', required: false })
  duracaoMs?: number | null;
}

export class IrregularidadeAudioResumoDto {
  @ApiProperty({ description: 'ID da irregularidade', format: 'uuid' })
  idirregularidade: string;

  @ApiProperty({ description: 'Áudios da irregularidade', type: [IrregularidadeAudioResumoItemDto] })
  audios: IrregularidadeAudioResumoItemDto[];
}
