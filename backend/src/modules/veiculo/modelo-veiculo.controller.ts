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
import { ModeloVeiculo } from './entities/modelo-veiculo.entity';
import { ModeloVeiculoService } from './modelo-veiculo.service';
import { CreateModeloVeiculoDto } from './dto/create-modelo-veiculo.dto';
import { UpdateModeloVeiculoDto } from './dto/update-modelo-veiculo.dto';

@ApiTags('modelos-veiculo')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('modelos-veiculo')
export class ModeloVeiculoController {
  constructor(private readonly modeloService: ModeloVeiculoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar modelo de veículo' })
  @ApiResponse({ status: 201, type: ModeloVeiculo })
  @Permissions(Permission.MODELOVEICULO_CREATE)
  create(@Body() dto: CreateModeloVeiculoDto): Promise<ModeloVeiculo> {
    return this.modeloService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar modelos de veículo' })
  @ApiResponse({ status: 200, type: [ModeloVeiculo] })
  @Permissions(Permission.MODELOVEICULO_READ, Permission.VEICULO_READ)
  findAll(@Query('ativo') ativo?: string): Promise<ModeloVeiculo[]> {
    const ativoParsed =
      ativo === undefined ? undefined : ativo === 'true' || ativo === '1';
    return this.modeloService.findAll(ativoParsed);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar modelo por id' })
  @ApiResponse({ status: 200, type: ModeloVeiculo })
  @Permissions(Permission.MODELOVEICULO_READ)
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<ModeloVeiculo> {
    return this.modeloService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar modelo de veículo' })
  @ApiResponse({ status: 200, type: ModeloVeiculo })
  @Permissions(Permission.MODELOVEICULO_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateModeloVeiculoDto,
  ): Promise<ModeloVeiculo> {
    return this.modeloService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir modelo de veículo' })
  @ApiResponse({ status: 204 })
  @Permissions(Permission.MODELOVEICULO_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.modeloService.remove(id);
  }
}
