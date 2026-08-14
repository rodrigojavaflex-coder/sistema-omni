import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

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
      relations: ['perfis'],
    });

    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    return user;
  }
}
