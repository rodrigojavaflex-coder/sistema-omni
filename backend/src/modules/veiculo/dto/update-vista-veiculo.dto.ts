import { PartialType } from '@nestjs/swagger';
import { CreateVistaVeiculoDto } from './create-vista-veiculo.dto';

export class UpdateVistaVeiculoDto extends PartialType(CreateVistaVeiculoDto) {}
