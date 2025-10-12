# 🚀 Deploy do Sistema OMNI em Servidor Local

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 15+
- npm ou yarn
- Git

## 🔧 Configuração Rápida

### 1. **Configurar Banco de Dados**
```sql
-- Conectar no PostgreSQL como superuser
CREATE DATABASE omni_db;
CREATE USER omni_user WITH PASSWORD 'omni_password';
GRANT ALL PRIVILEGES ON DATABASE omni_db TO omni_user;
```

### 2. **Configurar Variáveis de Ambiente**
```bash
# Copiar e editar o arquivo de configuração
cp backend/.env.local backend/.env

# Editar as variáveis conforme seu ambiente:
# - DB_HOST (IP do servidor PostgreSQL)
# - DB_PASSWORD (senha do banco)
# - JWT_SECRET (chave secreta para produção)
```

### 3. **Instalar e Buildar**
```bash
# Instalar dependências
cd backend && npm install
cd ../frontend && npm install

# Build dos projetos
cd ../frontend && npm run build
cd ../backend && npm run build
```

### 4. **Executar**
```bash
# Iniciar backend
cd backend
npm run start:prod

# Servir frontend (escolha uma opção):
# Opção 1: Servidor simples Node.js
npx serve ../frontend/dist/frontend -p 80

# Opção 2: Apache/Nginx
# Copie frontend/dist/frontend/* para /var/www/html/
```

## 🐳 Deploy com Docker

```bash
# Build e executar com docker-compose
docker-compose -f docker-compose.local.yml up -d

# Verificar logs
docker-compose -f docker-compose.local.yml logs -f
```

## 📡 Acessar o Sistema

- **Frontend**: http://192.168.1.100 (ou IP do servidor)
- **API**: http://192.168.1.100:3000/api
- **Swagger**: http://192.168.1.100:3000/api/docs

## 🔧 Configurações de Rede

### IPs que precisam ser ajustados:
1. `frontend/src/environments/environment.prod.ts` - URL da API
2. `backend/src/main.ts` - CORS origins
3. Configurações do PostgreSQL

### Exemplo para IP 192.168.1.100:
- Frontend: `apiUrl: 'http://192.168.1.100:3000/api'`
- CORS: `'http://192.168.1.100:4200'`

## 🛠️ Troubleshooting

### Erro de CORS
- Verificar se o IP está correto no CORS do backend
- Confirmar se as portas estão abertas no firewall

### Erro de Conexão com DB
- Verificar se PostgreSQL está rodando
- Confirmar credenciais no arquivo .env
- Testar conectividade: `psql -h IP -U omni_user -d omni_db`

### Frontend não carrega
- Verificar se o build foi feito: `frontend/dist/frontend/`
- Confirmar se a URL da API está correta
- Verificar logs do servidor web

## 📁 Estrutura de Arquivos

```
/var/www/omni/
├── backend/           # API NestJS
├── frontend/dist/     # Frontend buildado
├── .env              # Variáveis de ambiente
└── logs/             # Logs da aplicação
```