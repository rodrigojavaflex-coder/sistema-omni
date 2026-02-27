import { PartialType } from '@nestjs/swagger';
import { CreateModeloVeiculoDto } from './create-modelo-veiculo.dto';

export class UpdateModeloVeiculoDto extends PartialType(CreateModeloVeiculoDto) {}
