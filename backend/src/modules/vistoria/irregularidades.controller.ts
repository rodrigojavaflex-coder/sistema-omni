import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { Irregularidade } from './entities/irregularidade.entity';
import { IrregularidadeImagem } from './entities/irregularidade-imagem.entity';
import { IrregularidadeService } from './irregularidade.service';
import { UpdateIrregularidadeDto } from './dto/update-irregularidade.dto';

@ApiTags('irregularidades')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('irregularidades')
export class IrregularidadesController {
  constructor(private readonly irregularidadeService: IrregularidadeService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar irregularidade' })
  @ApiResponse({ status: 200, type: Irregularidade })
  @Permissions(Permission.VISTORIA_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateIrregularidadeDto,
  ): Promise<Irregularidade> {
    return this.irregularidadeService.update(id, dto);
  }

  @Post(':id/imagens')
  @ApiOperation({ summary: 'Enviar imagens da irregularidade' })
  @ApiResponse({ status: 201, type: [IrregularidadeImagem] })
  @Permissions(Permission.VISTORIA_UPDATE)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImages(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<IrregularidadeImagem[]> {
    return this.irregularidadeService.uploadImages(id, files);
  }

  @Post(':id/audio')
  @ApiOperation({ summary: 'Enviar áudio da irregularidade' })
  @ApiResponse({ status: 201, type: Irregularidade })
  @Permissions(Permission.VISTORIA_UPDATE)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 15 * 1024 * 1024 },
    }),
  )
  uploadAudio(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('duracao_ms') duracaoMs?: string,
  ): Promise<Irregularidade> {
    const parsed = duracaoMs ? Number(duracaoMs) : undefined;
    return this.irregularidadeService.uploadAudio(id, file, parsed);
  }

  @Delete(':id/audio')
  @ApiOperation({ summary: 'Remover áudio da irregularidade' })
  @ApiResponse({ status: 200, type: Irregularidade })
  @Permissions(Permission.VISTORIA_UPDATE)
  removeAudio(@Param('id', new ParseUUIDPipe()) id: string): Promise<Irregularidade> {
    return this.irregularidadeService.removeAudio(id);
  }
}
