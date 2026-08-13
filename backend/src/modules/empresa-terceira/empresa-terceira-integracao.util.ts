import { CreateEmpresaTerceiraDto } from './dto/create-empresa-terceira.dto';
import { UpdateEmpresaTerceiraDto } from './dto/update-empresa-terceira.dto';

const INTEGRACAO_DTO_KEYS = [
  'integracaoManutencao',
  'brtUrlBase',
  'brtTenEmp',
  'brtToken',
  'brtAmbiente',
  'brtNomSol',
  'brtTelCtt',
  'brtLocAtd',
] as const;

export function stripIntegracaoFromCreateDto(
  dto: CreateEmpresaTerceiraDto,
): CreateEmpresaTerceiraDto {
  const copy = { ...dto };
  for (const key of INTEGRACAO_DTO_KEYS) {
    delete copy[key];
  }
  return copy;
}

export function stripIntegracaoFromUpdateDto(
  dto: UpdateEmpresaTerceiraDto,
): UpdateEmpresaTerceiraDto {
  const copy = { ...dto };
  for (const key of INTEGRACAO_DTO_KEYS) {
    delete copy[key];
  }
  return copy;
}
