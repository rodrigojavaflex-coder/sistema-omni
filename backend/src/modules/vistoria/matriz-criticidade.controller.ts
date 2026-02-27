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
import { MatrizCriticidade } from './entities/matriz-criticidade.entity';
import { MatrizCriticidadeService } from './matriz-criticidade.service';
import { CreateMatrizCriticidadeDto } from './dto/create-matriz-criticidade.dto';
import { UpdateMatrizCriticidadeDto } from './dto/update-matriz-criticidade.dto';

@ApiTags('matriz-criticidade')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('matriz-criticidade')
export class MatrizCriticidadeController {
  constructor(private readonly matrizService: MatrizCriticidadeService) {}

  @Post()
  @ApiOperation({ summary: 'Criar matriz de criticidade' })
  @ApiResponse({ status: 201, type: MatrizCriticidade })
  @Permissions(Permission.MATRIZCRITICIDADE_CREATE)
  create(@Body() dto: CreateMatrizCriticidadeDto): Promise<MatrizCriticidade> {
    return this.matrizService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar matriz de criticidade' })
  @ApiResponse({ status: 200, type: [MatrizCriticidade] })
  @Permissions(Permission.MATRIZCRITICIDADE_READ, Permission.VISTORIA_READ)
  findAll(@Query('idcomponente') idcomponente?: string): Promise<MatrizCriticidade[]> {
    return this.matrizService.findAll(idcomponente);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar matriz por id' })
  @ApiResponse({ status: 200, type: MatrizCriticidade })
  @Permissions(Permission.MATRIZCRITICIDADE_READ)
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<MatrizCriticidade> {
    return this.matrizService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar matriz de criticidade' })
  @ApiResponse({ status: 200, type: MatrizCriticidade })
  @Permissions(Permission.MATRIZCRITICIDADE_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMatrizCriticidadeDto,
  ): Promise<MatrizCriticidade> {
    return this.matrizService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir matriz de criticidade' })
  @ApiResponse({ status: 204 })
  @Permissions(Permission.MATRIZCRITICIDADE_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.matrizService.remove(id);
  }
}
