# Checklist — Node 24 no ambiente de desenvolvimento

> Use este documento na **Fase 1** do [`PLANO_ATUALIZACAO_NODE.md`](./PLANO_ATUALIZACAO_NODE.md).  
> Produção **não** entra neste checklist.  
> **Commit Git:** somente após validação **produção (seção 11)** e **mobile (seção 5 + 12)** concluídas.

---

## 1. Instalar Node 24 na máquina de dev

- [x] Baixar **Node 24 LTS** (ex.: 24.18.x) em [https://nodejs.org/](https://nodejs.org/) — instalador Windows x64.
- [x] Fechar terminais, VS Code/Cursor e processos que usem Node (`ng serve`, `nest start --watch`).
- [x] Instalar o MSI (substitui Node 22 no PATH global).
- [x] Abrir **novo** PowerShell e confirmar:

```powershell
node -v    # esperado: v24.18.x (ou patch mais recente da linha 24)
npm -v
```

- [ ] (Opcional) Se precisar manter 22 e 24 lado a lado, usar [nvm-windows](https://github.com/coreybutler/nvm-windows) e `nvm use 24.18.0`.

---

## 2. O que foi / deve ser atualizado no repositório OMNI

| Item | Arquivo | Ação | Status local |
|------|---------|------|--------------|
| Versão alvo | `.nvmrc` | `24.18.0` | OK (untracked) |
| Engine | `package.json` (raiz) | `"node": ">=24.0.0"` | OK |
| Tipos Node | `backend/package.json` | `"@types/node": "^24.0.0"` | OK |
| Referência install | `scripts/install-omni.ps1` | MSI Node 24.18.0 | OK |
| README deploy | `deploy.ps1` (texto gerado) | Menciona Node 24 | OK |
| Validação rápida | `package.json` (raiz) | `deps:full:quick:no-lint` | OK |
| CI | `.github/workflows` | `node-version: '24'` | N/A (sem CI no repo) |

Após instalar Node 24, **reinstalar dependências** em cada pacote (lock pode mudar).

> **PowerShell 5.x (Windows):** não use `&&` — execute um comando por linha ou use `;` entre eles.  
> Se `npm ci` falhar por lock desatualizado (ex.: `@types/node`), rode **`npm install`** uma vez e depois `npm run build`.

```powershell
cd C:\PROJETOS\OMNI\backend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
npm run build

cd C:\PROJETOS\OMNI\frontend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
npm run build -- --configuration production

cd C:\PROJETOS\OMNI\mobile
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
npm run build
npx cap sync
```

Atalho (script do repo):

```powershell
cd C:\PROJETOS\OMNI
npm run deps:full:quick   # valida sem reinstalar, se node_modules já alinhados
# se ESLint CRLF falhar (Windows):
npm run deps:full:quick:no-lint
# ou, após limpar node_modules:
npm run deps:full
```

---

## 3. Testes obrigatórios — OMNI backend

- [x] `npm run build` — sem erro TypeScript
- [x] `npm run start:dev` — sobe sem erro de módulo nativo
- [x] Login / JWT — autenticação com senha (exercita **bcrypt**) — credencial real validada manualmente (2026-07-23)
- [x] Swagger — `http://localhost:3000/api/docs` (porta dev do `.env`)
- [x] CRUD de uma entidade principal (ex.: ocorrência / vistoria) — OK (validação manual 2026-07-23)
- [ ] Upload ou geração de **PDF** (`pdfkit`) — adiado / N/A se fluxo não exercitado
- [ ] Envio de e-mail (`nodemailer`) — adiado / N/A se `.env` de dev sem SMTP de teste
- [x] `npm run migration:run` — migrations em banco de dev (sem erro; nenhuma pendente)

---

## 4. Testes obrigatórios — OMNI frontend

- [x] `ng serve` — compila sem erro (`http://localhost:4200`)
- [x] Login na aplicação web — OK (validação manual 2026-07-23)
- [x] Navegação menu → 2–3 telas críticas (lista + formulário) — OK (validação manual 2026-07-23)
- [x] Tema claro e escuro — OK (validação manual 2026-07-23)
- [ ] Exportação **Excel** (`exceljs`) — adiado / N/A se não exercitado
- [ ] Mapas Google (`@angular/google-maps`) — adiado / N/A se não exercitado
- [x] Build produção: `npm run build -- --configuration production`

---

## 5. Testes recomendados — OMNI mobile (dev only)

> Mobile **não está em produção**; validar build toolchain, não deploy servidor.

- [x] `npm run build` no pacote `mobile/`
- [x] `npx cap sync`
- [x] `ionic serve` ou `npm run serve` — tela inicial e login (`http://localhost:8100/login`)
- [x] `npm ci` + `npm run build` + `npx cap sync` — OK (2026-07-24, Node 24)
- [x] Login mobile (manual) — API dev (`api-dev` + túnel); emulador + aparelho físico (2026-07-24)
- [x] Pesquisa / fluxo crítico — OK no aparelho (2026-07-24)
- [x] `gradlew assembleDebug` / APK — OK via `run-emulator-clean.ps1` / Android Studio (2026-07-24)
- [x] Plugins sensíveis (device): câmera, gravação de áudio — OK aparelho (2026-07-24); biometria N/A se não testada

---

## 6. NEST_ANGULAR (mesma máquina de dev)

Se você desenvolve os dois projetos na mesma máquina, repetir após Node 24:

```powershell
cd C:\PROJETOS\NEST_ANGULAR\backend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
npm run build

cd C:\PROJETOS\NEST_ANGULAR\frontend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
npm run build

cd C:\PROJETOS\NEST_ANGULAR\agent
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
npm run build
```

| Teste | Motivo |
|-------|--------|
| Login + telas principais | regressão geral |
| Export Excel | override `uuid` / exceljs |
| Folha / recibos com imagem | `@resvg/resvg-js` (nativo) |
| Agente Firebird + sync | `node-firebird` + deploy agent |
| Upload mídia (se houver) | `ffmpeg-static` |

---

## 7. O que **não** fazer nesta fase

- [x] ~~Rodar `install-omni.ps1` no servidor de produção~~
- [x] ~~Subir Node 24 em produção antes de marcar este checklist~~
- [x] ~~Commitar `package-lock.json` quebrado~~ — `npm ci` + build OK (2026-07-24); commit quando decidir

---

## 8. Critério para avançar à Fase 3 (produção OMNI)

- [x] Itens **obrigatórios** das seções 3 e 4 — OK
- [x] CRUD, navegação e tema (seções 3 e 4) — OK (validação manual 2026-07-23)
- [ ] Itens **opcionais** restantes (PDF, e-mail, Excel, mapas) — adiados / N/A se não exercitados
- [x] Mobile toolchain (seção 5 + 12 automático) — build, cap sync, npm ci OK
- [x] Mobile manual + APK/plugins (seção 12) — OK 2026-07-24
- [x] **Produção Node 24 + IIS** (seção 11) — login e deploy via `atualizar-servidor.ps1` OK 2026-07-24
- [x] NEST_ANGULAR (seção 6) OK ou não aplicável — validado anteriormente na mesma máquina
- [ ] Backup completo do servidor confirmado — **Fase 3** (IIS `wwwroot` + `C:\Deploy\OMNI` + banco)
- [ ] Janela de manutenção agendada — **Fase 3**

> **Produção:** frontend no **IIS** (`/omni`); API via proxy IIS → NSSM (porta 8080). Upgrade Node 24 afeta apenas o serviço NSSM, não o IIS em si.

> **Fase 1 (dev + validação prod/mobile):** concluída em 2026-07-24 — builds, login web, CRUD, tema, produção Node 24 (IIS/NSSM) e mobile (login, pesquisa, câmera, áudio) OK.

Ver procedimento produção em [`PLANO_ATUALIZACAO_NODE.md`](./PLANO_ATUALIZACAO_NODE.md) — Fase 3.

---

## 9. Registro de execução (preencher manualmente)

| Campo | Valor |
|-------|--------|
| Data | 2026-07-23 |
| Node instalado | `v24.18.0` |
| npm | `11.16.0` |
| Responsável | Rodrigo Teixeira (validação agente Cursor) |
| OMNI backend build | ☑ OK ☐ Falhou |
| OMNI frontend build | ☑ OK ☐ Falhou |
| OMNI mobile build | ☑ OK ☐ N/A |
| NEST_ANGULAR build | ☐ OK ☑ N/A (validado anteriormente na mesma máquina) |
| Observações | Seções 11 e 12 OK (2026-07-24). Commit Fase 2 Node 24. Túnel DEV (`api-dev`) exige Cloudflared ativo (erro 1033 se parado). |

### Detalhes da execução 2026-07-23

| Etapa | Resultado |
|-------|-----------|
| Pré-check ambiente | OK — Node 24.18.0, npm 11.16.0, branch `main` |
| `deps:full:quick` | Falhou — ESLint/prettier CRLF |
| `verify-stack-deps --full --skip-install --skip-eslint` | OK (revalidado após login) |
| `npm install` + `npm audit fix` backend | OK — lock atualizado; 1 vuln high remanescente |
| Backend / frontend / mobile build | OK |
| Backend `start:dev` + Swagger | OK |
| Login real (manual) | OK |
| Navegação + tema (manual) | OK |
| CRUD entidade principal (manual) | OK |
| Proxy frontend → API | OK |
| Frontend `ng serve` / mobile `ionic serve` | OK |
| `migration:run` | OK — nenhuma pendente |
| PDF, e-mail, Excel, mapas | Adiado / N/A |
| Plugins mobile (device) | Adiado |
| `npm ci` backend (simula prod) | OK — 2026-07-24, 573 pacotes; build após `npm ci` OK; 1 vuln high `nodemailer` |
| Revalidação stack 2026-07-24 | OK — `deps:full:quick:no-lint`; backend `npm ci`+build; mobile `npm ci`+build+cap sync |
| Produção (seção 11) | OK — Node 24, `deploy.ps1`, `atualizar-servidor.ps1`, login IIS |
| Mobile manual / APK (seção 12) | OK — emulador + aparelho; login, pesquisa, câmera, áudio |

---

## 10. Runbook Fase 3 — produção (IIS + NSSM)

> Executar **somente** após backup + janela agendada. **Não** rodar `install-omni.ps1` em servidor estável.

### Revisão `deploy.ps1` → `ArquivosBackend` (2026-07-24)

| Item | Vai no pacote? | Uso no servidor |
|------|----------------|-----------------|
| `dist/**` (incl. `main.js`, `data-source.js`, `migrations/*.js`) | Sim | NSSM executa `node dist/main.js`; `migration:run:prod` usa `dist/data-source.js` |
| `package.json` + **`package-lock.json`** | Sim (lock **obrigatório**) | `atualizar-servidor.ps1` → `npm ci --omit=dev` se lock mudou |
| `node_modules` | **Não** | Instalados no servidor após cópia |
| `.env` no pacote | Modelo só para bootstrap | **`atualizar-servidor.ps1` preserva** `C:\Deploy\OMNI\.env` |
| Frontend build `/omni/` | `ArquivosFrontend` | IIS `C:\inetpub\wwwroot\omni` |
| IIS / proxy `/api` | Não (já no servidor) | `web.config` raiz → `localhost:8080` |

**NSSM:** serviço usa `node` do **PATH** (`nssm install … node dist\main.js`). Após MSI Node 24, abrir **novo** PowerShell Admin e confirmar `where.exe node` → `Program Files\nodejs`.

**Após trocar Node 22→24:** remover `C:\Deploy\OMNI\node_modules` antes de `atualizar-servidor.ps1` (ou garantir lock novo no pacote) para forçar `npm ci` limpo com **bcrypt** no Node 24.

### Pré-requisitos

- Fase 1 dev concluída (checklist seções 3–5).
- No **PC dev** (Node **24.18.x**): `.\deploy.ps1` → `C:\NovaVersao` com lock validado.
- Backup: `C:\inetpub\wwwroot\omni`, `C:\inetpub\wwwroot\web.config`, `C:\Deploy\OMNI`, banco PostgreSQL.

### Sequência recomendada (servidor já em produção)

**No PC de desenvolvimento**

```powershell
cd C:\PROJETOS\OMNI
node -v    # v24.18.x
.\deploy.ps1
# Copiar C:\NovaVersao para o servidor
```

**No servidor (PowerShell como Administrador)**

```powershell
nssm stop "OMNI-Sistema"

# Desinstalar Node 22 / instalar Node 24.18.x LTS (MSI x64)
node -v    # v24.18.x
where.exe node

# Opcional mas recomendado após troca de major do Node:
Remove-Item C:\Deploy\OMNI\node_modules -Recurse -Force -ErrorAction SilentlyContinue

cd C:\NovaVersao
PowerShell -ExecutionPolicy Bypass -File .\atualizar-servidor.ps1
# (para NSSM, copia backend/frontend, npm ci se lock mudou, migrations, IIS, start)

# Se Node foi trocado mas pacote ainda nao chegou:
# cd C:\Deploy\OMNI
# npm ci --omit=dev
# nssm start "OMNI-Sistema"
```

### Sequência alternativa (legado — mesma janela)

```powershell
# 1. Parar API (libera bcrypt.node para npm ci)
nssm stop "OMNI-Sistema"

# 2. Instalar Node 24 LTS (MSI x64) — substitui v22 no PATH
node -v   # esperado: v24.18.x

# 3. Reinstalar deps nativas do backend (mesmo caminho do NSSM)
cd C:\Deploy\OMNI
npm ci --omit=dev

# 4. Deploy habitual (builds + copia IIS + migrations + restart)
cd C:\NovaVersao
.\atualizar-servidor.ps1

# 5. Se só trocou Node e lock já estava no servidor:
nssm start "OMNI-Sistema"
```

### Validação pós-janela (via IIS, como o usuário)

| Teste | URL / ação |
|-------|------------|
| Frontend SPA | `https://<dominio>/omni` |
| API proxy | `https://<dominio>/api` |
| Swagger | `https://<dominio>/api/docs` |
| Login | Tela `/omni` + credencial real |
| Logs NSSM | `C:\Deploy\OMNI\logs\` |
| Diagnóstico opcional | `scripts\diagnostico.ps1` (IIS, ARR, serviço) |

### Rollback rápido

```powershell
nssm stop "OMNI-Sistema"
# Reinstalar Node 22.x via MSI
cd C:\Deploy\OMNI
npm ci --omit=dev
nssm start "OMNI-Sistema"
# Validar /omni e /api via IIS
```

---

## 11. Validação produção — pós Node 24 + deploy

> Marcar após janela no servidor (IIS + NSSM). Não commitar migração Node até esta seção OK.

### Infraestrutura

- [ ] Backup confirmado (IIS `omni`, `web.config`, `C:\Deploy\OMNI`, banco) — recomendado antes de próximas janelas
- [x] `node -v` no servidor → **v24.18.x** (`where.exe node`) — 2026-07-24
- [x] `nssm status "OMNI-Sistema"` → RUNNING após `atualizar-servidor.ps1` — 2026-07-24
- [x] `npm ci --omit=dev` em `C:\Deploy\OMNI` OK (via `atualizar-servidor.ps1`) — 2026-07-24

### URLs via IIS (como o usuário)

- [x] `/omni` — SPA carrega — 2026-07-24
- [x] Login produção — OK — 2026-07-24
- [ ] Navegação + CRUD (1 entidade) — não revalidado na janela Node 24 (OK em dev 2026-07-23)
- [ ] Tema claro/escuro — não revalidado na janela Node 24 (OK em dev 2026-07-23)
- [ ] `/api` — responde (proxy)
- [ ] `/api/docs` — Swagger
- [ ] Logs NSSM sem erro de módulo nativo (`C:\Deploy\OMNI\logs\`)

### Registro produção

| Campo | Valor |
|-------|--------|
| Data janela | 2026-07-24 |
| Node no servidor | v24.18.x |
| `deploy.ps1` / pacote NovaVersao | ☑ OK |
| `atualizar-servidor.ps1` | ☑ OK |
| Observações | Login produção OK; `node_modules` não removido manualmente — OK se `npm ci` no script |

---

## 12. Validação mobile — complemento (pré-commit)

| Etapa | Status |
|-------|--------|
| `deps:full:quick:no-lint` (stack web) | OK 2026-07-24 |
| `mobile`: npm ci + build + cap sync | OK 2026-07-24 |
| Login + fluxo manual (serve ou device) | OK 2026-07-24 (dev API; emulador + aparelho) |
| APK `assembleDebug` | OK 2026-07-24 |
| Plugins device (câmera, bio, áudio) | Câmera + áudio OK aparelho; biometria N/A |

**Validação manual sugerida (mobile):**

1. `cd mobile; npm run serve` → login contra API de dev.
2. Se usar device: apontar `environment` para API acessível; testar login + início vistoria.
3. Com Android Studio/rede: `cd mobile\android; .\gradlew.bat assembleDebug`.
