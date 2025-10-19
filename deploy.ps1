# =============================================================================
# SCRIPT DE DEPLOY PARA SERVIDOR DE PRODUÇÃO
# Sistema OMNI - NestJS + Angular com IIS + NSSM Service
# =============================================================================

param(
    [string]$Domain = "gestaodetransporte.com",
    [string]$ServiceName = "OMNI-Sistema",
    [string]$Port = "80"
)

Write-Host "DEPLOY SISTEMA OMNI PARA SERVIDOR" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host "Dominio: $Domain" -ForegroundColor Yellow
Write-Host "Porta: $Port" -ForegroundColor Yellow
Write-Host "Servico: $ServiceName" -ForegroundColor Yellow

# Verificar se está na pasta correta
if (!(Test-Path "backend\package.json") -or !(Test-Path "frontend\package.json")) {
    Write-Error "Execute o script na pasta raiz do projeto OMNI"
    exit 1
}

# =============================================================================
# ETAPA 1: CONFIGURAR AMBIENTE DE PRODUÇÃO
# =============================================================================
Write-Host "`n1. Configurando ambiente de producao..." -ForegroundColor Cyan

# Configurar environment de produção do frontend
$frontendEnv = "frontend\src\environments\environment.prod.ts"
$envContent = @"
export const environment = {
  production: true,
  apiUrl: '/api'
};
"@
$envContent | Out-File -FilePath $frontendEnv -Encoding UTF8
Write-Host "   OK: $frontendEnv configurado para proxy reverso" -ForegroundColor Green

# =============================================================================
# ETAPA 2: GERAR BUILDS DE PRODUÇÃO
# =============================================================================
Write-Host "`n2. Gerando builds de producao..." -ForegroundColor Cyan

# Build do frontend
Write-Host "   Building frontend..." -ForegroundColor Yellow
Set-Location frontend

# Limpar build anterior
if (Test-Path "dist") {
    Write-Host "   Removendo build anterior..." -ForegroundColor Gray
    Remove-Item "dist" -Recurse -Force
}

npm install --silent
npm run build -- --configuration production --base-href /omni/
if ($LASTEXITCODE -ne 0) {
    Write-Error "Erro no build do frontend"
    exit 1
}
Write-Host "   OK: Frontend build concluido com base-href /omni/" -ForegroundColor Green

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

$deployPath = "C:\NovaVersao"
if (Test-Path $deployPath) {
    Write-Host "   Removendo pasta de deploy anterior..." -ForegroundColor Gray
    Remove-Item $deployPath -Recurse -Force
}
Write-Host "   Criando estrutura de pastas..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $deployPath -Force | Out-Null
New-Item -ItemType Directory -Path "$deployPath\ArquivosBackend" -Force | Out-Null
New-Item -ItemType Directory -Path "$deployPath\ArquivosFrontend" -Force | Out-Null

# Copiar backend para ArquivosBackend
Write-Host "   Copiando backend para ArquivosBackend..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "$deployPath\ArquivosBackend\dist" -Force | Out-Null
Copy-Item "backend\dist\*" "$deployPath\ArquivosBackend\dist\" -Recurse -Force
Copy-Item "backend\package.json" "$deployPath\ArquivosBackend\" -Force
Copy-Item "backend\package-lock.json" "$deployPath\ArquivosBackend\" -Force -ErrorAction SilentlyContinue
Write-Host "   OK: Backend copiado para ArquivosBackend" -ForegroundColor Green

# Copiar frontend para ArquivosFrontend
Write-Host "   Preparando pasta do frontend..." -ForegroundColor Yellow

# Validar caminho do build do Angular
Write-Host "   Validando caminho do build..." -ForegroundColor Yellow
$frontendBuildPath = $null

if (Test-Path "frontend\dist\browser\browser\index.html") {
    $frontendBuildPath = "frontend\dist\browser\browser"
    Write-Host "   OK: Build do Angular encontrado em frontend\dist\browser\browser" -ForegroundColor Green
} elseif (Test-Path "frontend\dist\browser\index.html") {
    $frontendBuildPath = "frontend\dist\browser"
    Write-Host "   OK: Build do Angular encontrado em frontend\dist\browser" -ForegroundColor Green
} elseif (Test-Path "frontend\dist\frontend\browser\index.html") {
    $frontendBuildPath = "frontend\dist\frontend\browser"
    Write-Host "   OK: Build do Angular encontrado em frontend\dist\frontend\browser" -ForegroundColor Green
} else {
    Write-Host "   ERRO: Build do Angular nao encontrado!" -ForegroundColor Red
    Write-Host "   Verificando estrutura do dist..." -ForegroundColor Yellow
    if (Test-Path "frontend\dist") {
        Get-ChildItem "frontend\dist" -Recurse | Where-Object { $_.Name -eq "index.html" } | ForEach-Object { Write-Host "   Encontrado: $($_.FullName)" -ForegroundColor Cyan }
    } else {
        Write-Host "   Pasta frontend\dist nao existe!" -ForegroundColor Red
    }
    Write-Error "Build do Angular nao encontrado ou index.html ausente"
    exit 1
}

