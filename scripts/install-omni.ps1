# =============================================================================
# INSTALACAO COMPLETA SISTEMA OMNI
# Script que detecta e instala apenas o que esta faltando
# =============================================================================

param(
    [string]$ServiceName = "OMNI-Sistema",
    [string]$Domain = "gestaodetransporte.com"
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
    
    # Verificar se NSSM ja esta no PATH
    try {
        $nssmCheck = nssm version 2>$null
        if ($nssmCheck) {
            Write-Host "  OK: NSSM ja instalado (versao detectada)" -ForegroundColor Green
            return
        }
    } catch {
        # NSSM nao esta no PATH, continuar verificacao
    }
    
    # Verificar se NSSM existe em C:\nssm mas nao esta no PATH
    $nssmDir = "C:\nssm"
    $nssmExe = "$nssmDir\nssm.exe"
    
    if (Test-Path $nssmExe) {
        Write-Host "  INFO: NSSM encontrado em $nssmDir (adicionando ao PATH)" -ForegroundColor Yellow
        
        try {
            # Adicionar ao PATH da sessao atual
            $env:PATH += ";$nssmDir"
            
            # Adicionar ao PATH do sistema (permanente)
            $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
            if ($currentPath -notlike "*$nssmDir*") {
                [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$nssmDir", "Machine")
                Write-Host "  OK: NSSM adicionado ao PATH do sistema" -ForegroundColor Green
            }
            
            # Verificar se agora funciona
            $nssmTest = & $nssmExe version 2>$null
            if ($nssmTest) {
                Write-Host "  OK: NSSM configurado e funcionando!" -ForegroundColor Green
                return
            }
        } catch {
            Write-Host "  AVISO: Erro ao configurar PATH, mas NSSM existe em $nssmDir" -ForegroundColor Yellow
            return
        }
    }
    
    # Se chegou aqui, precisa instalar o NSSM
    Write-Host "  Instalando NSSM..." -ForegroundColor Yellow
    
    $nssmUrl = "https://nssm.cc/release/nssm-2.24.zip"
    $nssmZip = "$env:TEMP\nssm.zip"
    
    try {
        # Download
        Write-Host "  Baixando NSSM..." -ForegroundColor Gray
        Invoke-WebRequest -Uri $nssmUrl -OutFile $nssmZip -UseBasicParsing
        
        # Se diretorio existe mas nao tem nssm.exe, criar backup e limpar
        if (Test-Path $nssmDir) {
            $backupDir = "$nssmDir`_backup_$(Get-Date -Format 'yyyyMMddHHmmss')"
            Write-Host "  INFO: Criando backup de $nssmDir para $backupDir" -ForegroundColor Gray
            try {
                Move-Item $nssmDir $backupDir -Force -ErrorAction Stop
            } catch {
                Write-Host "  AVISO: Nao foi possivel mover diretorio existente, tentando limpar..." -ForegroundColor Yellow
                try {
                    Get-ChildItem $nssmDir -Recurse | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
                } catch {
                    # Se ainda assim falhar, usar diretorio alternativo
                    $nssmDir = "C:\nssm_new"
                    Write-Host "  INFO: Usando diretorio alternativo: $nssmDir" -ForegroundColor Yellow
                }
            }
        }
        
        # Extrair
        Write-Host "  Extraindo NSSM..." -ForegroundColor Gray
        Expand-Archive -Path $nssmZip -DestinationPath $nssmDir -Force
        
        # Mover arquivos da subpasta para a raiz
        $nssmSubDir = Get-ChildItem $nssmDir -Directory | Select-Object -First 1
        $nssmBin = Join-Path $nssmSubDir.FullName "win64"
        
        Copy-Item "$nssmBin\*" $nssmDir -Force
        
        # Limpar arquivos temporarios
        try {
            Remove-Item $nssmSubDir.FullName -Recurse -Force -ErrorAction SilentlyContinue
            Remove-Item $nssmZip -Force -ErrorAction SilentlyContinue
        } catch {
            # Ignorar erros de limpeza
        }
        
        # Adicionar ao PATH
        $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
        if ($currentPath -notlike "*$nssmDir*") {
            [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$nssmDir", "Machine")
            $env:PATH += ";$nssmDir"
        }
        
        Write-Host "  OK: NSSM instalado com sucesso em $nssmDir!" -ForegroundColor Green
    } catch {
        Write-Host "  ERRO: Falha ao instalar NSSM: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "  Tente instalar manualmente de: https://nssm.cc/download" -ForegroundColor Yellow
        exit 1
    }
}

# =============================================================================
# FUNCAO: CONFIGURAR FIREWALL
# =============================================================================
function Set-Firewall {
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
    
    Write-Host "  Configurando firewall (porta 80)..." -ForegroundColor Yellow
    
    try {
        New-NetFirewallRule -DisplayName "OMNI Sistema" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow | Out-Null
        Write-Host "  OK: Firewall configurado!" -ForegroundColor Green
    } catch {
        Write-Host "  AVISO: Nao foi possivel configurar firewall automaticamente" -ForegroundColor Yellow
        Write-Host "     Configure manualmente: porta 80 TCP" -ForegroundColor Yellow
    }
}

# =============================================================================
# FUNCAO: CONFIGURAR IIS PARA OMNI
# =============================================================================
function Configure-IIS {
    Write-Host "Configurando IIS para OMNI..." -ForegroundColor Cyan
    
    # Verificar se IIS está instalado
    $iisInstalled = Get-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole
    if ($iisInstalled.State -ne "Enabled") {
        Write-Host "  ERRO: IIS nao esta instalado. Instale primeiro via Server Manager." -ForegroundColor Red
        return
    }
    
    # Verificar e instalar URL Rewrite
    Write-Host "  Verificando URL Rewrite..." -ForegroundColor Yellow
    
    # Verificar se já está instalado
    $urlRewriteInstalled = Test-Path "C:\Windows\System32\inetsrv\rewrite.dll"
    if ($urlRewriteInstalled) {
        Write-Host "  OK: URL Rewrite ja instalado" -ForegroundColor Green
    } else {
        Write-Host "  Instalando URL Rewrite..." -ForegroundColor Yellow
        
        try {
            # URL do URL Rewrite Module
            $urlRewriteUrl = "https://download.microsoft.com/download/1/2/8/128E2E22-C1B9-44A4-BE2A-5859ED1D4592/rewrite_amd64.msi"
            $installerPath = "$env:TEMP\rewrite_amd64.msi"
            
            # Baixar
            Invoke-WebRequest -Uri $urlRewriteUrl -OutFile $installerPath -UseBasicParsing
            
            # Instalar silenciosamente
            Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait
            
            # Limpar
            Remove-Item $installerPath -Force
            
            # Verificar instalação
            $urlRewriteInstalled = Test-Path "C:\Windows\System32\inetsrv\rewrite.dll"
            if ($urlRewriteInstalled) {
                Write-Host "  OK: URL Rewrite instalado com sucesso!" -ForegroundColor Green
                
                # Reiniciar IIS para carregar o módulo
                Write-Host "  Reiniciando IIS..." -ForegroundColor Yellow
                iisreset /restart | Out-Null
                Start-Sleep -Seconds 5
                Write-Host "  OK: IIS reiniciado!" -ForegroundColor Green
            } else {
                Write-Host "  ERRO: Falha na instalacao do URL Rewrite" -ForegroundColor Red
                return
            }
        } catch {
            Write-Host "  ERRO: Falha ao instalar URL Rewrite: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "  Baixe manualmente de: https://www.iis.net/downloads/microsoft/url-rewrite" -ForegroundColor Yellow
            return
        }
    }
    
    # Habilitar proxy no Application Request Routing (ARR)
    Write-Host "  Verificando Application Request Routing (ARR)..." -ForegroundColor Yellow
    
    try {
        # Verificar se ARR está instalado (múltiplos caminhos possíveis)
        $arrPaths = @(
            "C:\Windows\System32\inetsrv\proxymodule.dll",
            "C:\Program Files\IIS\Application Request Routing\proxymodule.dll",
            "$env:SystemRoot\System32\inetsrv\proxymodule.dll"
        )
        
        $arrInstalled = $false
        $arrPath = $null
        
        foreach ($path in $arrPaths) {
            if (Test-Path $path) {
                $arrInstalled = $true
                $arrPath = $path
                break
            }
        }
        
        # Também verificar se o módulo está registrado no IIS
        if (-not $arrInstalled) {
            $proxyModule = Get-WebGlobalModule -Name "ApplicationRequestRouting" -ErrorAction SilentlyContinue
            if ($proxyModule) {
                $arrInstalled = $true
                $arrPath = "Registrado no IIS"
            }
        }
        
        if ($arrInstalled) {
            Write-Host "  OK: ARR ja instalado" -ForegroundColor Green
            if ($arrPath -ne "Registrado no IIS") {
                Write-Host "     Localizado em: $arrPath" -ForegroundColor Gray
            }
            
            # Habilitar proxy
            $arrConfig = Get-WebConfigurationProperty -pspath 'MACHINE/WEBROOT/APPHOST' -filter "system.webServer/proxy" -name "enabled" -ErrorAction SilentlyContinue
            if ($arrConfig) {
                if ($arrConfig.Value -eq $false) {
                    Write-Host "  Habilitando proxy no ARR..." -ForegroundColor Yellow
                    Set-WebConfigurationProperty -pspath 'MACHINE/WEBROOT/APPHOST' -filter "system.webServer/proxy" -name "enabled" -value "True"
                    Write-Host "  OK: Proxy habilitado!" -ForegroundColor Green
                } else {
                    Write-Host "  OK: Proxy ja esta habilitado" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "  AVISO: ARR nao instalado. O proxy pode nao funcionar corretamente." -ForegroundColor Yellow
            Write-Host "  Baixe e instale ARR de: https://www.iis.net/downloads/microsoft/application-request-routing" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  AVISO: Nao foi possivel verificar ARR: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # Criar pool de aplicacoes (verificar se ja existe)
    $appPoolExists = Get-IISAppPool -Name "OMNI-AppPool" -ErrorAction SilentlyContinue
    if ($appPoolExists) {
        Write-Host "  OK: Pool de aplicacoes OMNI-AppPool ja existe" -ForegroundColor Green
    } else {
        Write-Host "  Criando pool de aplicacoes OMNI-AppPool..." -ForegroundColor Yellow
        New-WebAppPool -Name "OMNI-AppPool" -Force | Out-Null
        Write-Host "  OK: Pool de aplicacoes criado!" -ForegroundColor Green
    }
    
    # Caminho do frontend
    $iisPath = "C:\inetpub\wwwroot\omni"
    $frontendSourcePath = "C:\Deploy\ArquivosFrontend"
    
    # Copiar arquivos do frontend para IIS se necessário
    if (Test-Path $frontendSourcePath) {
        Write-Host "  Copiando arquivos do frontend para IIS..." -ForegroundColor Yellow
        
        if (!(Test-Path $iisPath)) {
            New-Item -ItemType Directory -Path $iisPath -Force | Out-Null
        }
        
        # Copiar todos os arquivos
        Copy-Item "$frontendSourcePath\*" $iisPath -Recurse -Force
        Write-Host "  OK: Arquivos copiados para $iisPath" -ForegroundColor Green
    }
    
    # Verificar se o diretorio existe
    if (!(Test-Path $iisPath)) {
        Write-Host "  ERRO: Pasta do frontend nao encontrada em $iisPath" -ForegroundColor Red
        Write-Host "  Execute o deploy primeiro: .\deploy.ps1" -ForegroundColor Yellow
        return
    }
    
    # Verificar se index.html existe
    if (!(Test-Path "$iisPath\index.html")) {
        Write-Host "  ERRO: index.html nao encontrado em $iisPath" -ForegroundColor Red
        Write-Host "  Execute o deploy primeiro: .\deploy.ps1" -ForegroundColor Yellow
        return
    }
    
    Write-Host "  OK: Arquivos do frontend encontrados" -ForegroundColor Green
    
    Write-Host "  OK: Arquivos do frontend encontrados" -ForegroundColor Green
    
    # Adicionar como aplicacao no site padrao (verificar se ja existe)
    $siteName = "Default Web Site"
    $appExists = Get-WebApplication -Name "omni" -Site $siteName -ErrorAction SilentlyContinue
    if ($appExists) {
        Write-Host "  OK: Aplicacao 'omni' ja existe no site padrao" -ForegroundColor Green
    } else {
        Write-Host "  Criando aplicacao 'omni' no site padrao..." -ForegroundColor Yellow
        New-WebApplication -Name "omni" -Site $siteName -PhysicalPath $iisPath -ApplicationPool "OMNI-AppPool" -Force | Out-Null
        Write-Host "  OK: Aplicacao criada!" -ForegroundColor Green
    }
    
    # Adicionar binding para o dominio (verificar se ja existe)
    $bindingExists = Get-WebBinding -Name $siteName -IPAddress "*" -Port 80 -HostHeader "gestaodetransporte.com" -ErrorAction SilentlyContinue
    if ($bindingExists) {
        Write-Host "  OK: Binding para gestaodetransporte.com ja existe" -ForegroundColor Green
    } else {
        Write-Host "  Adicionando binding para gestaodetransporte.com..." -ForegroundColor Yellow
        New-WebBinding -Name $siteName -IPAddress "*" -Port 80 -HostHeader "gestaodetransporte.com" -Force | Out-Null
        Write-Host "  OK: Binding adicionado!" -ForegroundColor Green
    }
    
    # Criar web.config para proxy reverso e arquivos estaticos (SEMPRE sobrescrever)
    Write-Host "  Criando web.config com proxy reverso..." -ForegroundColor Yellow
    
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
        <staticContent>
            <remove fileExtension=".json" />
            <mimeMap fileExtension=".json" mimeType="application/json" />
            <remove fileExtension=".woff" />
            <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
            <remove fileExtension=".woff2" />
            <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
        </staticContent>
    </system.webServer>
</configuration>
"@
    
    try {
        $webConfig | Out-File -FilePath "$iisPath\web.config" -Encoding UTF8 -Force
        Write-Host "  OK: web.config da aplicacao criado com sucesso!" -ForegroundColor Green
        
        # Verificar se foi criado
        if (Test-Path "$iisPath\web.config") {
            Write-Host "  OK: web.config confirmado no disco" -ForegroundColor Green
        } else {
            Write-Host "  ERRO: web.config nao foi criado!" -ForegroundColor Red
            return
        }
    } catch {
        Write-Host "  ERRO: Falha ao criar web.config: $($_.Exception.Message)" -ForegroundColor Red
        return
    }
    
    # =========================================================================
    # CRITICAL: Criar web.config na RAIZ do IIS para capturar /api/* GLOBAL
    # =========================================================================
    Write-Host "  Criando web.config GLOBAL na raiz do IIS..." -ForegroundColor Yellow
    
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
        $rootIisPath = "C:\inetpub\wwwroot"
        $rootWebConfig | Out-File -FilePath "$rootIisPath\web.config" -Encoding UTF8 -Force
        Write-Host "  OK: web.config GLOBAL criado em $rootIisPath!" -ForegroundColor Green
        Write-Host "  -> Captura /api/* ANTES da aplicacao /omni/" -ForegroundColor Gray
    } catch {
        Write-Host "  AVISO: Falha ao criar web.config global: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "  O proxy ainda funcionara via /omni/api/*" -ForegroundColor Yellow
    }
    
    Write-Host "  IIS configurado com sucesso!" -ForegroundColor Green
    Write-Host "  Aplicacao: http://gestaodetransporte.com/omni" -ForegroundColor Cyan
    
    # Teste final de acesso
    Write-Host "  Testando acesso local..." -ForegroundColor Yellow
    try {
        $testResponse = Invoke-WebRequest -Uri "http://localhost/omni/" -UseBasicParsing -TimeoutSec 10 -ErrorAction SilentlyContinue
        if ($testResponse.StatusCode -eq 200) {
            Write-Host "  OK: Acesso local funcionando!" -ForegroundColor Green
        } else {
            Write-Host "  AVISO: Status inesperado: $($testResponse.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  AVISO: Teste local falhou: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "     Isso pode ser normal se o dominio nao estiver configurado localmente" -ForegroundColor White
    }
}

# =============================================================================
# FUNCAO: COPIAR ARQUIVOS DO BACKEND
# =============================================================================
function Copy-BackendFiles {
    Write-Host "Copiando arquivos do backend..." -ForegroundColor Cyan
    
    $sourceBackend = "$PSScriptRoot\ArquivosBackend"
    $deployPath = "C:\Deploy\OMNI"
    
    if (!(Test-Path $sourceBackend)) {
        Write-Host "  ERRO: Pasta ArquivosBackend nao encontrada em $PSScriptRoot" -ForegroundColor Red
        exit 1
    }
    
    # Criar diretorio de destino
    if (!(Test-Path $deployPath)) {
        Write-Host "  Criando diretorio C:\Deploy\OMNI..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $deployPath -Force | Out-Null
    }
    
    # Criar diretorio de logs
    $logsPath = "$deployPath\logs"
    if (!(Test-Path $logsPath)) {
        Write-Host "  Criando diretorio de logs..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $logsPath -Force | Out-Null
    }
    
    # Verificar se .env ja existe no destino
    $envExists = Test-Path "$deployPath\.env"
    
    # Copiar arquivos do backend (excluindo .env se ja existir)
    Write-Host "  Copiando arquivos do backend..." -ForegroundColor Yellow
    Get-ChildItem "$sourceBackend" | Where-Object { 
        # Excluir .env se ja existe no destino
        if ($envExists -and $_.Name -eq ".env") {
            Write-Host "  INFO: .env ja existe, preservando configuracao atual" -ForegroundColor Yellow
            return $false
        }
        return $true
    } | ForEach-Object {
        Copy-Item $_.FullName "$deployPath\$($_.Name)" -Recurse -Force
    }
    
    # Se .env nao existe, copiar do template
    if (-not $envExists) {
        if (Test-Path "$sourceBackend\.env") {
            Copy-Item "$sourceBackend\.env" "$deployPath\.env" -Force
            Write-Host "  OK: .env copiado (primeira instalacao)" -ForegroundColor Green
        }
    }
    
    Write-Host "  OK: Backend copiado para C:\Deploy\OMNI" -ForegroundColor Green
}

# =============================================================================
# FUNCAO: COPIAR ARQUIVOS DO FRONTEND
# =============================================================================
function Copy-FrontendFiles {
    Write-Host "Copiando arquivos do frontend..." -ForegroundColor Cyan
    
    $sourceFrontend = "$PSScriptRoot\ArquivosFrontend"
    $iisPath = "C:\inetpub\wwwroot\omni"
    
    if (!(Test-Path $sourceFrontend)) {
        Write-Host "  ERRO: Pasta ArquivosFrontend nao encontrada em $PSScriptRoot" -ForegroundColor Red
        exit 1
    }
    
    # Criar diretorio do IIS
    if (!(Test-Path $iisPath)) {
        Write-Host "  Criando diretorio C:\inetpub\wwwroot\omni..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $iisPath -Force | Out-Null
    }
    
    # Copiar arquivos do frontend
    Write-Host "  Copiando arquivos do frontend..." -ForegroundColor Yellow
    Copy-Item "$sourceFrontend\*" $iisPath -Recurse -Force
    Write-Host "  OK: Frontend copiado para C:\inetpub\wwwroot\omni" -ForegroundColor Green
    
    # Criar web.config para IIS
    $webConfig = @'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <remove fileExtension=".json"/>
      <remove fileExtension=".woff"/>
      <remove fileExtension=".woff2"/>
      <mimeMap fileExtension=".json" mimeType="application/json"/>
      <mimeMap fileExtension=".woff" mimeType="application/font-woff"/>
      <mimeMap fileExtension=".woff2" mimeType="application/font-woff2"/>
    </staticContent>
    <rewrite>
      <rules>
        <!-- Proxy reverso para API -->
        <rule name="API Proxy" stopProcessing="true">
          <match url="^api/(.*)" />
          <action type="Rewrite" url="http://localhost:8080/api/{R:1}" />
        </rule>
        <!-- Angular routing - redirecionar para index.html -->
        <rule name="Angular Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/omni/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
'@
    $webConfig | Out-File -FilePath "$iisPath\web.config" -Encoding UTF8
    Write-Host "  OK: web.config criado" -ForegroundColor Green
}

# =============================================================================
# FUNCAO: VERIFICAR ESTRUTURA DE DIRETORIOS (SIMPLIFICADA)
# =============================================================================
function Initialize-Directories {
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
    $backendPath = "C:\Deploy\OMNI"
    
    if (!(Test-Path "$backendPath\package.json")) {
        Write-Host "  ERRO: package.json nao encontrado em C:\Deploy\OMNI" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Instalando dependencias do backend..." -ForegroundColor Cyan
    
    Write-Host "  Executando npm install..." -ForegroundColor Yellow
    
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
function Set-OMNIService {
    Write-Host "Verificando servico Windows..." -ForegroundColor Cyan
    
    try {
        $serviceStatus = nssm status $ServiceName 2>$null
        
        if ($serviceStatus -eq "SERVICE_RUNNING") {
            Write-Host "  INFO: Servico $ServiceName ja esta rodando" -ForegroundColor Yellow
            Write-Host "" 
            Write-Host "  Opcoes:" -ForegroundColor Cyan
            Write-Host "    1. Manter rodando (pular reinstalacao do servico)" -ForegroundColor White
            Write-Host "    2. Parar, reinstalar e reiniciar (recomendado para atualizacoes)" -ForegroundColor White
            Write-Host ""
            
            $choice = Read-Host "  Escolha (1 ou 2)"
            
            if ($choice -eq "2") {
                Write-Host "  Parando servico..." -ForegroundColor Yellow
                nssm stop $ServiceName
                Start-Sleep 3
                
                $stoppedStatus = nssm status $ServiceName
                if ($stoppedStatus -eq "SERVICE_STOPPED") {
                    Write-Host "  OK: Servico parado com sucesso!" -ForegroundColor Green
                    Write-Host "  Removendo servico existente para reinstalar..." -ForegroundColor Yellow
                    nssm remove $ServiceName confirm 2>$null | Out-Null
                    Start-Sleep 2
                } else {
                    Write-Host "  ERRO: Nao foi possivel parar o servico (Status: $stoppedStatus)" -ForegroundColor Red
                    Write-Host "  Execute manualmente: nssm stop $ServiceName" -ForegroundColor Yellow
                    return
                }
            } else {
                Write-Host "  OK: Mantendo servico rodando. Pulando reinstalacao." -ForegroundColor Green
                return
            }
        } elseif ($serviceStatus -eq "SERVICE_STOPPED" -or $serviceStatus -eq "SERVICE_PAUSED") {
            Write-Host "  INFO: Servico existe mas nao esta rodando (Status: $serviceStatus)" -ForegroundColor Yellow
            Write-Host "  Removendo servico existente para reinstalar..." -ForegroundColor Yellow
            nssm remove $ServiceName confirm 2>$null | Out-Null
            Start-Sleep 2
        }
    } catch {
        # Servico nao existe, pode instalar normalmente
    }
    
    Write-Host "  Instalando servico Windows..." -ForegroundColor Yellow
    
    $backendPath = "C:\Deploy\OMNI"
    $logsPath = "C:\Deploy\OMNI\logs"
    
    if (!(Test-Path "$backendPath\dist\main.js")) {
        Write-Host "  ERRO: Aplicacao nao encontrada em $backendPath\dist\main.js" -ForegroundColor Red
        Write-Host "     Execute o script de deploy primeiro!" -ForegroundColor Yellow
        return
    }
    
    try {
        # Instalar novo servico
        nssm install $ServiceName node "$backendPath\dist\main.js"
        nssm set $ServiceName AppDirectory $backendPath
        nssm set $ServiceName AppEnvironmentExtra NODE_ENV=production
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
Set-Firewall

# 4. Configurar IIS para OMNI
Configure-IIS

# 5. Copiar arquivos do backend
Copy-BackendFiles

# 6. Copiar arquivos do frontend
Copy-FrontendFiles

# 7. Garantir estrutura de diretorios
Initialize-Directories

# 8. Instalar dependencias do backend
Install-BackendDependencies

# 9. Configurar e iniciar servico Windows
Set-OMNIService

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
        Write-Host "Acesse: http://gestaodetransporte.com/omni" -ForegroundColor Cyan
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
