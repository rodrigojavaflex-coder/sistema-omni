# DOCUMENTAÇÃO CLOUDFLARE TUNNEL - OMNI API (DESENVOLVIMENTO)

**Data de Configuração:** 21/01/2026  
**Domínio:** sistemasfarmamais.com  
**Tunnel ID:** c6aed183-3ed0-40cb-a6a9-f59bccf94d84  
**Ambiente:** Desenvolvimento

---

## 📋 RESUMO

O Cloudflare Tunnel foi configurado para expor a API do sistema OMNI em desenvolvimento (`http://localhost:3000`) 
publicamente através do domínio `api-dev.sistemasfarmamais.com`, permitindo testes do aplicativo mobile de qualquer rede.

---

## 🔧 CONFIGURAÇÃO DO SERVIÇO WINDOWS

### Informações do Serviço

- **Nome do Serviço:** `Cloudflared`
- **Display Name:** `Cloudflared agent`
- **Executável:** `C:\cloudflared\cloudflared.exe`
- **Comando:** `tunnel --config C:\cloudflared\config.yml run omni-api-dev`
- **Usuário:** `LocalSystem`
- **Status:** Running

### BinPath Configurado

```
C:\cloudflared\cloudflared.exe tunnel --config C:\cloudflared\config.yml run omni-api-dev
```

**Nota:** O `--config` deve vir ANTES do `run`. Os arquivos estão em `C:\cloudflared\` para acesso do LocalSystem.

---

## 📁 ESTRUTURA DE ARQUIVOS

### Arquivos em Uso (Sistema)

```
C:\cloudflared\
├── cloudflared.exe           # Executável
├── config.yml                # Config principal (em uso)
└── credentials.json          # Credenciais do túnel
```

### Arquivos de Backup/Origem

```
C:\Users\rodrigo.teixeira\.cloudflared\
├── config.yml                # Backup do config
└── credentials.json          # Backup do credentials
```

---

## ⚙️ CONFIGURAÇÃO (config.yml)

### Localização
`C:\cloudflared\config.yml`

### Conteúdo

```yaml
tunnel: c6aed183-3ed0-40cb-a6a9-f59bccf94d84
credentials-file: C:\cloudflared\credentials.json

ingress:
  - hostname: api-dev.sistemasfarmamais.com
    service: http://localhost:3000
  - service: http_status:404
```

---

## 🌐 DNS E ACESSO

### DNS Configurado

- **Tipo:** CNAME
- **Nome:** `api-dev`
- **Domínio:** `sistemasfarmamais.com`
- **Target:** `c6aed183-3ed0-40cb-a6a9-f59bccf94d84.cfargotunnel.com`
- **Proxy:** Proxied (Ativado - ícone laranja)
- **TTL:** Auto

### URLs de Acesso

- **API:** `https://api-dev.sistemasfarmamais.com/api`
- **Swagger:** `https://api-dev.sistemasfarmamais.com/api/docs`
- **Backend Local:** `http://localhost:3000/api`

---

## 🛠️ COMANDOS ÚTEIS

### Gerenciamento do Serviço

```powershell
# Ver status
Get-Service cloudflared

# Parar serviço
Stop-Service cloudflared

# Iniciar serviço
Start-Service cloudflared

# Reiniciar serviço
Restart-Service cloudflared

# Ver configuração
Get-WmiObject win32_service | Where-Object {$_.Name -eq "cloudflared"} | Select-Object Name, PathName, StartName, State
```

### Ver Logs

```powershell
# Logs recentes
Get-EventLog -LogName Application -Source cloudflared -Newest 20

# Apenas erros
Get-EventLog -LogName Application -Source cloudflared -Newest 50 | Where-Object {$_.EntryType -eq "Error"}

# Conexões estabelecidas
Get-EventLog -LogName Application -Source cloudflared -Newest 50 | Select-String "Registered tunnel connection"
```

### Testar Túnel Manualmente

```powershell
# Parar serviço primeiro
Stop-Service cloudflared

# Executar manualmente
C:\cloudflared\cloudflared.exe tunnel --config C:\cloudflared\config.yml run omni-api-dev
```

### Verificar Configuração Atual

```powershell
# Ver config em uso
Get-Content "C:\cloudflared\config.yml"

# Ver binPath do serviço
Get-WmiObject win32_service | Where-Object {$_.Name -eq "cloudflared"} | Select-Object PathName
```

### Testar Acesso

```powershell
# Testar API (requer backend rodando em localhost:3000)
Invoke-WebRequest -Uri "https://api-dev.sistemasfarmamais.com/api" -UseBasicParsing

# Testar Swagger
Invoke-WebRequest -Uri "https://api-dev.sistemasfarmamais.com/api/docs" -UseBasicParsing
```

---

## 🔄 CONFIGURAÇÃO INICIAL / REINSTALAÇÃO

### Passo a Passo Completo

