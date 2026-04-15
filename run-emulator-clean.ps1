param(
  [switch]$ErrorOnly,
  [switch]$NoLog
)

$ErrorActionPreference = 'Stop'

function Invoke-Step {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Title,
    [Parameter(Mandatory = $true)]
    [scriptblock]$Action
  )

  Write-Host ""
  Write-Host "==> $Title" -ForegroundColor Cyan
  & $Action
}

$rootDir = $PSScriptRoot
$mobileDir = Join-Path $rootDir "mobile"
$androidDir = Join-Path $mobileDir "android"
$adbDir = "C:\Users\rodrigo.teixeira\AppData\Local\Android\Sdk\platform-tools"
$adbExe = Join-Path $adbDir "adb.exe"
$packageName = "com.omni.sistema"
$apkPath = Join-Path $androidDir "app\build\outputs\apk\debug\app-debug.apk"

Invoke-Step -Title "Build e sync (mobile)" -Action {
  Set-Location $mobileDir
  npm run build
  npx cap sync android
}

Invoke-Step -Title "Clean e assembleDebug (android)" -Action {
  Set-Location $androidDir
  .\gradlew --stop
  .\gradlew clean --no-daemon
  .\gradlew assembleDebug --no-daemon
}

Invoke-Step -Title "Configurar adb na sessao (se necessario)" -Action {
  if (-not (Test-Path $adbExe)) {
    throw "adb.exe nao encontrado em: $adbExe"
  }

  if ($env:Path -notlike "*$adbDir*") {
    $env:Path += ";$adbDir"
  }
}

Invoke-Step -Title "Reinstalar app limpo no emulador" -Action {
  & $adbExe uninstall $packageName | Out-Host
  & $adbExe install -r $apkPath | Out-Host
}

Invoke-Step -Title "Limpar logcat" -Action {
  & $adbExe logcat -c
}

if (-not $NoLog) {
  Invoke-Step -Title "Monitorar logs (Ctrl+C para parar)" -Action {
    $patterns = "com.omni.sistema|chromium|NetworkService|SIGTRAP|Fatal signal|ERR_|Http failure|Failed to load|net::"
    if ($ErrorOnly) {
      & $adbExe logcat "*:E" |
        Select-String -Pattern $patterns -CaseSensitive:$false
    } else {
      & $adbExe logcat |
        Select-String -Pattern $patterns -CaseSensitive:$false
    }
  }
} else {
  Write-Host ""
  Write-Host "Fluxo concluido sem monitoramento de log (-NoLog)." -ForegroundColor Green
}
