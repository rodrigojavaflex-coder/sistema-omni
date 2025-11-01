import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OcorrenciaService } from './ocorrencia.service';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AuditoriaInterceptor } from '../../common/interceptors/auditoria.interceptor';

@Controller('ocorrencias')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(AuditoriaInterceptor)
export class OcorrenciaController {
  constructor(private readonly ocorrenciaService: OcorrenciaService) {}

  @Post()
  @Permissions(Permission.OCORRENCIA_CREATE)
  create(@Body() createOcorrenciaDto: CreateOcorrenciaDto) {
    return this.ocorrenciaService.create(createOcorrenciaDto);
  }

  @Get()
  @Permissions(Permission.OCORRENCIA_READ)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('tipo') tipo?: string | string[],
    @Query('linha') linha?: string | string[],
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('idVeiculo') idVeiculo?: string,
    @Query('idMotorista') idMotorista?: string,
    @Query('arco') arco?: string | string[],
    @Query('sentidoVia') sentidoVia?: string | string[],
    @Query('tipoLocal') tipoLocal?: string | string[],
    @Query('culpabilidade') culpabilidade?: string | string[],
    @Query('houveVitimas') houveVitimas?: string | string[],
    @Query('terceirizado') terceirizado?: string | string[],
  ) {
    return this.ocorrenciaService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      tipo as string | string[] | undefined,
      linha as string | string[] | undefined,
      dataInicio,
      dataFim,
      idVeiculo,
      idMotorista,
      arco as string | string[] | undefined,
      sentidoVia as string | string[] | undefined,
      tipoLocal as string | string[] | undefined,
      culpabilidade as string | string[] | undefined,
      houveVitimas as string | string[] | undefined,
      terceirizado as string | string[] | undefined,
    );
  }

  @Get('statistics')
  @Permissions(Permission.OCORRENCIA_READ)
  getStatistics(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.ocorrenciaService.getStatistics(dataInicio, dataFim);
  }

  @Get('nearby')
  @Permissions(Permission.OCORRENCIA_READ)
  findByLocation(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radius') radius?: string,
  ) {
    return this.ocorrenciaService.findByLocation(
      parseFloat(latitude),
      parseFloat(longitude),
      radius ? parseInt(radius, 10) : 1000,
    );
  }

  @Get(':id')
  @Permissions(Permission.OCORRENCIA_READ)
  findOne(@Param('id') id: string) {
    return this.ocorrenciaService.findOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.OCORRENCIA_UPDATE)
  update(@Param('id') id: string, @Body() updateOcorrenciaDto: UpdateOcorrenciaDto) {
    return this.ocorrenciaService.update(id, updateOcorrenciaDto);
  }

  @Delete(':id')
  @Permissions(Permission.OCORRENCIA_DELETE)
  remove(@Param('id') id: string) {
    return this.ocorrenciaService.remove(id);
  }
}
