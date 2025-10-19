# 📋 CHANGELOG - Sistema OMNI

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2025-10-18

### Added
- ✅ Sistema inicial OMNI com Angular + NestJS
- ✅ Autenticação JWT implementada
- ✅ Scripts de deploy automatizado para Windows Server
- ✅ Instalação automática com NSSM e IIS
- ✅ Web.config global para resolver 404 nas APIs
- ✅ Documentação completa (README.md, TROUBLESHOOTING-INSTALL.md)
- ✅ Scripts de diagnóstico e atualização

### Changed
- 🔄 Reestruturação completa do projeto
- 🔄 Limpeza de arquivos desnecessários
- 🔄 Otimização dos scripts de produção

### Fixed
- 🐛 Correção do erro 404 em /api/auth/login
- 🐛 Problema de NSSM em uso durante instalação
- 🐛 Proteção automática do arquivo .env

### Technical
- 🏗️ Frontend: Angular 17+
- 🏗️ Backend: NestJS 10+
- 🏗️ Database: PostgreSQL 12+
- 🏗️ Deploy: Windows Server + IIS + NSSM

---

## [0.1.0] - 2025-10-01

### Added
- 🎯 Projeto inicial criado
- 🔐 Sistema de autenticação básico
- 📊 Estrutura de módulos implementada
- 🗄️ Configuração inicial do banco PostgreSQL

---

## Tipos de Mudanças

- `Added` para novas funcionalidades
- `Changed` para mudanças em funcionalidades existentes
- `Deprecated` para funcionalidades que serão removidas
- `Removed` para funcionalidades removidas
- `Fixed` para correção de bugs
- `Security` para correções de segurança

---

## Como Contribuir

Para contribuir com mudanças:
1. Adicione uma entrada no changelog na seção `[Unreleased]`
2. Use o formato correto (Added, Changed, Fixed, etc.)
3. Descreva claramente a mudança
4. Ao fazer release, mova as entradas para uma nova versão

Exemplo:
```markdown
### Added
- Nova funcionalidade incrível que resolve problema X
```