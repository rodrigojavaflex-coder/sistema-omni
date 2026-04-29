import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';
import { PasswordResetMessageDto } from './dto/password-reset-message.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar código (OTP) por e-mail para redefinir senha' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Resposta genérica (não indica se o e-mail está cadastrado). Pode retornar 429 em excesso de tentativas.',
    type: PasswordResetMessageDto,
  })
  @ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Muitas tentativas' })
  async requestPasswordReset(
    @Body() body: PasswordResetRequestDto,
  ): Promise<PasswordResetMessageDto> {
    return this.passwordResetService.requestPasswordReset(body.email);
  }

  @Post('password-reset/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar código e definir nova senha' })
  @ApiResponse({ status: HttpStatus.OK, type: PasswordResetMessageDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos ou código incorreto' })
  @ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Código expirou ou muitas tentativas' })
  async confirmPasswordReset(
    @Body() body: PasswordResetConfirmDto,
    @Request() req,
  ): Promise<PasswordResetMessageDto> {
    return this.passwordResetService.confirmPasswordReset(body, req);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login no sistema' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Email ou senha inválidos',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req,
  ): Promise<AuthResponseDto> {
    return this.authService.login(loginDto, req);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar token de acesso' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token renovado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Refresh token inválido ou expirado',
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil do usuário recuperado com sucesso',
    type: Usuario,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de acesso inválido',
  })
  async getProfile(@Request() req): Promise<Usuario> {
    return this.authService.getProfile(req.user.id);
  }

  @Post('logout')
  // ✅ REMOVIDO: @UseGuards(AuthGuard('jwt')) - não precisa de auth para logout
  // ✅ REMOVIDO: @ApiBearerAuth() - não requer token
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer logout (invalidar token no frontend)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout realizado com sucesso',
  })
  async logout(
    @Request() req,
    @Body() body?: { token?: string },
  ): Promise<{ message: string; success: boolean }> {
    try {
      // Tentar extrair informações do usuário do token (mesmo se expirado)
      const token =
        req.headers.authorization?.replace('Bearer ', '') || body?.token;

      if (token) {
        try {
          // Tentar fazer logout com o token disponível
          const decoded = this.authService.decodeToken(token);
          if (decoded?.sub) {
            await this.authService.logout(decoded.sub, req);
          }
        } catch {
          // Se falhar ao decodificar, continua com logout simples
        }
      }

      return {
        message: 'Logout realizado com sucesso',
        success: true,
      };
    } catch {
      // Sempre retorna sucesso para logout (mesmo com erro)
      return {
        message: 'Logout realizado com sucesso',
        success: true,
      };
    }
  }
}
