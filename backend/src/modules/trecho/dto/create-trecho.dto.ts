import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateTrechoDto {
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MaxLength(150, { message: 'Descrição não pode exceder 150 caracteres' })
  descricao: string;

  @IsOptional()
  @IsObject({ message: 'Área deve ser um objeto GeoJSON válido' })
  area?: any;
}
