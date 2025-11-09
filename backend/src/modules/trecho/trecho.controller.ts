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
import { TrechoService } from './trecho.service';
import { CreateTrechoDto } from './dto/create-trecho.dto';
import { UpdateTrechoDto } from './dto/update-trecho.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AuditoriaInterceptor } from '../../common/interceptors/auditoria.interceptor';

@Controller('trechos')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(AuditoriaInterceptor)
export class TrechoController {
  constructor(private readonly trechoService: TrechoService) {}

  @Post()
  @Permissions(Permission.TRECHO_CREATE)
  create(@Body() createTrechoDto: CreateTrechoDto) {
    return this.trechoService.create(createTrechoDto);
  }

  @Get()
  @Permissions(Permission.TRECHO_READ)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('descricao') descricao?: string,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: string,
  ) {
    return this.trechoService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      descricao,
      orderBy,
      order
    );
  }

  @Get('by-location/:latitude/:longitude')
  @Permissions(Permission.TRECHO_READ)
  async findByLocation(
    @Param('latitude') latitude: string,
    @Param('longitude') longitude: string,
  ) {
    try {
      return await this.trechoService.findByLocation(
        parseFloat(latitude),
        parseFloat(longitude)
      );
    } catch (error) {
      console.error('Erro no controller findByLocation:', error);
      throw error;
    }
  }

  @Get(':id')
  @Permissions(Permission.TRECHO_READ)
  findOne(@Param('id') id: string) {
    return this.trechoService.findOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.TRECHO_UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateTrechoDto: UpdateTrechoDto,
  ) {
    return this.trechoService.update(id, updateTrechoDto);
  }

  @Delete(':id')
  @Permissions(Permission.TRECHO_DELETE)
  remove(@Param('id') id: string) {
    return this.trechoService.remove(id);
  }
}
