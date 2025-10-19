# Sistema OMNI# 🚀 Sistema OMNI - Deploy Automatizado



Sistema de gestão empresarial desenvolvido com **Angular** (frontend) e **NestJS** (backend), utilizando **PostgreSQL** como banco de dados.Sistema de gestão completo com **NestJS (Backend)** + **Angular (Frontend)** + **PostgreSQL**



## 🚀 Funcionalidades## 📌 Arquitetura



- ✅ Autenticação e autorização (JWT)- **Frontend**: Angular servido pelo IIS

- ✅ Gestão de usuários e perfis- **Backend**: NestJS rodando como serviço Windows (NSSM) na porta 8080

- ✅ Interface responsiva e moderna- **Proxy Reverso**: IIS faz proxy das requisições `/api` para o backend

- ✅ API RESTful documentada- **Banco de Dados**: PostgreSQL

- ✅ Deploy automatizado para Windows Server + IIS

---

## 📋 Pré-requisitos

## 🎯 Deploy Rápido

### Desenvolvimento

- **Node.js** 20+ LTS### 1. Desenvolvimento

- **npm** ou **yarn**```powershell

- **PostgreSQL** 12+ (local ou remoto).\deploy.ps1

- **Git** para versionamento```



### Produção (Windows Server)### 2. Servidor (como Admin)

- **Windows Server** 2016+ com IIS```powershell

- **Node.js** 20+ LTS.\install-omni.ps1

- **NSSM** (instalado automaticamente)```

- **PostgreSQL** acessível

### 3. Validar

## 🛠️ Instalação e Configuração```powershell

.\diagnostico.ps1

### 1. Clonar Repositório```

```bash

git clone <url-do-repositorio>**Pronto!** Sistema funcionando em http://gestaodetransporte.com/omni

cd omni

```---



### 2. Instalar Dependências## 📚 Documentação Completa

```bash

# Backend- **[GUIA-DEPLOY.md](./GUIA-DEPLOY.md)** - Guia completo passo a passo

cd backend- **[AVALIACAO-SCRIPTS-E-CORRECOES.md](./AVALIACAO-SCRIPTS-E-CORRECOES.md)** - Análise técnica e correções aplicadas

npm install

---

# Frontend

cd ../frontend## 🔧 Scripts Disponíveis

npm install

```| Script | Descrição | Onde Executar |

|--------|-----------|---------------|

### 3. Configurar Banco de Dados| `deploy.ps1` | Gera builds e prepara deploy | Desenvolvimento |

```sql| `install-omni.ps1` | Instalação completa automatizada | Servidor |

-- Criar banco| `diagnostico.ps1` | Valida todas as configurações | Servidor |

CREATE DATABASE omni;| `atualizar-servidor.ps1` | Atualização rápida (git pull + deploy + install) | Servidor |



-- Executar migrations (se houver)---

-- npm run migration:run

```## ⚙️ Gerenciamento



### 4. Configurar Ambiente### Backend (Serviço Windows)

```bash```powershell

# Backendnssm status OMNI-Sistema

cd backendnssm start OMNI-Sistema

cp .env.example .envnssm stop OMNI-Sistema

nssm restart OMNI-Sistema

# Editar .env com suas configurações```

notepad .env

```### Logs

```powershell

**Conteúdo mínimo do `.env`:**# Ver logs

```envGet-Content C:\Deploy\OMNI\logs\omni-stdout.log -Tail 50

NODE_ENV=development

# Monitorar em tempo real

# DatabaseGet-Content C:\Deploy\OMNI\logs\omni-stdout.log -Wait

DATABASE_HOST=localhost```

DATABASE_PORT=5432

DATABASE_USERNAME=seu_usuario### IIS

DATABASE_PASSWORD=sua_senha```powershell

DATABASE_NAME=omni# Reiniciar IIS

iisreset

# JWT

JWT_SECRET=chave-super-secreta-mude-isso# Reiniciar pool da aplicação

JWT_EXPIRATION=7dRestart-WebAppPool -Name "OMNI-AppPool"

```

# Application

PORT=3000---

```

## 🌐 URLs

## 🚀 Desenvolvimento

- **Frontend**: http://gestaodetransporte.com/omni

### Backend (NestJS)- **API**: http://gestaodetransporte.com/api

```bash- **Swagger**: http://gestaodetransporte.com/api/docs

cd backend

npm run start:dev---

# API disponível em: http://localhost:3000

```## 📦 Dependências Instaladas Automaticamente



### Frontend (Angular)- Node.js 20 LTS

```bash- NSSM (gerenciador de serviços Windows)

cd frontend- IIS URL Rewrite Module

npm start- Application Request Routing (ARR)