# Validar se o base href foi configurado corretamente
Write-Host "   Validando base href no index.html..." -ForegroundColor Yellow
$indexHtml = Get-Content "$frontendBuildPath\index.html" -Raw
if ($indexHtml -match '<base href="/omni/">') {
    Write-Host "   OK: Base href '/omni/' configurado corretamente no index.html" -ForegroundColor Green
} else {
    Write-Warning "ATENCAO: Base href '/omni/' NAO encontrado no index.html!"
    Write-Host "   Conteudo da tag base encontrada:" -ForegroundColor Yellow
    if ($indexHtml -match '<base href="([^"]+)">') {
        Write-Host "   $($matches[0])" -ForegroundColor Yellow
    }
}

Copy-Item "$frontendBuildPath\*" "$deployPath\ArquivosFrontend\" -Recurse -Force
Write-Host "   OK: Frontend copiado para ArquivosFrontend" -ForegroundColor Green

# Criar .env de produção no ArquivosBackend
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
$envProd | Out-File -FilePath "$deployPath\ArquivosBackend\.env" -Encoding UTF8

Write-Host "   OK: Arquivos preparados em $deployPath" -ForegroundColor Green

# =============================================================================
# ETAPA 4: COPIAR SCRIPTS DE INSTALAÇÃO E ATUALIZAÇÃO
# =============================================================================
Write-Host "`n4. Copiando scripts para a raiz de C:\NovaVersao..." -ForegroundColor Cyan

# Copiar scripts para a raiz
Copy-Item "$PSScriptRoot\install-omni.ps1" "$deployPath\install-omni.ps1" -Force
Write-Host "  ✓ install-omni.ps1 copiado" -ForegroundColor Green

# Copiar script de diagnóstico
Copy-Item "$PSScriptRoot\diagnostico.ps1" "$deployPath\diagnostico.ps1" -Force
Write-Host "  ✓ diagnostico.ps1 copiado" -ForegroundColor Green

# Copiar script de atualização rápida
Copy-Item "$PSScriptRoot\atualizar-servidor.ps1" "$deployPath\atualizar-servidor.ps1" -Force
Write-Host "  ✓ atualizar-servidor.ps1 copiado" -ForegroundColor Green

Write-Host "   OK: Scripts copiados para $deployPath" -ForegroundColor Green

# =============================================================================
# ETAPA 5: CRIAR DOCUMENTAÇÃO
# =============================================================================
Write-Host "`n5. Criando documentacao..." -ForegroundColor Cyan

$readme = @'
# SISTEMA OMNI - INSTALACAO AUTOMATICA

## Estrutura de Implantação

### Pasta C:\NovaVersao (staging)
```
C:\NovaVersao\
├── ArquivosBackend\     # Arquivos do NestJS (dist, package.json, .env)
├── ArquivosFrontend\    # Arquivos do Angular buildado
├── install-omni.ps1     # Instalação completa inicial
├── atualizar-servidor.ps1  # Atualizações rápidas
└── diagnostico.ps1      # Diagnóstico do sistema
```

### Pasta C:\Deploy\OMNI (produção backend)
- Backend NestJS rodando como serviço Windows (porta 8080)

### Pasta C:\inetpub\wwwroot\omni (produção frontend)
- Frontend Angular servido pelo IIS

## Pre-requisitos no Servidor
- Windows Server/Windows 10+ 
- PostgreSQL configurado e rodando
- Conexão com internet (para download automático de dependências)

## Instalação SUPER SIMPLES

### 1. Copiar Arquivos
Copie toda a pasta C:\NovaVersao para o servidor

### 2. Configurar Banco de Dados
Edite o arquivo: C:\NovaVersao\ArquivosBackend\.env

```
DATABASE_HOST=localhost
DATABASE_USERNAME=seu_usuario
DATABASE_PASSWORD=sua_senha  
DATABASE_NAME=omni
```

### 3. Execucão Única - TUDO AUTOMATICO
Entre na pasta C:\NovaVersao e execute como Administrador:
```powershell
cd C:\NovaVersao
PowerShell -ExecutionPolicy Bypass .\install-omni.ps1
```

## O que o script faz automaticamente:
- Detecta e instala Node.js 20 LTS (se necessário)
- Detecta e instala NSSM (se necessário)  
- Detecta e instala URL Rewrite Module + ARR (se necessário)
- Copia backend para C:\Deploy\OMNI
- Copia frontend para C:\inetpub\wwwroot\omni
- Configura firewall automaticamente
- Instala dependências do backend
- Configura servico Windows automaticamente
- Configura IIS com binding e proxy reverso
- Inicia o sistema

## Pronto! Sistema rodando em segundos

## Atualizações Rápidas
Para atualizar o sistema com nova versão:
1. Substitua os arquivos em C:\NovaVersao\ArquivosBackend e ArquivosFrontend
2. Execute: 
```powershell
cd C:\NovaVersao
PowerShell -ExecutionPolicy Bypass .\atualizar-servidor.ps1
```

