import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class FindTrechoDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  descricao?: string;
}
