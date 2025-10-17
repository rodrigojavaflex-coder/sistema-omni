# =============================================================================
# INSTALACAO COMPLETA SISTEMA OMNI
# Script que detecta e instala apenas o que esta faltando
# =============================================================================

param(
    [string]$ServiceName = "OMNI-Sistema"
)

# Verificar se esta executando como Administrador
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "ERRO: Este script deve ser executado como Administrador!" -ForegroundColor Red
    Write-Host "Clique com botao direito no PowerShell e selecione 'Executar como Administrador'" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "=========================================" -ForegroundColor Green
Write-Host "  INSTALACAO COMPLETA SISTEMA OMNI" -ForegroundColor Green  
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# =============================================================================
# FUNCAO: VERIFICAR E INSTALAR NODE.JS
# =============================================================================
function Install-NodeJS {
    Write-Host "Verificando Node.js..." -ForegroundColor Cyan
    
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            $version = $nodeVersion -replace "v", ""
            $majorVersion = [int]($version -split "\.")[0]
            
            if ($majorVersion -ge 18) {
                Write-Host "  OK: Node.js $nodeVersion ja instalado (versao adequada)" -ForegroundColor Green
                return
            } else {
                Write-Host "  AVISO: Node.js $nodeVersion encontrado, mas versao muito antiga" -ForegroundColor Yellow
            }
        }
    } catch {
        Write-Host "  INFO: Node.js nao encontrado" -ForegroundColor Red
    }
    
    Write-Host "  Instalando Node.js 20 LTS..." -ForegroundColor Yellow
    
    $nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
    $nodeInstaller = "$env:TEMP\nodejs.msi"
    
    try {
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller -UseBasicParsing
        Start-Process msiexec.exe -ArgumentList "/i `"$nodeInstaller`" /quiet /norestart" -Wait
        Remove-Item $nodeInstaller -Force
        
        # Atualizar PATH na sessao atual
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        
        Write-Host "  OK: Node.js instalado com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "  ERRO: Falha ao instalar Node.js: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# =============================================================================
# FUNCAO: VERIFICAR E INSTALAR NSSM
# =============================================================================
function Install-NSSM {
    Write-Host "Verificando NSSM..." -ForegroundColor Cyan
    
    try {
        $nssmCheck = nssm version 2>$null
        if ($nssmCheck) {
            Write-Host "  OK: NSSM ja instalado" -ForegroundColor Green
            return
        }
    } catch {
        Write-Host "  INFO: NSSM nao encontrado" -ForegroundColor Red
    }
    
    Write-Host "  Instalando NSSM..." -ForegroundColor Yellow
    
    $nssmUrl = "https://nssm.cc/release/nssm-2.24.zip"
    $nssmZip = "$env:TEMP\nssm.zip"
    $nssmDir = "C:\nssm"
    
    try {
        Invoke-WebRequest -Uri $nssmUrl -OutFile $nssmZip -UseBasicParsing
        
        if (Test-Path $nssmDir) {
            Remove-Item $nssmDir -Recurse -Force
        }
        
        Expand-Archive -Path $nssmZip -DestinationPath $nssmDir -Force
        
        # Mover arquivos da subpasta para a raiz
        $nssmSubDir = Get-ChildItem $nssmDir -Directory | Select-Object -First 1
        $nssmBin = Join-Path $nssmSubDir.FullName "win64"
        
        Copy-Item "$nssmBin\*" $nssmDir -Force
        Remove-Item $nssmSubDir.FullName -Recurse -Force
        Remove-Item $nssmZip -Force
        
        # Adicionar ao PATH do sistema
        $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
        if ($currentPath -notlike "*$nssmDir*") {
            [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$nssmDir", "Machine")
            $env:PATH += ";$nssmDir"
        }
        
        Write-Host "  OK: NSSM instalado com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "  ERRO: Falha ao instalar NSSM: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# =============================================================================
# FUNCAO: CONFIGURAR FIREWALL
# =============================================================================
function Configure-Firewall {
    Write-Host "Verificando firewall..." -ForegroundColor Cyan
    
    try {
        $existingRule = Get-NetFirewallRule -DisplayName "OMNI Sistema" -ErrorAction SilentlyContinue
        if ($existingRule) {
            Write-Host "  OK: Regra de firewall ja configurada" -ForegroundColor Green
            return
        }
    } catch {
        # Continua se nao encontrar a regra
    }
    
    Write-Host "  Configurando firewall (porta 8080)..." -ForegroundColor Yellow
    
    try {
        New-NetFirewallRule -DisplayName "OMNI Sistema" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow | Out-Null
        Write-Host "  OK: Firewall configurado!" -ForegroundColor Green
    } catch {
        Write-Host "  AVISO: Nao foi possivel configurar firewall automaticamente" -ForegroundColor Yellow
        Write-Host "     Configure manualmente: porta 8080 TCP" -ForegroundColor Yellow
    }
}

# =============================================================================
# FUNCAO: VERIFICAR ESTRUTURA DE DIRETORIOS
# =============================================================================
function Ensure-Directories {
    Write-Host "Verificando diretorios..." -ForegroundColor Cyan
    
    $deployPath = "C:\Deploy\OMNI"
    $logsPath = "$deployPath\logs"
    
    if (Test-Path $deployPath) {
        Write-Host "  OK: Diretorio C:\Deploy\OMNI ja existe" -ForegroundColor Green
    } else {
        Write-Host "  Criando diretorio C:\Deploy\OMNI..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $deployPath -Force | Out-Null
        Write-Host "  OK: Diretorio criado!" -ForegroundColor Green
    }
    
    if (Test-Path $logsPath) {
        Write-Host "  OK: Diretorio de logs ja existe" -ForegroundColor Green
    } else {
        Write-Host "  Criando diretorio de logs..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $logsPath -Force | Out-Null
        Write-Host "  OK: Diretorio de logs criado!" -ForegroundColor Green
    }
}

# =============================================================================
# FUNCAO: INSTALAR DEPENDENCIAS DO BACKEND
# =============================================================================
function Install-BackendDependencies {
    $backendPath = "C:\Deploy\OMNI\backend"
    
    if (!(Test-Path "$backendPath\package.json")) {
        Write-Host "  AVISO: Backend nao encontrado. Execute o deploy primeiro." -ForegroundColor Yellow
        return
    }
    
    Write-Host "Verificando dependencias do backend..." -ForegroundColor Cyan
    
    if (Test-Path "$backendPath\node_modules") {
        Write-Host "  OK: Dependencias ja instaladas" -ForegroundColor Green
        return
    }
    
    Write-Host "  Instalando dependencias do backend..." -ForegroundColor Yellow
    
    try {
        Push-Location $backendPath
        npm install --production --silent
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  OK: Dependencias instaladas!" -ForegroundColor Green
        } else {
            Write-Host "  AVISO: Erro ao instalar dependencias" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  AVISO: Nao foi possivel instalar dependencias" -ForegroundColor Yellow
    } finally {
        Pop-Location
    }
}

# =============================================================================
# FUNCAO: VERIFICAR E CONFIGURAR SERVICO
# =============================================================================
function Configure-Service {
    Write-Host "Verificando servico Windows..." -ForegroundColor Cyan
    
    try {
        $serviceStatus = nssm status $ServiceName 2>$null
        if ($serviceStatus -eq "SERVICE_RUNNING") {
            Write-Host "  OK: Servico $ServiceName ja esta rodando" -ForegroundColor Green
            return
        } elseif ($serviceStatus -eq "SERVICE_STOPPED") {
            Write-Host "  Servico existe, mas esta parado. Iniciando..." -ForegroundColor Yellow
            nssm start $ServiceName
            Start-Sleep 3
            $newStatus = nssm status $ServiceName
            if ($newStatus -eq "SERVICE_RUNNING") {
                Write-Host "  OK: Servico iniciado com sucesso!" -ForegroundColor Green
                return
            }
        }
    } catch {
        # Servico nao existe
    }
    
    Write-Host "  Instalando servico Windows..." -ForegroundColor Yellow
    
    $backendPath = "C:\Deploy\OMNI\backend"
    $logsPath = "C:\Deploy\OMNI\logs"
    
    if (!(Test-Path "$backendPath\dist\main.js")) {
        Write-Host "  ERRO: Aplicacao nao encontrada em $backendPath\dist\main.js" -ForegroundColor Red
        Write-Host "     Execute o script de deploy primeiro!" -ForegroundColor Yellow
        return
    }
    
    try {
        # Remover servico existente se houver
        nssm remove $ServiceName confirm 2>$null | Out-Null
        
        # Instalar novo servico
        nssm install $ServiceName node "$backendPath\dist\main.js"
        nssm set $ServiceName AppDirectory $backendPath
        nssm set $ServiceName DisplayName "Sistema OMNI"
        nssm set $ServiceName Description "Sistema OMNI - NestJS + Angular"
        nssm set $ServiceName Start SERVICE_AUTO_START
        nssm set $ServiceName AppStdout "$logsPath\omni-stdout.log"
        nssm set $ServiceName AppStderr "$logsPath\omni-stderr.log"
        nssm set $ServiceName AppRotateFiles 1
        nssm set $ServiceName AppRotateOnline 1
        nssm set $ServiceName AppRotateBytes 10485760
        
        # Iniciar servico
        nssm start $ServiceName
        Start-Sleep 5
        
        $status = nssm status $ServiceName
        if ($status -eq "SERVICE_RUNNING") {
            Write-Host "  OK: Servico instalado e iniciado com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "  AVISO: Servico instalado, mas com problemas para iniciar" -ForegroundColor Yellow
            Write-Host "     Status: $status" -ForegroundColor Yellow
            Write-Host "     Verifique os logs em: $logsPath" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ERRO: Falha ao configurar servico: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# =============================================================================
# EXECUCAO PRINCIPAL
# =============================================================================

Write-Host "Iniciando verificacao e instalacao automatica..." -ForegroundColor White
Write-Host ""

# 1. Verificar e instalar Node.js
Install-NodeJS

# 2. Verificar e instalar NSSM  
Install-NSSM

# 3. Configurar firewall
Configure-Firewall

# 4. Garantir estrutura de diretorios
Ensure-Directories

# 5. Instalar dependencias do backend (se aplicacao ja foi deployada)
Install-BackendDependencies

# 6. Configurar e iniciar servico Windows
Configure-Service

# =============================================================================
# RESUMO FINAL
# =============================================================================
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  INSTALACAO CONCLUIDA!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Verificar status final
try {
    $serviceStatus = nssm status $ServiceName 2>$null
    if ($serviceStatus -eq "SERVICE_RUNNING") {
        Write-Host "OK: Sistema OMNI esta rodando!" -ForegroundColor Green
        Write-Host "Acesse: http://10.244.4.241:8080" -ForegroundColor Cyan
    } else {
        Write-Host "AVISO: Sistema instalado, mas servico nao esta rodando" -ForegroundColor Yellow
        Write-Host "   Para iniciar: nssm start $ServiceName" -ForegroundColor White
    }
} catch {
    Write-Host "AVISO: Sistema pode nao estar completamente configurado" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "COMANDOS UTEIS:" -ForegroundColor Yellow
Write-Host "   Iniciar:    nssm start $ServiceName" -ForegroundColor White
Write-Host "   Parar:      nssm stop $ServiceName" -ForegroundColor White
Write-Host "   Reiniciar:  nssm restart $ServiceName" -ForegroundColor White
Write-Host "   Status:     nssm status $ServiceName" -ForegroundColor White
Write-Host "   Logs:       C:\Deploy\OMNI\logs\" -ForegroundColor White
Write-Host ""

pause