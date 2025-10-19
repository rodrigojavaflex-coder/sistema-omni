# 🔧 Troubleshooting - Instalação no Servidor# 🔧 Troubleshooting - Instalação no Servidor



## ❌ Erro: NSSM em uso / Acesso negado## ❌ Erro: NSSM em uso / Acesso negado



### Sintoma### Sintoma

``````

Remove-Item : Não é possível remover o item C:\nssm\nssm.exe: O acesso ao caminho 'nssm.exe' foi negado.Remove-Item : Não é possível remover o item C:\nssm\nssm.exe: O acesso ao caminho 'nssm.exe' foi negado.

``````



### Causa### Causa

O NSSM já está instalado e pode estar sendo usado por um serviço existente.O NSSM já está instalado e pode estar sendo usado por um serviço existente.



### ✅ Solução (Já Implementada no Script)### ✅ Solução (Já Implementada)

O script `install-omni.ps1` detecta e reutiliza a instalação existente automaticamente.O script `install-omni.ps1` foi atualizado para:

1. ✅ Detectar NSSM existente

### Ação Manual (se ainda falhar)2. ✅ Reutilizar instalação existente

```powershell3. ✅ Adicionar ao PATH se necessário

# 1. Verificar se NSSM está no PATH4. ✅ Usar diretório alternativo se houver conflito

nssm version

### Ação Manual (se ainda falhar)

# 2. Se não estiver, adicionar manualmente```powershell

$env:PATH += ";C:\nssm"# 1. Verificar se NSSM está no PATH

[Environment]::SetEnvironmentVariable("PATH", "$env:PATH;C:\nssm", "Machine")nssm version



# 3. Executar install novamente# 2. Se não estiver, adicionar manualmente

.\install-omni.ps1$env:PATH += ";C:\nssm"

```[Environment]::SetEnvironmentVariable("PATH", "$env:PATH;C:\nssm", "Machine")



---# 3. Executar install novamente

.\install-omni.ps1

## ❌ Erro: Serviço já existe```



### Sintoma---

```

Service "OMNI-Sistema" is already installed!## ❌ Erro: Serviço já existe

```

### Sintoma

### ✅ Solução```

```powershellService "OMNI-Sistema" is already installed!

# Remover serviço existente```

nssm remove OMNI-Sistema confirm

### ✅ Solução

# Executar instalação novamente```powershell

.\install-omni.ps1# Remover serviço existente

```nssm remove OMNI-Sistema confirm



---# Executar instalação novamente

.\install-omni.ps1

## ❌ Erro: npm não encontrado```



### Sintoma---

```

npm : O termo 'npm' não é reconhecido## ❌ Erro: npm não encontrado

```

### Sintoma

### ✅ Solução```

```powershellnpm : O termo 'npm' não é reconhecido

# 1. Instalar Node.js```

# Download: https://nodejs.org/en/download/

# Versão LTS recomendada: 20.x ou superior### ✅ Solução

```powershell

# 2. Verificar instalação# 1. Instalar Node.js

node --version# Download: https://nodejs.org/en/download/

npm --version# Versão LTS recomendada: 20.x ou superior



# 3. Reiniciar PowerShell como Administrador# 2. Verificar instalação

node --version

# 4. Executar install novamentenpm --version

.\install-omni.ps1

```# 3. Reiniciar PowerShell como Administrador



---# 4. Executar install novamente

.\install-omni.ps1

## ❌ Erro: IIS não encontrado```



### Sintoma---

```

Get-WebApplication : O termo 'Get-WebApplication' não é reconhecido## ❌ Erro: IIS não encontrado

```

### Sintoma

### ✅ Solução```

```powershellGet-WebApplication : O termo 'Get-WebApplication' não é reconhecido

# 1. Instalar IIS via PowerShell```

Install-WindowsFeature -Name Web-Server -IncludeManagementTools

### ✅ Solução

# 2. Instalar módulos necessários```powershell

Install-WindowsFeature -Name Web-Url-Rewrite# 1. Instalar IIS via PowerShell

Install-WindowsFeature -Name Web-ARRInstall-WindowsFeature -Name Web-Server -IncludeManagementTools



# 3. Ou baixar manualmente:# 2. Instalar módulos necessários

# - URL Rewrite: https://www.iis.net/downloads/microsoft/url-rewriteInstall-WindowsFeature -Name Web-Url-Rewrite

