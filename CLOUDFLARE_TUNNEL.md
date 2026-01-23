# DOCUMENTAÇÃO CLOUDFLARE TUNNEL - OMNI API

**Data de Configuração:** 20/01/2026  
**Domínio:** sistemasfarmamais.com  
**Tunnel ID:** 5b04d277-0cce-4e8d-8c6d-fd22bbc1cd9f

---

## 📋 RESUMO

O Cloudflare Tunnel foi configurado para expor a API do sistema OMNI (`http://localhost:8080`) 
publicamente através do domínio `api.sistemasfarmamais.com`, permitindo acesso do aplicativo 
mobile de qualquer rede.

---

## 🔧 CONFIGURAÇÃO DO SERVIÇO WINDOWS

### Informações do Serviço

- **Nome do Serviço:** `Cloudflared`
- **Display Name:** `Cloudflared agent`
- **Executável:** `C:\cloudflared\cloudflared.exe`
- **Comando:** `tunnel run omni-api`
- **Usuário:** `LocalSystem`
- **Status:** Running

### BinPath Configurado

```
C:\cloudflared\cloudflared.exe tunnel run omni-api
```

**Nota:** O serviço usa a variável de ambiente `TUNNEL_CONFIG` para localizar o arquivo de configuração.

---

## 📁 ESTRUTURA DE ARQUIVOS

### Arquivos em Produção (Sistema)

```
C:\Windows\System32\config\systemprofile\.cloudflared\
├── config.yml                    # Config principal (em uso)
└── tunnels\
    └── omni-api\
        └── credentials.json      # Credenciais do túnel
```

### Arquivos de Backup/Desenvolvimento

```
C:\cloudflared\
├── cloudflared.exe               # Executável
├── config.yml                    # Backup do config
└── tunnels\
    └── omni-api\
        ├── config.yml            # Backup
        └── credentials.json      # Backup
```

---

## ⚙️ CONFIGURAÇÃO (config.yml)

### Localização
`C:\Windows\System32\config\systemprofile\.cloudflared\config.yml`

### Conteúdo

```yaml
tunnel: 5b04d277-0cce-4e8d-8c6d-fd22bbc1cd9f
credentials-file: C:\Windows\System32\config\systemprofile\.cloudflared\tunnels\omni-api\credentials.json

ingress:
  - hostname: api.sistemasfarmamais.com
    service: http://localhost:8080
  - service: http_status:404
```

### Variável de Ambiente

- **Nome:** `TUNNEL_CONFIG`
- **Valor:** `C:\Windows\System32\config\systemprofile\.cloudflared\config.yml`
- **Escopo:** Machine (Sistema)

---

## 🌐 DNS E ACESSO

### DNS Configurado

- **Tipo:** CNAME
- **Nome:** `api`
- **Domínio:** `sistemasfarmamais.com`
- **Target:** `5b04d277-0cce-4e8d-8c6d-fd22bbc1cd9f.cfargotunnel.com`
- **Proxy:** Proxied (Ativado - ícone laranja)
- **TTL:** Auto

### URLs de Acesso

- **API:** `https://api.sistemasfarmamais.com/api`
- **Swagger:** `https://api.sistemasfarmamais.com/api/docs`
- **Backend Local:** `http://localhost:8080/api`

---

## 🔥 FIREWALL E PORTAS

### Portas Liberadas no Firewall do Estado

**Saída (Outbound):**
- **TCP 7844** → Faixas Cloudflare:
  - `198.41.192.0/24` (256 IPs)
  - `198.41.200.0/24` (256 IPs)
- **UDP 7844** → Mesmas faixas (recomendado)

**Total:** 512 IPs liberados

### IPs Identificados nos Testes

- `198.41.192.37`
- `198.41.192.57`
- `198.41.192.67`
- `198.41.200.23`
- `198.41.200.233`

**Localização:** Guarulhos/SP (datacenters Cloudflare - `gru`)

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
C:\cloudflared\cloudflared.exe tunnel --config C:\Windows\System32\config\systemprofile\.cloudflared\config.yml run omni-api
```

### Verificar Configuração Atual

```powershell
# Ver variável de ambiente
[System.Environment]::GetEnvironmentVariable("TUNNEL_CONFIG", "Machine")

# Ver config em uso
Get-Content "C:\Windows\System32\config\systemprofile\.cloudflared\config.yml"

