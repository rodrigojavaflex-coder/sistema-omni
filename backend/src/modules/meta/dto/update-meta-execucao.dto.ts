import { PartialType } from '@nestjs/mapped-types';
import { CreateMetaExecucaoDto } from './create-meta-execucao.dto';

export class UpdateMetaExecucaoDto extends PartialType(CreateMetaExecucaoDto) {}
