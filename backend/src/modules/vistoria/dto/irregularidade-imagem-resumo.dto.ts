import { ApiProperty } from '@nestjs/swagger';

export class IrregularidadeImagemResumoItemDto {
  @ApiProperty({ description: 'Nome do arquivo' })
  nomeArquivo: string;

  @ApiProperty({ description: 'Tamanho do arquivo em bytes' })
  tamanho: number;

  @ApiProperty({ description: 'Conteúdo em base64' })
  dadosBase64: string;
}

export class IrregularidadeImagemResumoDto {
  @ApiProperty({ description: 'ID da irregularidade', format: 'uuid' })
  idirregularidade: string;

  @ApiProperty({ description: 'Imagens da irregularidade', type: [IrregularidadeImagemResumoItemDto] })
  imagens: IrregularidadeImagemResumoItemDto[];
}
