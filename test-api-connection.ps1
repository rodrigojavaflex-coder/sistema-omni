# Teste de conexao e resposta - api-dev.sistemasfarmamais.com
$baseUrl = "https://api-dev.sistemasfarmamais.com"
$timeout = 20

Write-Host "=== Teste 1: GET /api/health ===" -ForegroundColor Cyan
try {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health" -UseBasicParsing -TimeoutSec $timeout
    $sw.Stop()
    Write-Host "HTTP $($response.StatusCode) - Tempo: $($sw.ElapsedMilliseconds) ms" -ForegroundColor Green
    Write-Host "Body: $($response.Content)"
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "StatusCode: $($_.Exception.Response.StatusCode)"
    }
}

Write-Host ""
Write-Host "=== Teste 2: POST /api/auth/login ===" -ForegroundColor Cyan
try {
    $body = '{"email":"test@test.com","password":"123456"}'
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing -TimeoutSec $timeout
    $sw.Stop()
    Write-Host "HTTP $($response.StatusCode) - Tempo: $($sw.ElapsedMilliseconds) ms" -ForegroundColor Green
    Write-Host "Body: $($response.Content)"
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        Write-Host "Response: $($reader.ReadToEnd())"
    }
}

Write-Host ""
Write-Host "=== Teste 3: Resolucao DNS e conectividade ===" -ForegroundColor Cyan
try {
    $dns = Resolve-DnsName -Name "api-dev.sistemasfarmamais.com" -ErrorAction Stop
    Write-Host "DNS OK - IP(s): $(($dns | Where-Object Type -eq 'A').IPAddress -join ', ')"
} catch {
    Write-Host "DNS ERRO: $($_.Exception.Message)" -ForegroundColor Red
}
