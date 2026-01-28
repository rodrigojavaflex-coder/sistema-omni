import { PartialType } from '@nestjs/swagger';
import { CreateTipoVistoriaDto } from './create-tipo-vistoria.dto';

export class UpdateTipoVistoriaDto extends PartialType(CreateTipoVistoriaDto) {}
