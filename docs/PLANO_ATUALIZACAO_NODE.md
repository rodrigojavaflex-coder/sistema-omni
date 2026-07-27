# Plano de atualização do Node.js — OMNI

> Última revisão: 2026-07-23  
> Status: **Fase 1 concluída (dev)** — produção permanece v22 até Fase 3

## Objetivo

Migrar a stack OMNI de **Node 22** para **Node 24 LTS (Active LTS)**, começando pelo ambiente de desenvolvimento e só depois pelo servidor de produção.

## Contexto atual

| Ambiente | Node | Observação |
|----------|------|------------|
| Dev (máquina local) | **v24.18.0** | Validado 2026-07-23 (builds + login) |
| Produção (Windows + **IIS** + NSSM) | v22 | Upgrade **manual do Node** (NSSM/backend); IIS serve estático + proxy |
| Mobile (Capacitor) | — | **Fora de produção**; testar build/sync em dev, sem impacto no servidor |
| `install-omni.ps1` | — | Rodado uma vez na instalação inicial; **não executar de novo** no servidor estável |
| Deploy rotineiro | `atualizar-servidor.ps1` | Copia build → IIS + backend; migrations; reinicia NSSM — **não altera versão do Node** |

## Arquitetura em produção (IIS + NSSM)

A aplicação **não roda Node dentro do IIS**. O IIS cumpre dois papéis; o backend NestJS roda como serviço Windows via NSSM.

| Camada | Onde | Função | Impacto Node 24 |
|--------|------|--------|-----------------|
| **Frontend (Angular)** | IIS — `C:\inetpub\wwwroot\omni` | Arquivos estáticos; SPA em `/omni` | Nenhum — só deploy do build (`ArquivosFrontend`) |
| **Proxy reverso** | IIS — `C:\inetpub\wwwroot\web.config` | `/api/*` → `http://localhost:8080/api/*` (ARR) | Nenhum — continua apontando para a porta do NSSM |
| **Backend (NestJS)** | NSSM — `C:\Deploy\OMNI` | API na porta **8080** (`OMNI-Sistema`) | **Sim** — MSI Node 24 + `npm ci --omit=dev` + restart NSSM |

URLs típicas de validação pós-deploy (Fase 3):

- Frontend: `https://…/omni` (ou domínio configurado)
- API via IIS: `https://…/api` e `/api/docs`
- API direta (local no servidor): `http://localhost:8080/api`

> Trocar Node **não exige** reinstalar IIS nem rodar `install-omni.ps1` de novo. Exige parar NSSM, instalar Node 24, `npm ci` no backend e reiniciar o serviço; depois validar proxy IIS + login.

## Compatibilidade da stack (Node 24)

| Componente | Versão OMNI | Suporte Node 24 |
|------------|-------------|-----------------|
| Angular / CLI | 20.3.x | ✅ (`>=24.0.0` declarado no CLI) |
| NestJS | 11 | ✅ (`>=20`) |
| Capacitor CLI | 8 | ✅ (`>=22`; sem teto documentado) |
| `bcrypt` | 6 | ⚠️ módulo nativo — exige `npm ci` após trocar Node |
| `pdfkit` | 0.18 | ✅ JS puro |

## Divisão de responsabilidades no servidor

| Ação | Script / forma |
|------|----------------|
| Deploy de código (backend, frontend, IIS) | `atualizar-servidor.ps1` |
| Parar / iniciar serviço | `atualizar-servidor.ps1` ou `nssm stop/start` |
| Instalar ou **subir versão** do Node | **Manual** (MSI Node 24) |
| Instalar NSSM / criar serviço | `install-omni.ps1` (somente bootstrap inicial) |
| Rebuild de deps nativas após troca de Node | Manual: `cd C:\Deploy\OMNI && npm ci --omit=dev` |

## Fases

### Fase 1 — Desenvolvimento (concluída 2026-07-23)

