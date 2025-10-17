# =============================================================================
# SCRIPT DE DEPLOY PARA SERVIDOR 10.244.4.241
# Sistema OMNI - NestJS + Angular com NSSM Service
# =============================================================================

param(
    [string]$ServerIP = "10.244.4.241",
    [string]$ServiceName = "OMNI-Sistema",
    [string]$Port = "8080"
)

Write-Host "DEPLOY SISTEMA OMNI PARA SERVIDOR" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host "IP do Servidor: $ServerIP" -ForegroundColor Yellow
Write-Host "Porta: $Port" -ForegroundColor Yellow
Write-Host "Servico: $ServiceName" -ForegroundColor Yellow

# Verificar se está na pasta correta
if (!(Test-Path "backend\package.json") -or !(Test-Path "frontend\package.json")) {
    Write-Error "Execute o script na pasta raiz do projeto OMNI"
    exit 1
}

# =============================================================================
# ETAPA 1: CONFIGURAR IPs NOS ARQUIVOS
# =============================================================================
Write-Host "`n1. Configurando IPs nos arquivos..." -ForegroundColor Cyan

# Configurar IP no environment de produção do frontend
$frontendEnv = "frontend\src\environments\environment.prod.ts"
$envContent = @"
export const environment = {
  production: true,
  apiUrl: 'http://$ServerIP`:$Port/api'
};
"@
$envContent | Out-File -FilePath $frontendEnv -Encoding UTF8
Write-Host "   OK: $frontendEnv configurado" -ForegroundColor Green

# Configurar CORS no backend
$mainFile = "backend\src\main.ts"
$corsContent = Get-Content $mainFile -Raw
$corsContent = $corsContent -replace 'http://10\.244\.4\.241:8080', "http://$ServerIP`:$Port"
$corsContent = $corsContent -replace 'http://10\.244\.4\.241(?!:)', "http://$ServerIP"
$corsContent | Out-File -FilePath $mainFile -Encoding UTF8 -NoNewline
Write-Host "   OK: CORS configurado no $mainFile" -ForegroundColor Green

# =============================================================================
# ETAPA 2: GERAR BUILDS DE PRODUÇÃO
# =============================================================================
Write-Host "`n2. Gerando builds de producao..." -ForegroundColor Cyan

# Build do frontend
Write-Host "   Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install --silent
npm run build --prod --silent
if ($LASTEXITCODE -ne 0) {
    Write-Error "Erro no build do frontend"
    exit 1
}
Write-Host "   OK: Frontend build concluido" -ForegroundColor Green

# Build do backend
Write-Host "   Building backend..." -ForegroundColor Yellow
Set-Location ..\backend
npm install --silent
npm run build --silent
if ($LASTEXITCODE -ne 0) {
    Write-Error "Erro no build do backend"
    exit 1
}
Write-Host "   OK: Backend build concluido" -ForegroundColor Green
Set-Location ..

# =============================================================================
# ETAPA 3: CRIAR PASTA DE DEPLOY
# =============================================================================
Write-Host "`n3. Criando pasta de deploy..." -ForegroundColor Cyan

$deployPath = "C:\Deploy\OMNI"
if (Test-Path $deployPath) {
    Remove-Item $deployPath -Recurse -Force
}
New-Item -ItemType Directory -Path $deployPath -Force | Out-Null

# Copiar backend
New-Item -ItemType Directory -Path "$deployPath\backend\dist" -Force | Out-Null
Copy-Item "backend\dist\*" "$deployPath\backend\dist\" -Recurse -Force
Copy-Item "backend\package.json" "$deployPath\backend\" -Force
Copy-Item "backend\node_modules" "$deployPath\backend\" -Recurse -Force -ErrorAction SilentlyContinue

# Copiar frontend 
Copy-Item "frontend\dist\frontend\browser" "$deployPath\frontend\browser" -Recurse -Force

# Criar .env de produção
$envProd = @"
NODE_ENV=production
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=sua_senha_aqui
DATABASE_NAME=omni
JWT_SECRET=chave-jwt-super-secreta-para-producao
JWT_EXPIRATION=8h
"@
$envProd | Out-File -FilePath "$deployPath\backend\.env" -Encoding UTF8

Write-Host "   OK: Arquivos copiados para $deployPath" -ForegroundColor Green

# =============================================================================
# ETAPA 4: COPIAR SCRIPT DE INSTALAÇÃO COMPLETA
# =============================================================================
Write-Host "`n4. Copiando script de instalacao completa..." -ForegroundColor Cyan

# Copiar script único de instalação completa
Copy-Item "$PSScriptRoot\install-omni.ps1" "$deployPath\install-omni.ps1" -Force
Write-Host "  ✓ install-omni.ps1 copiado" -ForegroundColor Green

# Copiar script de atualização rápida
Copy-Item "$PSScriptRoot\atualizar-servidor.ps1" "$deployPath\atualizar-servidor.ps1" -Force
Write-Host "  ✓ atualizar-servidor.ps1 copiado" -ForegroundColor Green

# Script de inicialização
$startScript = @'
@echo off
cd /d C:\Deploy\OMNI\backend
node dist/main.js
'@
$startScript | Out-File -FilePath "$deployPath\start-omni.bat" -Encoding ASCII