# Aplicação disponível em: http://localhost:4200

```---



### Build de Produção## 🛠️ Desenvolvimento Local

```bash

# Backend### Backend

cd backend```bash

npm run buildcd backend

npm install

# Frontendnpm run start:dev  # Porta 3000

cd frontend```

npm run build -- --configuration production

```### Frontend

```bash

## 📦 Produção e Deploycd frontend

npm install

### Gerar Pacote de Deployng serve  # Porta 4200

```powershell```

# Na máquina de desenvolvimento

.\deploy.ps1### Banco de Dados

# Resultado: C:\NovaVersao com arquivos prontosConfigure o PostgreSQL e crie o banco `omni`:

``````sql

CREATE DATABASE omni;

### No Servidor de Produção```



#### Primeira InstalaçãoEdite `backend/.env`:

```powershell```env

# 1. Copiar C:\NovaVersao para o servidorDATABASE_HOST=localhost

# 2. Configurar .envDATABASE_PORT=5432

notepad C:\NovaVersao\ArquivosBackend\.envDATABASE_USERNAME=postgres

DATABASE_PASSWORD=sua_senha

# 3. Executar instalaçãoDATABASE_NAME=omni

cd C:\NovaVersao```

PowerShell -ExecutionPolicy Bypass .\install-omni.ps1

```---



#### Atualizações## 📝 Configuração do Banco (Servidor)

```powershell

# 1. Gerar novo deploy na máquina devEdite `C:\Deploy\OMNI\backend\.env`:

.\deploy.ps1```env

NODE_ENV=production

# 2. Copiar para servidorDATABASE_HOST=localhost

# 3. Executar atualizaçãoDATABASE_PORT=5432

cd C:\NovaVersaoDATABASE_USERNAME=postgres

PowerShell -ExecutionPolicy Bypass .\atualizar-servidor.ps1DATABASE_PASSWORD=SUA_SENHA_AQUI

```DATABASE_NAME=omni

JWT_SECRET=sua-chave-secreta

### Acesso em ProduçãoJWT_EXPIRATION=8h

- **Aplicação:** `http://gestaodetransporte.com/omni````

- **API:** `http://gestaodetransporte.com/api`

- **Backend direto:** `http://localhost:8080` (no servidor)Depois reinicie o serviço:

```powershell

## 📁 Estrutura do Projetonssm restart OMNI-Sistema

```

```

omni/---

├── backend/                 # API NestJS

│   ├── src/## ❗ Troubleshooting

│   │   ├── auth/           # Autenticação

│   │   ├── users/          # Gestão de usuários### Erro 404

│   │   └── main.ts         # Ponto de entrada→ Executar `.\install-omni.ps1` novamente

│   ├── dist/               # Build compilado

│   ├── package.json### Erro 502/504 na API

│   └── .env                # Configurações→ Verificar se backend está rodando: `nssm status OMNI-Sistema`

├── frontend/                # Aplicação Angular

│   ├── src/### Erro 500

│   │   ├── app/→ Verificar se URL Rewrite está instalado

│   │   └── environments/

│   ├── dist/               # Build compilado**Mais detalhes**: Veja [GUIA-DEPLOY.md](./GUIA-DEPLOY.md)

│   └── angular.json

├── scripts/                 # Scripts de automação---

│   ├── deploy.ps1          # Gera pacote de produção

│   ├── install-omni.ps1    # Instalação completa## 📄 Licença

│   └── atualizar-servidor.ps1 # Atualizações rápidas

└── README.md               # Esta documentaçãoProprietário - Uso interno

```

---

## 🧪 Testes

## 👥 Equipe

```bash

# BackendDesenvolvido pela equipe de TI

cd backend

npm run test---



# Frontend**Última atualização:** Outubro/2025

cd frontend
npm run test
```

## 📚 Scripts Disponíveis

### Desenvolvimento
```bash
# Backend
npm run start:dev      # Desenvolvimento com hot-reload
npm run build          # Build de produção
npm run test           # Executar testes

# Frontend
npm start              # Servidor de desenvolvimento
npm run build          # Build de produção
npm run test           # Executar testes
```

### Produção
```powershell
.\deploy.ps1                    # Gerar pacote de deploy
.\install-omni.ps1             # Instalação inicial
.\atualizar-servidor.ps1       # Atualização de código
.\diagnostico.ps1              # Diagnóstico do sistema
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código
- **Backend:** ESLint + Prettier configurados
- **Frontend:** Angular CLI linting
- **Commits:** Usar conventional commits
- **Testes:** Cobertura mínima de 80%

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte `TROUBLESHOOTING-INSTALL.md` para problemas comuns
- Verifique os logs em `C:\Deploy\OMNI\logs\` (produção)