# - ARR: https://www.iis.net/downloads/microsoft/application-request-routingInstall-WindowsFeature -Name Web-ARR



# 4. Executar install novamente# 3. Ou baixar manualmente:

.\install-omni.ps1# - URL Rewrite: https://www.iis.net/downloads/microsoft/url-rewrite

```# - ARR: https://www.iis.net/downloads/microsoft/application-request-routing



---# 4. Executar install novamente

.\install-omni.ps1

## ❌ Erro: .env não encontrado```



### Sintoma---

```

AVISO: .env nao encontrado no servidor!## ❌ Erro: .env não encontrado

```

### Sintoma

### ✅ Solução```

```powershellAVISO: .env nao encontrado no servidor!

# 1. Copiar .env template```

Copy-Item C:\NovaVersao\ArquivosBackend\.env C:\Deploy\OMNI\.env

### ✅ Solução

# 2. Editar configurações```powershell

notepad C:\Deploy\OMNI\.env# 1. Copiar .env template

```Copy-Item C:\NovaVersao\ArquivosBackend\.env C:\Deploy\OMNI\.env



### Configuração mínima do .env:# 2. Editar configurações

```ininotepad C:\Deploy\OMNI\.env

NODE_ENV=production```



# Database PostgreSQL### Configuração mínima do .env:

DATABASE_HOST=localhost```ini

DATABASE_PORT=5432NODE_ENV=production

DATABASE_USERNAME=postgres

DATABASE_PASSWORD=SUA_SENHA_AQUI# Database PostgreSQL

DATABASE_NAME=omniDATABASE_HOST=localhost

DATABASE_PORT=5432

# JWTDATABASE_USERNAME=postgres

JWT_SECRET=TROCAR_POR_CHAVE_SEGURA_AQUIDATABASE_PASSWORD=SUA_SENHA_AQUI

JWT_EXPIRATION=7dDATABASE_NAME=omni



# Application# JWT

PORT=8080JWT_SECRET=TROCAR_POR_CHAVE_SEGURA_AQUI

```JWT_EXPIRATION=7d



---# Application

PORT=8080

## ❌ Erro: Porta 8080 já em uso```



### Sintoma---

```

Error: listen EADDRINUSE: address already in use :::8080## ❌ Erro: Porta 8080 já em uso

```

### Sintoma

### ✅ Solução Opção 1 - Mudar Porta```

```powershellError: listen EADDRINUSE: address already in use :::8080

# 1. Parar serviço conflitante```

Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process -Force

### ✅ Solução Opção 1 - Mudar Porta

# 2. Ou mudar porta no .env```powershell

notepad C:\Deploy\OMNI\.env# 1. Parar serviço conflitante

# Alterar: PORT=8081Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process -Force



# 3. Atualizar web.config do IIS# 2. Ou mudar porta no .env

notepad C:\inetpub\wwwroot\omni\web.confignotepad C:\Deploy\OMNI\.env

# Alterar: localhost:8080 -> localhost:8081# Alterar: PORT=8081



# 4. Reiniciar serviço# 3. Atualizar web.config do IIS

nssm restart OMNI-Sistemanotepad C:\inetpub\wwwroot\omni\web.config

```# Alterar: localhost:8080 -> localhost:8081



### ✅ Solução Opção 2 - Liberar Porta# 4. Reiniciar serviço

```powershellnssm restart OMNI-Sistema

# Ver o que está usando a porta```

netstat -ano | findstr :8080

### ✅ Solução Opção 2 - Liberar Porta

# Parar processo (substitua PID)```powershell

Stop-Process -Id PID -Force# Ver o que está usando a porta

netstat -ano | findstr :8080

# Reiniciar serviço OMNI

nssm restart OMNI-Sistema# Parar processo (substitua PID)

```Stop-Process -Id PID -Force



---# Reiniciar serviço OMNI

nssm restart OMNI-Sistema

## ❌ Erro: PostgreSQL não conecta```



### Sintoma---

```

ECONNREFUSED: Connection refused## ❌ Erro: PostgreSQL não conecta

```

### Sintoma

### ✅ Solução```

```powershellECONNREFUSED: Connection refused

# 1. Verificar se PostgreSQL está rodando```

Get-Service -Name postgresql*

### ✅ Solução

