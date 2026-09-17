import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { VistaVeiculo } from './entities/vista-veiculo.entity';
import { VistaVeiculoService } from './vista-veiculo.service';
import { CreateVistaVeiculoDto } from './dto/create-vista-veiculo.dto';
import { UpdateVistaVeiculoDto } from './dto/update-vista-veiculo.dto';

@ApiTags('vistas-veiculo')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('vistas-veiculo')
export class VistasVeiculoController {
  constructor(private readonly vistaVeiculoService: VistaVeiculoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar vista / parte do veículo' })
  @ApiResponse({ status: 201, type: VistaVeiculo })
  @Permissions(Permission.VISTAVEICULO_CREATE)
  create(@Body() dto: CreateVistaVeiculoDto): Promise<VistaVeiculo> {
    return this.vistaVeiculoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar vistas / partes do veículo' })
  @ApiResponse({ status: 200, type: [VistaVeiculo] })
  @Permissions(
    Permission.VISTAVEICULO_READ,
    Permission.MODELOVEICULO_READ,
    Permission.MODELOVEICULO_UPDATE,
    Permission.MODELOVEICULO_VISTAS,
    Permission.MATRIZCRITICIDADE_READ,
    Permission.MATRIZCRITICIDADE_CREATE,
    Permission.MATRIZCRITICIDADE_UPDATE,
  )
  findAll(@Query('ativo') ativo?: string): Promise<VistaVeiculo[]> {
    const ativoParsed =
      ativo === undefined ? undefined : ativo === 'true' || ativo === '1';
    return this.vistaVeiculoService.findAll(ativoParsed);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar vista / parte por id' })
  @ApiResponse({ status: 200, type: VistaVeiculo })
  @Permissions(Permission.VISTAVEICULO_READ)
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<VistaVeiculo> {
    return this.vistaVeiculoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar vista / parte' })
  @ApiResponse({ status: 200, type: VistaVeiculo })
  @Permissions(Permission.VISTAVEICULO_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateVistaVeiculoDto,
  ): Promise<VistaVeiculo> {
    return this.vistaVeiculoService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Excluir vista / parte sem uso' })
  @ApiResponse({ status: 204 })
  @Permissions(Permission.VISTAVEICULO_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.vistaVeiculoService.remove(id);
  }
}