1. Atualizar repositório (`engines`, `@types/node`, `.nvmrc`, scripts de referência).
2. Instalar Node **24.18.x LTS** na máquina de dev ([nodejs.org](https://nodejs.org/)).
3. Seguir [`CHECKLIST_NODE_24_DEV.md`](./CHECKLIST_NODE_24_DEV.md).
4. Validar backend, frontend e mobile (build) localmente.

**Critério de saída:** builds OK, login/API principais OK, checklist dev marcado — **atendido**.

Itens opcionais adiados (PDF, e-mail, Excel, mapas, plugins mobile em device): ver checklist seção 8. CRUD, navegação e tema validados manualmente em 2026-07-23.

### Fase 2 — Repositório e CI

**Status:** artefatos prontos no working tree; **commit pendente** (decisão do responsável).

- [x] `package.json` raiz: `engines.node >=24.0.0`
- [x] `backend/package.json`: `@types/node ^24`
- [x] `.nvmrc` com `24.18.0`
- [x] `install-omni.ps1` e `deploy.ps1` referenciam Node 24
- [x] `deps:full:quick:no-lint` para validação Windows
- [x] CI/GitHub Actions — N/A (sem workflows)
- [ ] Commit + push dos arquivos acima + `backend/package-lock.json`

### Fase 3 — Produção (janela dedicada)

Executar **somente após Fase 1 concluída** e backup confirmado.

**Contexto:** frontend no **IIS** (`/omni`); API via **proxy IIS → NSSM** (porta 8080). Só o processo NSSM usa Node.

1. Agendar janela (baixo tráfego).
2. `nssm stop "OMNI-Sistema"`.
3. Instalar Node 24 LTS via MSI no servidor (PATH global — usado pelo serviço NSSM).
4. Confirmar: `node -v` → v24.x (no mesmo contexto do serviço, se possível).
5. `cd C:\Deploy\OMNI` → `npm ci --omit=dev`.
6. Deploy habitual (`atualizar-servidor.ps1`) ou só `nssm start` se código já estiver atual.
7. Validar **via IIS** (como o usuário acessa):
   - Frontend `/omni` (static + fallback SPA)
   - API `/api` e `/api/docs` (proxy → localhost:8080)
   - Login (bcrypt)
   - Logs em `C:\Deploy\OMNI\logs\`
8. (Opcional) `scripts/diagnostico.ps1` — IIS, ARR, pasta `omni`, serviço NSSM.

**Não executar** `install-omni.ps1` no servidor em produção (salvo bootstrap novo).

## Rollback (produção)

1. `nssm stop "OMNI-Sistema"`.
2. Reinstalar Node **22.x** (MSI).
3. `cd C:\Deploy\OMNI` → `npm ci --omit=dev`.
4. `nssm start "OMNI-Sistema"`.
5. Validar API e frontend **via IIS** (`/omni`, `/api`).

## Riscos e mitigação

| Risco | Mitigação |
|-------|-----------|
| `bcrypt` incompatível com ABI do Node 24 | `npm ci` limpo; testar login |
| Lock files alterados | Commitar apenas após `--full` validado |
| Servidor com Node diferente do dev | Fixar `.nvmrc` / documentar versão no README de deploy |
| Confundir upgrade Node com reconfig IIS | Node 24 afeta só NSSM/backend; IIS + `web.config` permanecem |
| Proxy IIS quebrado após restart | Validar `/api` via URL pública e `diagnostico.ps1` (ARR, web.config) |
| Rodar `install-omni.ps1` por engano | Plano e README deixam explícito: só bootstrap |

## Documentos relacionados

- [`CHECKLIST_NODE_24_DEV.md`](./CHECKLIST_NODE_24_DEV.md) — passo a passo e testes no dev
- [`GUIA_OPERACAO_AGENTE.md`](./GUIA_OPERACAO_AGENTE.md) — operação geral
- `scripts/atualizar-servidor.ps1` — fluxo de deploy em produção

## Histórico

| Data | Mudança |
|------|---------|
| 2026-01-31 | Plano inicial (adiado; manter v22) |
| 2026-07-23 | Fase 1 dev concluída: Node 24.18.0, builds OK, login manual OK, lock backend pendente commit |
