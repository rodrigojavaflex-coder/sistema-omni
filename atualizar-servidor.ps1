# =============================================================================
# SCRIPT DE ATUALIZACAO RAPIDA - SISTEMA OMNI
# Para atualizacoes de codigo (frontend/backend) sem reinstalar dependencias
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
Write-Host "  ATUALIZACAO RAPIDA - SISTEMA OMNI" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

$sourceBackend = "$PSScriptRoot\ArquivosBackend"
$sourceFrontend = "$PSScriptRoot\ArquivosFrontend"
$backendPath = "C:\Deploy\OMNI"
$frontendPath = "C:\inetpub\wwwroot\omni"

# =============================================================================
# 1. VERIFICAR SE ARQUIVOS DE ORIGEM EXISTEM
# =============================================================================
Write-Host "1. Verificando arquivos de origem..." -ForegroundColor Cyan

if (!(Test-Path $sourceBackend)) {
    Write-Host "  ERRO: Pasta ArquivosBackend nao encontrada em $PSScriptRoot" -ForegroundColor Red
    Write-Host "  Execute o deploy.ps1 primeiro!" -ForegroundColor Yellow
    exit 1
}

if (!(Test-Path $sourceFrontend)) {
    Write-Host "  ERRO: Pasta ArquivosFrontend nao encontrada em $PSScriptRoot" -ForegroundColor Red
    Write-Host "  Execute o deploy.ps1 primeiro!" -ForegroundColor Yellow
    exit 1
}

Write-Host "  OK: Arquivos de origem encontrados" -ForegroundColor Green

# =============================================================================
# 2. VERIFICAR SE SISTEMA JA ESTA INSTALADO
# =============================================================================
Write-Host "`n2. Verificando instalacao existente..." -ForegroundColor Cyan

if (!(Test-Path $backendPath)) {
    Write-Host "  ERRO: Backend nao encontrado em $backendPath" -ForegroundColor Red
    Write-Host "  Execute install-omni.ps1 primeiro para instalacao inicial!" -ForegroundColor Yellow
    exit 1
}

if (!(Test-Path $frontendPath)) {
    Write-Host "  ERRO: Frontend nao encontrado em $frontendPath" -ForegroundColor Red
    Write-Host "  Execute install-omni.ps1 primeiro para instalacao inicial!" -ForegroundColor Yellow
    exit 1
}

