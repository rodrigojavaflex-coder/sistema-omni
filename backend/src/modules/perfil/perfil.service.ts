import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PERMISSION_GROUPS, Permission } from '../../common/enums/permission.enum';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Perfil } from './entities/perfil.entity';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PerfilService {
  constructor(
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  create(createDto: CreatePerfilDto): Promise<Perfil> {
    const perfil = this.perfilRepository.create(createDto);
    return this.perfilRepository.save(perfil);
  }

  async findAll(): Promise<Perfil[]> {
    const perfis = await this.perfilRepository.find();
    
    // Limpar permissões obsoletas de todos os perfis
    const validPermissions = Object.values(Permission);
    let cleaned = false;
    
    for (const perfil of perfis) {
      const originalLength = perfil.permissoes?.length || 0;
      const cleanedPermissions = perfil.permissoes?.filter(p => 
        validPermissions.includes(p)
      ) || [];
      
      if (originalLength !== cleanedPermissions.length) {
        console.log(`🧹 Limpando permissões obsoletas do perfil ${perfil.nomePerfil}:`, {
          antes: originalLength,
          depois: cleanedPermissions.length,
          removidas: perfil.permissoes?.filter(p => !validPermissions.includes(p))
        });
        perfil.permissoes = cleanedPermissions;
        cleaned = true;
      }
    }
    
    // Salvar todos os perfis de uma vez se houve limpeza
    if (cleaned) {
      await this.perfilRepository.save(perfis);
    }
    
    return perfis;
  }

  async findOne(id: string): Promise<Perfil> {
    const perfil = await this.perfilRepository.findOne({ where: { id } });
    if (!perfil) {
      throw new NotFoundException(`Perfil com id ${id} não encontrado`);
    }
    
    // Limpar permissões obsoletas (que não existem mais no enum)
    const validPermissions = Object.values(Permission);
    const originalLength = perfil.permissoes?.length || 0;
    const cleanedPermissions = perfil.permissoes?.filter(p => 
      validPermissions.includes(p)
    ) || [];
    
    // Se houve remoção de permissões obsoletas, atualizar no banco
    if (originalLength !== cleanedPermissions.length) {
      console.log(`🧹 Limpando permissões obsoletas do perfil ${perfil.nomePerfil}:`, {
        antes: originalLength,
        depois: cleanedPermissions.length,
        removidas: perfil.permissoes?.filter(p => !validPermissions.includes(p))
      });
      perfil.permissoes = cleanedPermissions;
      await this.perfilRepository.save(perfil);
    }
    
    return perfil;
  }

  async update(id: string, updateDto: UpdatePerfilDto): Promise<Perfil> {
    const perfil = await this.findOne(id);
    Object.assign(perfil, updateDto);
    return this.perfilRepository.save(perfil);
  }

  async remove(id: string): Promise<void> {
    const perfil = await this.findOne(id);
    await this.perfilRepository.remove(perfil);
  }
  
  /**
   * Gera dados formatados para impressão de perfil
   */
  async getPrintData(id: string): Promise<{
    nomePerfil: string;
    printedAt: Date;
    users: string[];
    groups: { group: string; permissions: string[] }[];
  }> {
    const perfil = await this.findOne(id);
    // Formatar grupos de permissões
    const groups = Object.entries(PERMISSION_GROUPS).map(([group, items]) => {
      const labels = items
        .filter(item => perfil.permissoes.includes(item.key as unknown as Permission))
        .map(item => item.label);
      return { group, permissions: labels };
    }).filter(g => g.permissions.length > 0);
    // Listar usuários vinculados ao perfil
    const usuarios = await this.usuarioRepository.find({
      where: { perfil: { id } },
      select: ['nome'],
    });
    const users = usuarios.map(u => u.nome);

    return {
      nomePerfil: perfil.nomePerfil,
      printedAt: new Date(),
      users,
      groups,
    };
  }
}
