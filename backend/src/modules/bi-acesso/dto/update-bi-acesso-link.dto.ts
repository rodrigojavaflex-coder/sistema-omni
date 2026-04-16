import { PartialType } from '@nestjs/swagger';
import { CreateBiAcessoLinkDto } from './create-bi-acesso-link.dto';

export class UpdateBiAcessoLinkDto extends PartialType(CreateBiAcessoLinkDto) {}
