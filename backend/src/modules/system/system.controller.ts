import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('system')
@Controller('system')
export class SystemController {
  @Get('time')
  @ApiOperation({ summary: 'Retorna data/hora do servidor' })
  @ApiResponse({
    status: 200,
    description: 'Data/hora do servidor',
    schema: { example: { serverTime: new Date().toISOString() } },
  })
  getServerTime() {
    return { serverTime: new Date().toISOString() };
  }
}
