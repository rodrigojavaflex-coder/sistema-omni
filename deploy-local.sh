#!/bin/bash

# Script para deploy em servidor local
echo "🚀 Iniciando deploy do Sistema OMNI..."

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install

# Instalar dependências do frontend  
echo "📦 Instalando dependências do frontend..."
cd ../frontend
npm install

# Build do frontend
echo "🔨 Fazendo build do frontend..."
npm run build

# Build do backend
echo "🔨 Fazendo build do backend..."
cd ../backend
npm run build

echo "✅ Deploy concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o PostgreSQL no servidor"
echo "2. Ajuste as variáveis no arquivo .env.local"
echo "3. Execute: npm run start:prod (backend)"
echo "4. Sirva o frontend com nginx/apache da pasta: frontend/dist/frontend"