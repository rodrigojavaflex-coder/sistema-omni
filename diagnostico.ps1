# =============================================================================
# DIAGNOSTICO RAPIDO - SISTEMA OMNI
# Verifica se tudo está configurado corretamente
# =============================================================================

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  DIAGNOSTICO SISTEMA OMNI" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$allOk = $true

# 1. Verificar Node.js
Write-Host "1. Node.js" -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   OK: $nodeVersion instalado" -ForegroundColor Green
} catch {
    Write-Host "   ERRO: Node.js nao encontrado" -ForegroundColor Red
    $allOk = $false
}

# 2. Verificar NSSM
Write-Host "`n2. NSSM" -ForegroundColor Yellow
try {
    $nssmVersion = nssm version
    Write-Host "   OK: NSSM instalado" -ForegroundColor Green
} catch {
    Write-Host "   ERRO: NSSM nao encontrado" -ForegroundColor Red
    $allOk = $false
}

# 3. Verificar serviço backend
Write-Host "`n3. Servico Backend" -ForegroundColor Yellow
try {
    $serviceStatus = nssm status "OMNI-Sistema"
    if ($serviceStatus -eq "SERVICE_RUNNING") {
        Write-Host "   OK: Servico OMNI-Sistema rodando" -ForegroundColor Green
    } else {
        Write-Host "   AVISO: Servico existe mas status: $serviceStatus" -ForegroundColor Yellow
        $allOk = $false
    }
} catch {
    Write-Host "   ERRO: Servico OMNI-Sistema nao encontrado" -ForegroundColor Red
    $allOk = $false
}

# 4. Verificar porta 8080 (backend)
Write-Host "`n4. Backend na porta 8080" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   OK: Backend respondendo na porta 8080" -ForegroundColor Green
} catch {
    Write-Host "   ERRO: Backend nao responde em http://localhost:8080/api" -ForegroundColor Red
    Write-Host "   Detalhes: $($_.Exception.Message)" -ForegroundColor Gray
    $allOk = $false
}

# 5. Verificar IIS
Write-Host "`n5. IIS" -ForegroundColor Yellow
try {
    Import-Module WebAdministration -ErrorAction Stop
    Write-Host "   OK: IIS esta instalado" -ForegroundColor Green
} catch {
    Write-Host "   ERRO: IIS nao esta instalado ou configurado" -ForegroundColor Red
    $allOk = $false
}

# 6. Verificar URL Rewrite Module
Write-Host "`n6. URL Rewrite Module" -ForegroundColor Yellow
if (Test-Path "C:\Windows\System32\inetsrv\rewrite.dll") {
    Write-Host "   OK: URL Rewrite instalado" -ForegroundColor Green
} else {
    Write-Host "   ERRO: URL Rewrite nao instalado" -ForegroundColor Red
    $allOk = $false
}

# 7. Verificar Application Request Routing (ARR)
Write-Host "`n7. Application Request Routing (ARR)" -ForegroundColor Yellow

# Verificar múltiplos caminhos possíveis
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
    Write-Host "   OK: ARR instalado" -ForegroundColor Green
    if ($arrPath -ne "Registrado no IIS") {
        Write-Host "      Localizado em: $arrPath" -ForegroundColor Gray
    }
    
    try {
        $arrEnabled = Get-WebConfigurationProperty -pspath 'MACHINE/WEBROOT/APPHOST' -filter "system.webServer/proxy" -name "enabled" -ErrorAction Stop
        if ($arrEnabled.Value) {
            Write-Host "   OK: Proxy habilitado" -ForegroundColor Green
        } else {
            Write-Host "   AVISO: Proxy nao habilitado" -ForegroundColor Yellow
            $allOk = $false
        }
    } catch {
        Write-Host "   AVISO: Nao foi possivel verificar status do proxy" -ForegroundColor Yellow
    }
} else {
    Write-Host "   AVISO: ARR nao instalado (pode causar problemas no proxy)" -ForegroundColor Yellow
}