```powershell
# 1. Criar túnel no Cloudflare (se ainda não existe)
C:\cloudflared\cloudflared.exe tunnel create omni-api-dev

# 2. Criar estrutura de diretórios
New-Item -ItemType Directory -Path "C:\cloudflared" -Force

# 3. Copiar arquivos para C:\cloudflared
Copy-Item "C:\Users\rodrigo.teixeira\.cloudflared\config.yml" "C:\cloudflared\config.yml" -Force
Copy-Item "C:\Users\rodrigo.teixeira\.cloudflared\credentials.json" "C:\cloudflared\credentials.json" -Force

# 4. Atualizar caminho do credentials no config.yml
$configPath = "C:\cloudflared\config.yml"
$config = Get-Content $configPath -Raw
$config = $config -replace "credentials-file:.*", "credentials-file: C:\cloudflared\credentials.json"
$config | Out-File -FilePath $configPath -Encoding UTF8 -NoNewline

# 5. Validar configuração
C:\cloudflared\cloudflared.exe tunnel --config C:\cloudflared\config.yml ingress validate

# 6. Configurar DNS (se ainda não configurado)
C:\cloudflared\cloudflared.exe tunnel route dns omni-api-dev api-dev.sistemasfarmamais.com

# 7. Parar e remover serviço antigo (se existir)
Stop-Service cloudflared -ErrorAction SilentlyContinue
taskkill /F /IM cloudflared.exe -ErrorAction SilentlyContinue
C:\cloudflared\cloudflared.exe service uninstall
sc.exe delete cloudflared
Start-Sleep -Seconds 5

# 8. Remover do registro (se necessário)
Remove-Item "HKLM:\SYSTEM\CurrentControlSet\Services\Cloudflared" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "HKLM:\SYSTEM\CurrentControlSet\Services\EventLog\Application\Cloudflared" -Recurse -Force -ErrorAction SilentlyContinue

# 9. Instalar serviço
C:\cloudflared\cloudflared.exe service install

# 10. Configurar binPath (IMPORTANTE: --config antes de run)
sc.exe config Cloudflared binPath= "C:\cloudflared\cloudflared.exe tunnel --config C:\cloudflared\config.yml run omni-api-dev"

# 11. Configurar diretório de trabalho (opcional, mas recomendado)
sc.exe config Cloudflared AppDirectory= "C:\cloudflared"

# 12. Configurar para iniciar automaticamente
sc.exe config Cloudflared start= auto

# 13. Configurar serviço para rodar como LocalSystem e interagir com desktop
# (Fazer via interface: Services.msc > Cloudflared > Properties > Log On > Local System Account > Allow service to interact with desktop)

# 14. Iniciar serviço
Start-Service cloudflared

# 15. Verificar status
Get-Service cloudflared

# 16. Verificar logs
Get-EventLog -LogName Application -Source cloudflared -Newest 10 | Select-Object TimeGenerated, EntryType, Message | Format-List
```

---

## ⚠️ TROUBLESHOOTING

### Problema: Erro 1067 (Processo terminou inesperadamente)

**Causas comuns:**
1. Comando incorreto no binPath (ordem dos parâmetros)
2. Arquivo de config não encontrado
3. Credentials.json não encontrado

**Solução:**
1. Verificar binPath: `Get-WmiObject win32_service | Where-Object {$_.Name -eq "cloudflared"} | Select-Object PathName`
2. Verificar se arquivos existem: `Test-Path "C:\cloudflared\config.yml"`
3. Testar comando manualmente para comparar
4. Verificar ordem: `--config` deve vir ANTES de `run`

### Problema: Erro 1069 (Falha de logon)

**Solução:**
1. Configurar serviço para rodar como LocalSystem
2. Marcar "Allow service to interact with desktop" nas propriedades do serviço
3. Verificar permissões dos arquivos em `C:\cloudflared\`

### Problema: Erro 1033 (Túnel não conecta)

**Solução:**
1. Verificar se backend está rodando: `http://localhost:3000/api`
2. Verificar logs: `Get-EventLog -LogName Application -Source cloudflared -Newest 20`
3. Verificar se portas estão liberadas no firewall
4. Testar manualmente para comparar

### Problema: Serviço não inicia

**Solução:**
1. Matar processo: `taskkill /F /IM cloudflared.exe`
2. Verificar config: `Get-Content "C:\cloudflared\config.yml"`
3. Verificar binPath: `Get-WmiObject win32_service | Where-Object {$_.Name -eq "cloudflared"} | Select-Object PathName`
4. Reinstalar serviço (ver seção acima)

### Problema: DNS não resolve

**Solução:**
1. Verificar DNS no Cloudflare Dashboard
2. Aguardar propagação (até 5 minutos)
3. Limpar cache DNS: `ipconfig /flushdns`
4. Testar com servidor DNS público: `nslookup api-dev.sistemasfarmamais.com 1.1.1.1`

---

## 📝 NOTAS IMPORTANTES

1. **Backup:** Sempre manter backup do `config.yml` e `credentials.json`
2. **Tunnel ID:** Não mudar sem necessidade (cria novo túnel)
3. **Credentials:** Arquivo sensível, não compartilhar
4. **Backend:** Deve estar rodando em `localhost:3000` para o túnel funcionar
5. **Ordem do comando:** `--config` deve vir ANTES de `run` no binPath
6. **Localização dos arquivos:** Arquivos devem estar em `C:\cloudflared\` para acesso do LocalSystem
7. **Serviço vs Manual:** Se manual funciona mas serviço não, verificar:
   - Ordem dos parâmetros no binPath
   - Localização dos arquivos (acessível pelo LocalSystem)
   - Diretório de trabalho do serviço

---

## 🔗 LINKS ÚTEIS

- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Domínio:** sistemasfarmamais.com
- **Tunnel List:** `C:\cloudflared\cloudflared.exe tunnel list`
- **Documentação Cloudflare:** https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

---

## 📅 HISTÓRICO DE ALTERAÇÕES

- **21/01/2026:** Configuração inicial do túnel de desenvolvimento
- **21/01/2026:** Configuração do serviço Windows
- **21/01/2026:** Configuração DNS no Cloudflare

---

**Última Atualização:** 21/01/2026