## Gerenciamento do Servico

### Iniciar:
```
nssm start "OMNI-Sistema"
```

### Parar:
```
nssm stop "OMNI-Sistema"
```

### Reiniciar:
```
nssm restart "OMNI-Sistema"
```

### Status:
```
nssm status "OMNI-Sistema"
```

## URLs de Acesso
- Sistema: http://gestaodetransporte.com/omni
- API: http://gestaodetransporte.com/api
- Swagger: http://gestaodetransporte.com/api/docs

## Logs
- Backend: C:\Deploy\OMNI\logs\omni-stdout.log e omni-stderr.log
- IIS: C:\inetpub\logs\LogFiles

## Diagnóstico
Execute para verificar status completo do sistema:
```powershell
cd C:\NovaVersao
PowerShell -ExecutionPolicy Bypass .\diagnostico.ps1
```

## Troubleshooting
Para problemas comuns e soluções, consulte:
```powershell
notepad C:\NovaVersao\TROUBLESHOOTING-INSTALL.md
```

Ou execute diagnóstico completo:
```powershell
cd C:\NovaVersao
PowerShell -ExecutionPolicy Bypass .\diagnostico.ps1
```

Problemas mais comuns:
- NSSM em uso: Script detecta e reutiliza automaticamente
- Porta 8080 ocupada: Verificar processo e liberar
- PostgreSQL não conecta: Verificar credenciais no .env
- 404 nas APIs: Web.config com dual proxy é configurado automaticamente
'@
$readme | Out-File -FilePath "$deployPath\README.md" -Encoding UTF8

# Copiar troubleshooting guide
if (Test-Path "$PSScriptRoot\TROUBLESHOOTING-INSTALL.md") {
    Copy-Item "$PSScriptRoot\TROUBLESHOOTING-INSTALL.md" "$deployPath\TROUBLESHOOTING-INSTALL.md" -Force
    Write-Host "   OK: Guia de troubleshooting copiado" -ForegroundColor Green
}

Write-Host "   OK: Documentacao criada" -ForegroundColor Green

# =============================================================================
# RESUMO FINAL
# =============================================================================
Write-Host "`nDEPLOY CONCLUIDO!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "Pasta de deploy: $deployPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "ESTRUTURA CRIADA:" -ForegroundColor Cyan
Write-Host "  $deployPath\" -ForegroundColor White
Write-Host "    ├── ArquivosBackend\     (NestJS)" -ForegroundColor Gray
Write-Host "    ├── ArquivosFrontend\    (Angular)" -ForegroundColor Gray
Write-Host "    ├── install-omni.ps1" -ForegroundColor Gray
Write-Host "    ├── atualizar-servidor.ps1" -ForegroundColor Gray
Write-Host "    ├── diagnostico.ps1" -ForegroundColor Gray
Write-Host "    └── README.md" -ForegroundColor Gray
Write-Host ""
Write-Host "PROXIMOS PASSOS NO SERVIDOR:" -ForegroundColor Cyan
Write-Host "1. Criar pasta C:\NovaVersao no servidor" -ForegroundColor White
Write-Host "2. Copiar todo conteudo de $deployPath para C:\NovaVersao" -ForegroundColor White
Write-Host "3. Configurar banco no arquivo C:\NovaVersao\ArquivosBackend\.env" -ForegroundColor White
Write-Host "4. Executar como Administrador:" -ForegroundColor White
Write-Host "   cd C:\NovaVersao" -ForegroundColor Yellow
Write-Host "   PowerShell -ExecutionPolicy Bypass .\install-omni.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "SCRIPTS INCLUIDOS:" -ForegroundColor Cyan
Write-Host "  ✓ install-omni.ps1 - Instalacao completa inicial" -ForegroundColor Green
Write-Host "  ✓ atualizar-servidor.ps1 - Atualizacoes rapidas de codigo" -ForegroundColor Green
Write-Host "  ✓ diagnostico.ps1 - Diagnostico completo do sistema" -ForegroundColor Green
Write-Host ""
Write-Host "O script install-omni.ps1 faz tudo automaticamente:" -ForegroundColor Cyan
Write-Host "  ✓ Verifica e instala Node.js se necessario" -ForegroundColor Green
Write-Host "  ✓ Verifica e instala NSSM se necessario" -ForegroundColor Green
Write-Host "  ✓ Verifica e instala URL Rewrite + ARR se necessario" -ForegroundColor Green
Write-Host "  ✓ Copia backend para C:\Deploy\OMNI" -ForegroundColor Green
Write-Host "  ✓ Copia frontend para C:\inetpub\wwwroot\omni" -ForegroundColor Green
Write-Host "  ✓ Configura IIS com binding e proxy reverso" -ForegroundColor Green
Write-Host "  ✓ Instala dependencias do backend" -ForegroundColor Green
Write-Host "  ✓ Configura e inicia o servico Windows" -ForegroundColor Green
Write-Host ""
Write-Host "Para atualizacoes futuras use: atualizar-servidor.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Documentacao completa em: $deployPath\README.md" -ForegroundColor Yellow