try {
    $serviceStatus = nssm status $ServiceName 2>$null
    if (!$serviceStatus) {
        Write-Host "  ERRO: Servico $ServiceName nao encontrado" -ForegroundColor Red
        Write-Host "  Execute install-omni.ps1 primeiro para instalacao inicial!" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "  OK: Sistema instalado e servico encontrado (Status: $serviceStatus)" -ForegroundColor Green
} catch {
    Write-Host "  ERRO: NSSM nao encontrado ou servico nao configurado" -ForegroundColor Red
    Write-Host "  Execute install-omni.ps1 primeiro para instalacao inicial!" -ForegroundColor Yellow
    exit 1
}

# =============================================================================
# 3. PARAR SERVICO
# =============================================================================
Write-Host "`n3. Parando servico..." -ForegroundColor Cyan

try {
    $currentStatus = nssm status $ServiceName
    if ($currentStatus -eq "SERVICE_RUNNING") {
        Write-Host "  Parando servico $ServiceName..." -ForegroundColor Yellow
        nssm stop $ServiceName
        Start-Sleep 3
        
        $stoppedStatus = nssm status $ServiceName
        if ($stoppedStatus -eq "SERVICE_STOPPED") {
            Write-Host "  OK: Servico parado com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "  AVISO: Servico pode nao ter parado completamente (Status: $stoppedStatus)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  INFO: Servico ja estava parado (Status: $currentStatus)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ERRO: Falha ao parar servico: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# =============================================================================
# 4. ATUALIZAR BACKEND
# =============================================================================
Write-Host "`n4. Atualizando backend..." -ForegroundColor Cyan

# Verificar se .env existe no destino
$envExists = Test-Path "$backendPath\.env"
if ($envExists) {
    Write-Host "  INFO: .env existente sera preservado" -ForegroundColor Yellow
}

Write-Host "  Copiando arquivos do backend..." -ForegroundColor Yellow
Get-ChildItem "$sourceBackend" | Where-Object { 
    # Sempre excluir .env nas atualizacoes para nao sobrescrever
    if ($_.Name -eq ".env") {
        return $false
    }
    return $true
} | ForEach-Object {
    Copy-Item $_.FullName "$backendPath\$($_.Name)" -Recurse -Force
}

if (-not $envExists) {
    Write-Host "  AVISO: .env nao encontrado no servidor!" -ForegroundColor Red
    Write-Host "  Copie manualmente de ArquivosBackend\.env e configure!" -ForegroundColor Yellow
}

Write-Host "  OK: Backend atualizado (.env preservado)!" -ForegroundColor Green

# =============================================================================
# 5. ATUALIZAR FRONTEND
# =============================================================================
Write-Host "`n5. Atualizando frontend..." -ForegroundColor Cyan

Write-Host "  Copiando arquivos do frontend..." -ForegroundColor Yellow
Copy-Item "$sourceFrontend\*" $frontendPath -Recurse -Force
Write-Host "  OK: Frontend atualizado!" -ForegroundColor Green

# =============================================================================
# 6. INSTALAR/ATUALIZAR DEPENDENCIAS (se package.json mudou)
# =============================================================================
Write-Host "`n6. Verificando dependencias..." -ForegroundColor Cyan

# Verificar se package.json mudou
$needsInstall = $false

if (Test-Path "$backendPath\package-lock.json") {
    Write-Host "  Comparando package-lock.json..." -ForegroundColor Yellow
    
    $sourceHash = (Get-FileHash "$sourceBackend\package-lock.json" -Algorithm MD5).Hash
    $destHash = (Get-FileHash "$backendPath\package-lock.json" -Algorithm MD5).Hash
    
    if ($sourceHash -ne $destHash) {
        $needsInstall = $true
        Write-Host "  INFO: package-lock.json alterado, dependencias serao atualizadas" -ForegroundColor Yellow
    } else {
        Write-Host "  OK: Dependencias estao atualizadas" -ForegroundColor Green
    }
} else {
    # Primeira vez ou sem package-lock
    $needsInstall = $true
    Write-Host "  INFO: package-lock.json nao encontrado, instalando dependencias" -ForegroundColor Yellow
}

if ($needsInstall) {
    Write-Host "  Executando npm install --production..." -ForegroundColor Yellow
    try {
        Push-Location $backendPath
        npm install --production --silent
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  OK: Dependencias instaladas com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "  AVISO: Erro ao instalar dependencias (codigo: $LASTEXITCODE)" -ForegroundColor Yellow
            Write-Host "  Execute manualmente: cd C:\Deploy\OMNI && npm install --production" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ERRO: Falha ao instalar dependencias: $($_.Exception.Message)" -ForegroundColor Red
    } finally {
        Pop-Location
    }
} else {
    Write-Host "  OK: Pulando instalacao (dependencias ja atualizadas)" -ForegroundColor Green
}

# =============================================================================
# 6. ATUALIZAR WEB.CONFIG (SE NECESSARIO)
# =============================================================================
Write-Host "`n6. Verificando configuracao do IIS (web.config)..." -ForegroundColor Cyan

$webConfigPath = "$frontendPath\web.config"

if (Test-Path $webConfigPath) {
    $currentWebConfig = Get-Content $webConfigPath -Raw
    
    # Verificar se possui as duas regras de proxy (dual proxy)
    $hasOmniApiProxy = $currentWebConfig -match 'name="API Proxy with omni prefix"'
    $hasDirectApiProxy = $currentWebConfig -match 'name="API Proxy direct"'
    
    if (-not ($hasOmniApiProxy -and $hasDirectApiProxy)) {
        Write-Host "  Web.config desatualizado! Aplicando dual proxy..." -ForegroundColor Yellow
        
        $webConfig = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <!-- MIME Types para arquivos estaticos -->
        <staticContent>
            <remove fileExtension=".json"/>
            <remove fileExtension=".woff"/>
            <remove fileExtension=".woff2"/>
            <mimeMap fileExtension=".json" mimeType="application/json"/>
            <mimeMap fileExtension=".woff" mimeType="application/font-woff"/>
            <mimeMap fileExtension=".woff2" mimeType="application/font-woff2"/>
        </staticContent>

        <!-- URL Rewrite Rules -->
        <rewrite>
            <rules>
                <!-- PROXY REVERSO 1: /omni/api/* -> localhost:8080/api/* -->
                <rule name="API Proxy with omni prefix" stopProcessing="true">
                    <match url="^omni/api/(.*)" />
                    <action type="Rewrite" url="http://localhost:8080/api/{R:1}" />
                </rule>

                <!-- PROXY REVERSO 2: /api/* -> localhost:8080/api/* (DIRETO - SEM /omni/) -->
                <rule name="API Proxy direct" stopProcessing="true">
                    <match url="^api/(.*)" />
                    <action type="Rewrite" url="http://localhost:8080/api/{R:1}" />
                </rule>

                <!-- ANGULAR ROUTING: Redirecionar para index.html -->
                <rule name="Angular Routes" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                        <!-- Nao aplicar a requisicoes da API (com ou sem /omni/) -->
                        <add input="{REQUEST_URI}" pattern="^/(omni/)?api" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/omni/index.html" />
                </rule>
            </rules>
        </rewrite>

        <!-- Headers para seguranca -->
        <httpProtocol>
            <customHeaders>
                <add name="X-Content-Type-Options" value="nosniff" />
            </customHeaders>
        </httpProtocol>

        <defaultDocument>
            <files>
                <clear />
                <add value="index.html" />
            </files>
        </defaultDocument>
    </system.webServer>
</configuration>
"@
        
        $webConfig | Out-File -FilePath $webConfigPath -Encoding UTF8 -Force
        Write-Host "  OK: Web.config atualizado com dual proxy!" -ForegroundColor Green
        Write-Host "  -> Suporta: /api/* e /omni/api/*" -ForegroundColor Gray
    } else {
        Write-Host "  OK: Web.config ja esta atualizado (dual proxy configurado)" -ForegroundColor Green
    }
} else {
    Write-Host "  AVISO: web.config nao encontrado em $webConfigPath" -ForegroundColor Yellow
    Write-Host "  Execute install-omni.ps1 para criar a configuracao inicial" -ForegroundColor Yellow
}

# Verificar e atualizar web.config GLOBAL na raiz do IIS
Write-Host "  Verificando web.config GLOBAL (raiz do IIS)..." -ForegroundColor Yellow

$rootIisPath = "C:\inetpub\wwwroot"
$rootWebConfigPath = "$rootIisPath\web.config"

if (Test-Path $rootWebConfigPath) {
    $currentRootConfig = Get-Content $rootWebConfigPath -Raw
    
    # Verificar se possui a regra global de proxy
    $hasGlobalProxy = $currentRootConfig -match 'name="Global API Proxy"'
    
    if (-not $hasGlobalProxy) {
        Write-Host "  Web.config global desatualizado! Criando regra de proxy..." -ForegroundColor Yellow
        
        $rootWebConfig = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <!-- PROXY GLOBAL: /api/* -> localhost:8080/api/* -->
                <rule name="Global API Proxy" stopProcessing="true">
                    <match url="^api/(.*)" />
                    <action type="Rewrite" url="http://localhost:8080/api/{R:1}" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
"@
        
        $rootWebConfig | Out-File -FilePath $rootWebConfigPath -Encoding UTF8 -Force
        Write-Host "  OK: Web.config GLOBAL atualizado!" -ForegroundColor Green
        Write-Host "  -> /api/* agora sera proxiado para backend" -ForegroundColor Gray
    } else {
        Write-Host "  OK: Web.config global ja configurado" -ForegroundColor Green
    }
} else {
    Write-Host "  INFO: Criando web.config GLOBAL na raiz do IIS..." -ForegroundColor Yellow
    
    $rootWebConfig = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <!-- PROXY GLOBAL: /api/* -> localhost:8080/api/* -->
                <rule name="Global API Proxy" stopProcessing="true">
                    <match url="^api/(.*)" />
                    <action type="Rewrite" url="http://localhost:8080/api/{R:1}" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
"@
    
    try {
        $rootWebConfig | Out-File -FilePath $rootWebConfigPath -Encoding UTF8 -Force
        Write-Host "  OK: Web.config GLOBAL criado em $rootIisPath!" -ForegroundColor Green
    } catch {
        Write-Host "  ERRO: Falha ao criar web.config global: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# =============================================================================
# 7. REINICIAR SERVICO
# =============================================================================
Write-Host "`n7. Reiniciando servico..." -ForegroundColor Cyan

try {
    Write-Host "  Iniciando servico $ServiceName..." -ForegroundColor Yellow
    nssm start $ServiceName
    Start-Sleep 5
    
    $finalStatus = nssm status $ServiceName
    if ($finalStatus -eq "SERVICE_RUNNING") {
        Write-Host "  OK: Servico reiniciado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "  ERRO: Servico nao iniciou corretamente (Status: $finalStatus)" -ForegroundColor Red
        Write-Host "  Verifique os logs em: C:\Deploy\OMNI\logs\" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ERRO: Falha ao reiniciar servico: $($_.Exception.Message)" -ForegroundColor Red
}

# =============================================================================
# 8. VERIFICAR STATUS
# =============================================================================
Write-Host "`n8. Verificando status final..." -ForegroundColor Cyan

Start-Sleep 2

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  OK: Backend respondendo corretamente!" -ForegroundColor Green
} catch {
    Write-Host "  AVISO: Backend nao esta respondendo ainda" -ForegroundColor Yellow
    Write-Host "  Aguarde alguns segundos e verifique os logs" -ForegroundColor Yellow
}

# =============================================================================
# RESUMO
# =============================================================================
Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "  ATUALIZACAO CONCLUIDA!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Comandos uteis:" -ForegroundColor Cyan
Write-Host "  Status do servico: nssm status $ServiceName" -ForegroundColor White
Write-Host "  Ver logs: Get-Content C:\Deploy\OMNI\logs\omni-stderr.log -Tail 50" -ForegroundColor White
Write-Host "  Acessar sistema: http://gestaodetransporte.com/omni" -ForegroundColor White
Write-Host ""