# 2. Testar conexão```powershell

psql -h localhost -U postgres -d omni# 1. Verificar se PostgreSQL está rodando

Get-Service -Name postgresql*

# 3. Verificar configurações no .env

notepad C:\Deploy\OMNI\.env# 2. Testar conexão

psql -h localhost -U postgres -d omni

# 4. Verificar firewall

Test-NetConnection -ComputerName localhost -Port 5432# 3. Verificar configurações no .env

notepad C:\Deploy\OMNI\.env

# 5. Ver logs do backend

Get-Content C:\Deploy\OMNI\logs\omni-stderr.log -Tail 50# 4. Verificar firewall

```Test-NetConnection -ComputerName localhost -Port 5432



---# 5. Ver logs do backend

Get-Content C:\Deploy\OMNI\logs\omni-stderr.log -Tail 50

## ❌ Erro: 404 nas chamadas da API```



### Sintoma---

- Frontend carrega, mas login retorna 404

## ❌ Erro: 404 nas chamadas da API

### ✅ Solução (Implementada Automaticamente)

Os scripts `install-omni.ps1` e `atualizar-servidor.ps1` criam automaticamente o **web.config GLOBAL** em `C:\inetpub\wwwroot\` que captura `/api/*` antes da aplicação `/omni`.### Sintoma

- Frontend carrega, mas login retorna 404

### Verificação Manual

```powershell### ✅ Solução (Já Implementada no Script)

# 1. Ver web.config globalO `install-omni.ps1` e `atualizar-servidor.ps1` agora criam automaticamente o **dual proxy**:

Get-Content C:\inetpub\wwwroot\web.config

```xml

# 2. Deve conter:<!-- /api/* -> backend -->

# <rule name="Global API Proxy" ...><!-- /omni/api/* -> backend -->

```

# 3. Se não tiver, executar atualização

cd C:\NovaVersao### Verificação Manual

.\atualizar-servidor.ps1```powershell

```# 1. Ver web.config

Get-Content C:\inetpub\wwwroot\omni\web.config

---

# 2. Deve conter ambas as regras:

## 🔍 Diagnóstico Geral# - "API Proxy with omni prefix"

# - "API Proxy direct"

### Script de Diagnóstico Completo

```powershell# 3. Se não tiver, executar atualização

cd C:\NovaVersaocd C:\NovaVersao

.\diagnostico.ps1.\atualizar-servidor.ps1

``````



### Verificações Manuais Importantes---

```powershell

# 1. Serviço## 🔍 Diagnóstico Geral

nssm status OMNI-Sistema

### Script de Diagnóstico Completo

# 2. Backend direto```powershell

Invoke-WebRequest http://localhost:8080/api -UseBasicParsingcd C:\NovaVersao

.\diagnostico.ps1

# 3. Proxy do IIS```

Invoke-WebRequest http://localhost/api -UseBasicParsing

### Verificações Manuais Importantes

# 4. Logs do backend```powershell

Get-Content C:\Deploy\OMNI\logs\omni-stderr.log -Tail 50# 1. Serviço

nssm status OMNI-Sistema

# 5. Logs do IIS

Get-Content C:\inetpub\logs\LogFiles\W3SVC1\*.log -Tail 20# 2. Backend direto

Invoke-WebRequest http://localhost:8080/api -UseBasicParsing

# 6. Processos Node.js

Get-Process node# 3. Proxy do IIS

Invoke-WebRequest http://localhost/omni/api -UseBasicParsing

# 7. Portas em usoInvoke-WebRequest http://localhost/api -UseBasicParsing

netstat -ano | findstr :8080

```# 4. Logs do backend

Get-Content C:\Deploy\OMNI\logs\omni-stderr.log -Tail 50

---

# 5. Logs do IIS

## 📞 Informações ÚteisGet-Content C:\inetpub\logs\LogFiles\W3SVC1\*.log -Tail 20



### Caminhos Importantes# 6. Processos Node.js

- **Backend**: `C:\Deploy\OMNI`Get-Process node

- **Frontend**: `C:\inetpub\wwwroot\omni`

- **Deploy staging**: `C:\NovaVersao`# 7. Portas em uso

- **Logs backend**: `C:\Deploy\OMNI\logs\`netstat -ano | findstr :8080

- **Logs IIS**: `C:\inetpub\logs\LogFiles\W3SVC1\````

- **NSSM**: `C:\nssm\nssm.exe`

---

### Comandos NSSM

```powershell## 📞 Informações Úteis

nssm status OMNI-Sistema      # Ver status

nssm start OMNI-Sistema       # Iniciar### Caminhos Importantes

nssm stop OMNI-Sistema        # Parar- **Backend**: `C:\Deploy\OMNI`

nssm restart OMNI-Sistema     # Reiniciar- **Frontend**: `C:\inetpub\wwwroot\omni`

nssm remove OMNI-Sistema      # Remover (confirme com: confirm)- **Deploy staging**: `C:\NovaVersao`

nssm edit OMNI-Sistema        # Editar configurações (GUI)- **Logs backend**: `C:\Deploy\OMNI\logs\`

```- **Logs IIS**: `C:\inetpub\logs\LogFiles\W3SVC1\`

- **NSSM**: `C:\nssm\nssm.exe`

### URLs de Teste

- **Frontend**: http://gestaodetransporte.com/omni### Comandos NSSM

- **Backend direto**: http://localhost:8080/api```powershell

- **Backend via proxy**: http://gestaodetransporte.com/omni/apinssm status OMNI-Sistema      # Ver status

- **Backend via proxy alternativo**: http://gestaodetransporte.com/apinssm start OMNI-Sistema       # Iniciar

nssm stop OMNI-Sistema        # Parar

---nssm restart OMNI-Sistema     # Reiniciar

nssm remove OMNI-Sistema      # Remover (confirme com: confirm)

## 🆘 Reinstalação Completanssm edit OMNI-Sistema        # Editar configurações (GUI)

```

Se tudo falhar, limpar e reinstalar:

### URLs de Teste

```powershell- **Frontend**: http://gestaodetransporte.com/omni

# 1. Parar e remover serviço- **Backend direto**: http://localhost:8080/api

nssm stop OMNI-Sistema- **Backend via proxy**: http://gestaodetransporte.com/omni/api

nssm remove OMNI-Sistema confirm- **Backend via proxy alternativo**: http://gestaodetransporte.com/api



# 2. Limpar diretórios---

Remove-Item C:\Deploy\OMNI -Recurse -Force

Remove-Item C:\inetpub\wwwroot\omni -Recurse -Force## 🆘 Reinstalação Completa



# 3. ReinstalarSe tudo falhar, limpar e reinstalar:

cd C:\NovaVersao

.\install-omni.ps1```powershell

# 1. Parar e remover serviço

# 4. Configurar .envnssm stop OMNI-Sistema

notepad C:\Deploy\OMNI\.envnssm remove OMNI-Sistema confirm



# 5. Reiniciar serviço# 2. Limpar diretórios

nssm restart OMNI-SistemaRemove-Item C:\Deploy\OMNI -Recurse -Force

```Remove-Item C:\inetpub\wwwroot\omni -Recurse -Force



---# 3. Reinstalar

cd C:\NovaVersao

## ✅ Checklist de Instalação.\install-omni.ps1



- [ ] Node.js instalado (v20+)# 4. Configurar .env

- [ ] PostgreSQL rodandonotepad C:\Deploy\OMNI\.env

- [ ] IIS instalado com URL Rewrite e ARR

- [ ] NSSM instalado ou detectado# 5. Reiniciar serviço

- [ ] `.env` configurado corretamentenssm restart OMNI-Sistema

- [ ] Porta 8080 livre```

- [ ] Firewall liberado para porta 8080

- [ ] Serviço OMNI-Sistema rodando---

- [ ] Backend responde em localhost:8080

- [ ] Frontend carrega em /omni## ✅ Checklist de Instalação

- [ ] Login funciona (sem 404)

- [ ] Node.js instalado (v20+)

---- [ ] PostgreSQL rodando

- [ ] IIS instalado com URL Rewrite e ARR

*Última atualização: 18/10/2025*- [ ] NSSM instalado ou detectado
- [ ] `.env` configurado corretamente
- [ ] Porta 8080 livre
- [ ] Firewall liberado para porta 8080
- [ ] Serviço OMNI-Sistema rodando
- [ ] Backend responde em localhost:8080
- [ ] Frontend carrega em /omni
- [ ] Login funciona (sem 404)

---

*Última atualização: 18/10/2025*
