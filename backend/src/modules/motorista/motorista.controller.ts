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
import { MotoristaService } from './motorista.service';
import { CreateMotoristaDto } from './dto/create-motorista.dto';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AuditoriaInterceptor } from '../../common/interceptors/auditoria.interceptor';

@Controller('motoristas')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(AuditoriaInterceptor)
export class MotoristaController {
  constructor(private readonly motoristaService: MotoristaService) {}

  @Post()
  @Permissions(Permission.MOTORISTA_CREATE)
  create(@Body() createMotoristaDto: CreateMotoristaDto) {
    return this.motoristaService.create(createMotoristaDto);
  }

  @Get()
  @Permissions(Permission.MOTORISTA_READ, Permission.VISTORIA_READ, Permission.OCORRENCIA_READ, Permission.OCORRENCIA_CREATE)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('nome') nome?: string,
    @Query('matricula') matricula?: string,
    @Query('cpf') cpf?: string,
    @Query('status') status?: string,
  ) {
    return this.motoristaService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
      nome,
      matricula,
      cpf,
      status,
    );
  }

  @Get(':id')
  @Permissions(Permission.MOTORISTA_READ, Permission.OCORRENCIA_READ, Permission.OCORRENCIA_CREATE)
  findOne(@Param('id') id: string) {
    return this.motoristaService.findOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.MOTORISTA_UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateMotoristaDto: UpdateMotoristaDto,
  ) {
    return this.motoristaService.update(id, updateMotoristaDto);
  }

  @Delete(':id')
  @Permissions(Permission.MOTORISTA_DELETE)
  remove(@Param('id') id: string) {
    return this.motoristaService.remove(id);
  }
}