# Script de remoção do serviço
$removeScript = @'
@echo off
echo Removendo servico OMNI...
nssm stop "OMNI-Sistema"
nssm remove "OMNI-Sistema" confirm
echo Servico removido!
pause
'@
$removeScript | Out-File -FilePath "$deployPath\remove-service.bat" -Encoding ASCII

Write-Host "   OK: Scripts criados" -ForegroundColor Green

# =============================================================================
# ETAPA 5: CRIAR DOCUMENTAÇÃO
# =============================================================================
Write-Host "`n5. Criando documentacao..." -ForegroundColor Cyan

$readme = @'
# SISTEMA OMNI - INSTALACAO AUTOMATICA

## Pre-requisitos no Servidor
- Windows Server/Windows 10+ 
- PostgreSQL configurado e rodando
- Conexao com internet (para download automatico de dependencias)

## Instalacao SUPER SIMPLES

### 1. Copiar Arquivos
Copie toda a pasta C:\Deploy\OMNI para o servidor

### 2. Configurar Banco de Dados
Edite o arquivo: C:\Deploy\OMNI\backend\.env

DATABASE_HOST=localhost
DATABASE_USERNAME=seu_usuario
DATABASE_PASSWORD=sua_senha  
DATABASE_NAME=omni

### 3. Execucao Unica - TUDO AUTOMATICO
Execute como Administrador:
PowerShell -ExecutionPolicy Bypass .\install-omni.ps1

## O que o script faz automaticamente:
- Detecta e instala Node.js 20 LTS (se necessario)
- Detecta e instala NSSM (se necessario)  
- Configura firewall automaticamente
- Instala dependencias do backend
- Configura servico Windows automaticamente
- Inicia o sistema

## Pronto! Sistema rodando em segundos

## Gerenciamento do Servico

### Iniciar:
nssm start "OMNI-Sistema"

### Parar:
nssm stop "OMNI-Sistema"

### Reiniciar:
nssm restart "OMNI-Sistema"

### Status:
nssm status "OMNI-Sistema"

### Remover:
C:\Deploy\OMNI\remove-service.bat

## URLs de Acesso
- Sistema: http://10.244.4.241:8080
- API: http://10.244.4.241:8080/api
- Swagger: http://10.244.4.241:8080/api/docs

## Logs
- Stdout: C:\Deploy\OMNI\logs\omni-stdout.log
- Stderr: C:\Deploy\OMNI\logs\omni-stderr.log

## Atualizacao

### Opcao 1: Atualizacao Rapida (Recomendada)
Para mudancas de codigo (frontend/backend):
PowerShell -ExecutionPolicy Bypass .\atualizar-servidor.ps1

### Opcao 2: Atualizacao Manual
1. Parar servico: nssm stop "OMNI-Sistema"
2. Substituir arquivos em C:\Deploy\OMNI
3. Iniciar servico: nssm start "OMNI-Sistema"

### Opcao 3: Reinstalacao Completa
Para novas dependencias ou mudancas importantes:
PowerShell -ExecutionPolicy Bypass .\install-omni.ps1

## Troubleshooting
- Verificar logs em C:\Deploy\OMNI\logs\
- Verificar se PostgreSQL esta rodando
- Verificar se porta 8080 esta livre
- Verificar permissoes da pasta C:\Deploy\OMNI
'@
$readme | Out-File -FilePath "$deployPath\README.md" -Encoding UTF8

Write-Host "   OK: Documentacao criada" -ForegroundColor Green

# =============================================================================
# RESUMO FINAL
# =============================================================================
Write-Host "`nDEPLOY CONCLUIDO!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "Pasta de deploy: $deployPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "PROXIMOS PASSOS NO SERVIDOR:" -ForegroundColor Cyan
Write-Host "1. Copiar pasta C:\Deploy\OMNI para o servidor" -ForegroundColor White
Write-Host "2. Configurar banco no arquivo .env" -ForegroundColor White
Write-Host "3. Executar como Administrador:" -ForegroundColor White
Write-Host "   PowerShell -ExecutionPolicy Bypass .\install-omni.ps1" -ForegroundColor Yellow
Write-Host "4. Acessar http://$ServerIP`:$Port" -ForegroundColor White
Write-Host ""
Write-Host "SCRIPTS INCLUIDOS:" -ForegroundColor Cyan
Write-Host "  ✓ install-omni.ps1 - Instalacao completa inicial" -ForegroundColor Green
Write-Host "  ✓ atualizar-servidor.ps1 - Atualizacoes rapidas de codigo" -ForegroundColor Green
Write-Host "  ✓ remove-service.bat - Remover servico se necessario" -ForegroundColor Green
Write-Host ""
Write-Host "O script install-omni.ps1 faz tudo automaticamente:" -ForegroundColor Cyan
Write-Host "  ✓ Verifica e instala Node.js se necessario" -ForegroundColor Green
Write-Host "  ✓ Verifica e instala NSSM se necessario" -ForegroundColor Green
Write-Host "  ✓ Configura firewall automaticamente" -ForegroundColor Green
Write-Host "  ✓ Instala dependencias do backend" -ForegroundColor Green
Write-Host "  ✓ Configura e inicia o servico Windows" -ForegroundColor Green
Write-Host ""
Write-Host "Para atualizacoes futuras use: atualizar-servidor.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Documentacao completa em: $deployPath\README.md" -ForegroundColor Yellow