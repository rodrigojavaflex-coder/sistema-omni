import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsEnum, IsNumber, Matches, MinLength, IsOptional } from 'class-validator';
import { Combustivel } from '../../../common/enums/combustivel.enum';
import { StatusVeiculo } from '../../../common/enums/status-veiculo.enum';

export class CreateVeiculoDto {
  @ApiProperty({ description: 'Descrição do veículo', example: 'Caminhão 3/4', maxLength: 30 })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString({ message: 'Descrição deve ser um texto' })
  @MinLength(3, { message: 'Descrição deve ter pelo menos 3 caracteres' })
  @MaxLength(30, { message: 'Descrição não pode ter mais de 30 caracteres' })
  descricao: string;

  @ApiProperty({ description: 'Placa do veículo', example: 'ABC1D23', maxLength: 10 })
  @IsNotEmpty({ message: 'Placa é obrigatória' })
  @IsString({ message: 'Placa deve ser um texto' })
  @Matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, { 
    message: 'Placa deve estar no formato brasileiro (ABC1234 ou ABC1D23)' 
  })
  placa: string;

  @ApiProperty({ description: 'Ano do veículo', example: 2020 })
  @IsNotEmpty({ message: 'Ano é obrigatório' })
  @IsNumber({}, { message: 'Ano deve ser um número' })
  ano: number;

  @ApiProperty({ description: 'Número do chassi', example: '9BWZZZ377VT004251', maxLength: 30 })
  @IsNotEmpty({ message: 'Chassi é obrigatório' })
  @IsString({ message: 'Chassi deve ser um texto' })
  @MinLength(17, { message: 'Chassi deve ter pelo menos 17 caracteres' })
  @MaxLength(30, { message: 'Chassi não pode ter mais de 30 caracteres' })
  chassi: string;

  @ApiProperty({ description: 'Marca do veículo', example: 'Volkswagen', maxLength: 50 })
  @IsNotEmpty({ message: 'Marca é obrigatória' })
  @IsString({ message: 'Marca deve ser um texto' })
  @MinLength(2, { message: 'Marca deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Marca não pode ter mais de 50 caracteres' })
  marca: string;

  @ApiProperty({ description: 'Modelo do veículo', example: 'Delivery', maxLength: 50 })
  @IsNotEmpty({ message: 'Modelo é obrigatório' })
  @IsString({ message: 'Modelo deve ser um texto' })
  @MinLength(2, { message: 'Modelo deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Modelo não pode ter mais de 50 caracteres' })
  modelo: string;

  @ApiProperty({ description: 'Combustível', enum: Combustivel })
  @IsNotEmpty({ message: 'Combustível é obrigatório' })
  @IsEnum(Combustivel, { message: 'Combustível deve ser um dos tipos válidos' })
  combustivel: Combustivel;

  @ApiProperty({ description: 'Status do veículo', enum: StatusVeiculo, default: StatusVeiculo.ATIVO })
  @IsOptional()
  @IsEnum(StatusVeiculo, { message: 'Status deve ser um dos tipos válidos' })
  status?: StatusVeiculo;

  @ApiProperty({ description: 'Marca da carroceria', example: 'Marcopolo', maxLength: 50, required: false })
  @IsOptional()
  @IsString({ message: 'Marca da carroceria deve ser um texto' })
  @MaxLength(50, { message: 'Marca da carroceria não pode ter mais de 50 caracteres' })
  marcaDaCarroceria?: string;

  @ApiProperty({ description: 'Modelo da carroceria', example: 'Volare', maxLength: 50, required: false })
  @IsOptional()
  @IsString({ message: 'Modelo da carroceria deve ser um texto' })
  @MaxLength(50, { message: 'Modelo da carroceria não pode ter mais de 50 caracteres' })
  modeloDaCarroceria?: string;
}
