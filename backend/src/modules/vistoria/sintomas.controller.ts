import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { Sintoma } from './entities/sintoma.entity';
import { SintomaService } from './sintoma.service';
import { CreateSintomaDto } from './dto/create-sintoma.dto';
import { UpdateSintomaDto } from './dto/update-sintoma.dto';

@ApiTags('sintomas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('sintomas')
export class SintomasController {
  constructor(private readonly sintomaService: SintomaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar sintoma' })
  @ApiResponse({ status: 201, type: Sintoma })
  @Permissions(Permission.SINTOMA_CREATE)
  create(@Body() dto: CreateSintomaDto): Promise<Sintoma> {
    return this.sintomaService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar sintomas' })
  @ApiResponse({ status: 200, type: [Sintoma] })
  @Permissions(Permission.SINTOMA_READ, Permission.VISTORIA_READ)
  findAll(@Query('ativo') ativo?: string): Promise<Sintoma[]> {
    const ativoParsed =
      ativo === undefined ? undefined : ativo === 'true' || ativo === '1';
    return this.sintomaService.findAll(ativoParsed);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar sintoma por id' })
  @ApiResponse({ status: 200, type: Sintoma })
  @Permissions(Permission.SINTOMA_READ)
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Sintoma> {
    return this.sintomaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar sintoma' })
  @ApiResponse({ status: 200, type: Sintoma })
  @Permissions(Permission.SINTOMA_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSintomaDto,
  ): Promise<Sintoma> {
    return this.sintomaService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir sintoma' })
  @ApiResponse({ status: 204 })
  @Permissions(Permission.SINTOMA_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.sintomaService.remove(id);
  }
}