# Ver binPath do serviço
Get-WmiObject win32_service | Where-Object {$_.Name -eq "cloudflared"} | Select-Object PathName
```

### Testar Acesso

```powershell
# Testar API
Invoke-WebRequest -Uri "https://api.sistemasfarmamais.com/api" -UseBasicParsing"

# Testar Swagger
Invoke-WebRequest -Uri "https://api.sistemasfarmamais.com/api/docs" -UseBasicParsing
```

---

## 🔄 REINSTALAÇÃO DO SERVIÇO

Se precisar reinstalar o serviço:

```powershell
# 1. Parar e remover
taskkill /F /IM cloudflared.exe
C:\cloudflared\cloudflared.exe service uninstall
sc.exe delete cloudflared
Start-Sleep -Seconds 5

# 2. Remover do registro (se necessário)
Remove-Item "HKLM:\SYSTEM\CurrentControlSet\Services\Cloudflared" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "HKLM:\SYSTEM\CurrentControlSet\Services\EventLog\Application\Cloudflared" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Garantir que config existe
Test-Path "C:\Windows\System32\config\systemprofile\.cloudflared\config.yml"

# 4. Configurar variável de ambiente
[System.Environment]::SetEnvironmentVariable("TUNNEL_CONFIG", "C:\Windows\System32\config\systemprofile\.cloudflared\config.yml", "Machine")

# 5. Instalar serviço
C:\cloudflared\cloudflared.exe service install

# 6. Configurar binPath
sc.exe config Cloudflared binPath= "C:\cloudflared\cloudflared.exe tunnel run omni-api"

# 7. Iniciar
Start-Service cloudflared
```

---

## 📱 CONFIGURAÇÃO PARA MOBILE

### URL da API

```typescript
// mobile/src/config/environment.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.sistemasfarmamais.com/api'
};
```

### CORS no Backend

Adicionar no `backend/src/main.ts`:

```typescript
const allowedOrigins = isProduction
  ? [
      'https://gestaodetransporte.com',
      'https://www.gestaodetransporte.com',
      'https://api.sistemasfarmamais.com',  // ← ADICIONAR
      'https://sistemasfarmamais.com',      // ← ADICIONAR (se necessário)
      'capacitor://localhost',
      'ionic://localhost',
    ]
  : [
      // ... desenvolvimento
    ];
```

---

## ⚠️ TROUBLESHOOTING

### Problema: Erro 1033 (Túnel não conecta)

**Solução:**
1. Verificar se backend está rodando: `http://localhost:8080/api`
2. Verificar logs: `Get-EventLog -LogName Application -Source cloudflared -Newest 20`
3. Verificar se portas estão liberadas no firewall
4. Testar manualmente para comparar

### Problema: Serviço não inicia

**Solução:**
1. Matar processo: `taskkill /F /IM cloudflared.exe`
2. Verificar config: `Get-Content "C:\Windows\System32\config\systemprofile\.cloudflared\config.yml"`
3. Verificar variável: `[System.Environment]::GetEnvironmentVariable("TUNNEL_CONFIG", "Machine")`
4. Reinstalar serviço (ver seção acima)

### Problema: DNS não resolve

**Solução:**
1. Verificar DNS no Cloudflare Dashboard
2. Aguardar propagação (até 5 minutos)
3. Limpar cache DNS: `ipconfig /flushdns`
4. Testar com servidor DNS público: `nslookup api.sistemasfarmamais.com 1.1.1.1`

---

## 📝 NOTAS IMPORTANTES

1. **Backup:** Sempre manter backup do `config.yml` e `credentials.json`
2. **Tunnel ID:** Não mudar sem necessidade (cria novo túnel)
3. **Credentials:** Arquivo sensível, não compartilhar
4. **Firewall:** Portas 7844 (TCP/UDP) devem estar liberadas
5. **Backend:** Deve estar rodando em `localhost:8080` para o túnel funcionar

---

## 🔗 LINKS ÚTEIS

- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Domínio:** sistemasfarmamais.com
- **Tunnel List:** `C:\cloudflared\cloudflared.exe tunnel list`
- **Documentação Cloudflare:** https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

---

## 📅 HISTÓRICO DE ALTERAÇÕES

- **20/01/2026:** Configuração inicial do túnel
- **20/01/2026:** Configuração do serviço Windows
- **20/01/2026:** Liberação de portas no firewall do estado
- **20/01/2026:** Configuração DNS no Cloudflare

---

**Última Atualização:** 20/01/2026
