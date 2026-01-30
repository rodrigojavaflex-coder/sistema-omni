import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateItemVistoriadoDto {
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MaxLength(300)
  descricao: string;

  @IsInt()
  @Min(1, { message: 'Sequência deve ser maior que zero' })
  sequencia: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Tipos de vistoria são obrigatórios' })
  @IsUUID('4', { each: true, message: 'Tipo de vistoria inválido' })
  tiposvistorias: string[];

  @IsBoolean()
  @IsOptional()
  obrigafoto?: boolean;

  @IsBoolean()
  @IsOptional()
  permitirfotoconforme?: boolean;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
