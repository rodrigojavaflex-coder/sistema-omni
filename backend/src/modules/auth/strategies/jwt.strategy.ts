import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { UsuarioEmpresaManutencao } from '../../usuarios/entities/usuario-empresa-manutencao.entity';

function extractJwtFromQueryParam(req: Request): string | null {
  const raw = req.query?.access_token;
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim();
  }
  return null;
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    @InjectRepository(UsuarioEmpresaManutencao)
    private readonly usuarioEmpresaManutencaoRepository: Repository<UsuarioEmpresaManutencao>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        extractJwtFromQueryParam,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'default-secret-key'),
    });
  }

  async validate(payload: JwtPayload): Promise<Usuario> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, ativo: true },
      relations: ['perfis', 'empresa'],
    });

    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    const vinculos = await this.usuarioEmpresaManutencaoRepository.find({
      where: { usuarioId: user.id },
      relations: ['empresa'],
      order: { criadoEm: 'ASC' },
    });
    user.empresasManutencao = vinculos
      .filter((v) => v.empresa)
      .map((v) => ({ id: v.empresa.id, descricao: v.empresa.descricao }));
    user.idsEmpresasManutencao = user.empresasManutencao.map((e) => e.id);
    if (!user.idEmpresa && user.idsEmpresasManutencao[0]) {
      user.idEmpresa = user.idsEmpresasManutencao[0];
    }

    return user;
  }
}
