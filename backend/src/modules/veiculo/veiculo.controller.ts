import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VeiculoService } from './veiculo.service';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
import { FindVeiculoDto } from './dto/find-veiculo.dto';
import { Veiculo } from './entities/veiculo.entity';
import type { Request } from 'express';
import { Permission } from '../../common/enums/permission.enum';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@ApiTags('veiculo')
@Controller('veiculo')
@ApiBearerAuth()
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions(Permission.VEICULO_CREATE)
  @ApiOperation({ summary: 'Criar novo veículo' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Veículo criado com sucesso',
    type: Veiculo,
  })
  create(@Body() createVeiculoDto: CreateVeiculoDto) {
    return this.veiculoService.create(createVeiculoDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions(Permission.VEICULO_READ)
  @ApiOperation({ summary: 'Listar veículos com paginação e filtros' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de veículos recuperada com sucesso',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página' })
  @ApiQuery({ name: 'descricao', required: false, description: 'Filtrar por descrição' })
  @ApiQuery({ name: 'placa', required: false, description: 'Filtrar por placa' })
  @ApiQuery({ name: 'ano', required: false, description: 'Filtrar por ano' })
  @ApiQuery({ name: 'marca', required: false, description: 'Filtrar por marca' })
  @ApiQuery({ name: 'modelo', required: false, description: 'Filtrar por modelo' })
  @ApiQuery({ name: 'combustivel', required: false, description: 'Filtrar por combustível' })
  findAll(@Query() findVeiculoDto: FindVeiculoDto) {
    return this.veiculoService.findAll(findVeiculoDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar veículo por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Veículo encontrado',
    type: Veiculo,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Veículo não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.veiculoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions(Permission.VEICULO_UPDATE)
  @ApiOperation({ summary: 'Atualizar veículo' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Veículo atualizado com sucesso', type: Veiculo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Veículo não encontrado' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão para editar veículos' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateVeiculoDto: UpdateVeiculoDto, @Req() req: Request) {
    const previous = this.veiculoService.findOne(id);
    (req as any).previousUserData = previous;
    return this.veiculoService.update(id, updateVeiculoDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions(Permission.VEICULO_DELETE)
  @ApiOperation({ summary: 'Remover veículo' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Veículo removido com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Veículo não encontrado' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão para excluir veículos' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const entity = this.veiculoService.findOne(id);
    (req as any).entityToDelete = entity;
    return this.veiculoService.remove(id);
  }
}
