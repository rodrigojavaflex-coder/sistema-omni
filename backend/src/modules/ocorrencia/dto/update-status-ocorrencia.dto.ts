import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { StatusOcorrencia } from '../../../common/enums/status-ocorrencia.enum';

export class UpdateStatusOcorrenciaDto {
  @IsEnum(StatusOcorrencia, { message: 'Status inválido' })
  @IsNotEmpty({ message: 'Status é obrigatório' })
  status: StatusOcorrencia;

  @IsOptional()
  @MaxLength(1000, { message: 'Observação não pode ter mais de 1000 caracteres' })
  observacao?: string;
}
