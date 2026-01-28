import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTipoVistoriaDto {
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MaxLength(300)
  descricao: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