# 8. Verificar pasta do frontend no IIS
Write-Host "`n8. Arquivos do Frontend" -ForegroundColor Yellow
$iisPath = "C:\inetpub\wwwroot\omni"
if (Test-Path $iisPath) {
    Write-Host "   OK: Pasta $iisPath existe" -ForegroundColor Green
    
    if (Test-Path "$iisPath\index.html") {
        Write-Host "   OK: index.html encontrado" -ForegroundColor Green
    } else {
        Write-Host "   ERRO: index.html nao encontrado" -ForegroundColor Red
        $allOk = $false
    }
    
    if (Test-Path "$iisPath\web.config") {
        Write-Host "   OK: web.config encontrado" -ForegroundColor Green
        
        # Verificar conteúdo do web.config
        $webConfigContent = Get-Content "$iisPath\web.config" -Raw
        if ($webConfigContent -match "localhost:8080") {
            Write-Host "   OK: web.config configurado para proxy na porta 8080" -ForegroundColor Green
        } else {
            Write-Host "   AVISO: web.config pode nao estar configurado corretamente" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ERRO: web.config nao encontrado" -ForegroundColor Red
        $allOk = $false
    }
} else {
    Write-Host "   ERRO: Pasta $iisPath nao existe" -ForegroundColor Red
    $allOk = $false
}

# 9. Verificar aplicação no IIS
Write-Host "`n9. Aplicacao IIS" -ForegroundColor Yellow
try {
    $app = Get-WebApplication -Name "omni" -Site "Default Web Site" -ErrorAction Stop
    if ($app) {
        Write-Host "   OK: Aplicacao 'omni' configurada no IIS" -ForegroundColor Green
    }
} catch {
    Write-Host "   ERRO: Aplicacao 'omni' nao encontrada no IIS" -ForegroundColor Red
    $allOk = $false
}

# 10. Teste de acesso local
Write-Host "`n10. Teste de Acesso Local" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/omni" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   OK: Frontend acessivel em http://localhost/omni" -ForegroundColor Green
    } else {
        Write-Host "   AVISO: Status inesperado: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ERRO: Nao foi possivel acessar http://localhost/omni" -ForegroundColor Red
    Write-Host "   Detalhes: $($_.Exception.Message)" -ForegroundColor Gray
    $allOk = $false
}

# 11. Verificar logs do backend
Write-Host "`n11. Logs do Backend" -ForegroundColor Yellow
$logsPath = "C:\Deploy\OMNI\logs"
if (Test-Path $logsPath) {
    Write-Host "   OK: Pasta de logs existe" -ForegroundColor Green
    
    $stdoutLog = "$logsPath\omni-stdout.log"
    $stderrLog = "$logsPath\omni-stderr.log"
    
    if (Test-Path $stdoutLog) {
        $lastLines = Get-Content $stdoutLog -Tail 5 -ErrorAction SilentlyContinue
        if ($lastLines) {
            Write-Host "   Ultimas linhas do stdout:" -ForegroundColor Gray
            $lastLines | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
        }
    }
    
    if (Test-Path $stderrLog) {
        $errorLines = Get-Content $stderrLog -Tail 5 -ErrorAction SilentlyContinue
        if ($errorLines) {
            Write-Host "   Ultimas linhas do stderr:" -ForegroundColor Gray
            $errorLines | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
        }
    }
} else {
    Write-Host "   AVISO: Pasta de logs nao encontrada" -ForegroundColor Yellow
}

# Resumo final
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
if ($allOk) {
    Write-Host "  DIAGNOSTICO: TUDO OK!" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "O sistema deve estar funcionando em:" -ForegroundColor Green
    Write-Host "  Frontend: http://gestaodetransporte.com/omni" -ForegroundColor Cyan
    Write-Host "  API:      http://gestaodetransporte.com/api" -ForegroundColor Cyan
} else {
    Write-Host "  DIAGNOSTICO: PROBLEMAS ENCONTRADOS" -ForegroundColor Red
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Revise os erros acima e execute novamente:" -ForegroundColor Yellow
    Write-Host "  .\install-omni.ps1" -ForegroundColor White
}
Write-Host ""

pause
