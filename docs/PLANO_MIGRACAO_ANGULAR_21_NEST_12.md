# Plano de migração — Angular 21 + NestJS 12

> Última revisão: 2026-11-24  
> Status: **Planejado** — não executar até o pacote de segurança atual (Angular 20.3.35 / Nest 11.2.x / xlsx CDN / nodemailer 10) estar commitado e estável em homologação/prod.  
> Escopo: **web (frontend IIS) + API (Nest NSSM)**; mobile em fase própria.

## Objetivo

Atualizar a stack OMNI **uma major por vez**, sem big-bang:

1. **Angular 20 → 21** (frontend web; depois mobile)
2. **NestJS 11 → 12** (backend)

Motivo: evitar dívida de versão (LTS Angular 20 encerra ~**2026-11-28**), manter patches de segurança e peeres alinhados, sem acumular salto 20→22 / 11→13.

## Fora de escopo (neste plano)

- `npm audit fix --force` no monorepo
- Zerar residual moderate de toolchain (`glob`/`minimatch` via CLI) ou `exceljs`→`uuid` (avaliar depois, com override controlado)
- Capacitor major / Ionic major (só alinhar Angular do mobile após web estável)
- Migrar o backend para ESM próprio (Nest 12 permite continuar CommonJS via `require(esm)`)

## Estado atual (baseline)

| Camada | Versão | Node |
|--------|--------|------|
| Frontend web | Angular **20.3.35** + CLI/build **20.3.43** | Dev **24.x** |
| Backend | Nest **11.2.11** + CLI **11**, TypeScript **5.7** | Prod NSSM (Node 24 após Fase 3 Node) |
| Mobile | Angular **20.3.20** + Capacitor **8** | — |
| Produção | IIS (`/omni`) + proxy `/api` → NSSM `:8080` | ver `PLANO_ATUALIZACAO_NODE.md` |

Pré-requisitos já atendidos ou em curso:

- [x] Security patch Angular 20.3.35 (web)
- [x] Security patch Nest 11.2.x + nodemailer 10 + multer 2.5 + undici
- [x] `xlsx` via CDN SheetJS 0.20.3
- [ ] Commit + deploy do pacote de segurança (bloqueante para iniciar Fase A)
- [ ] Node 24 em produção confirmado (Nest 12 exige ≥20.19 / ≥22.12; OMNI mira 24)

## Princípios

1. **Uma major por PR/janela** — Angular e Nest **não** sobem no mesmo deploy.
2. **Sempre patch mais recente da major alvo** (ex.: Angular 21.2.x LTS, não 21.0.0).
3. **Backup de locks** antes de mutar (`scripts/verify-stack-deps.mjs` / `.omni-deps-backup`).
4. **Rollback** = restaurar branch/locks + rebuild + `atualizar-servidor.ps1`.
5. Validar com `npm audit --omit=dev` (runtime), não obsessão por zerar audit total.

## Ordem das fases

```text
[0] Congelar segurança atual
    ↓
[A] Angular 20 → 21  (frontend web)
    ↓
[A2] Angular 20 → 21 (mobile) — após A estável
    ↓
[B] Nest 11 → 12     (backend)
    ↓
[C] Residuais opcionais (uuid override / exceljs)
```

Intervalo sugerido entre A e B: **1–2 sprints** com smoke em homologação (não meses).

---

## Fase 0 — Congelar baseline (bloqueante)

**Critérios de saída**

- [ ] Diff de segurança (front + back) commitado
- [ ] Build prod front OK; build back OK
- [ ] Deploy homologação ou prod com smoke: login, 1 CRUD, documentos, 1 fluxo irregularidade
- [ ] Tag ou nota: `baseline-pre-angular21`

**Não iniciar Fase A sem isso.**

---

## Fase A — Angular 20 → 21 (frontend web)

### Contexto / riscos

| Tema | Impacto OMNI | Mitigação |
|------|--------------|-----------|
| Zoneless default em apps **novos** | Baixo — app já usa `provideZoneChangeDetection` em `app.config.ts` | Manter zone.js + provider até decisão explícita de zoneless |
| `typeCheckHostBindings` default | Médio — erros de compile em host bindings | Corrigir o que o compiler apontar; não desligar sem necessidade |
| Karma permanece em projetos existentes | Baixo | Não migrar para Vitest nesta fase |
| CDK / google-maps | Médio | Atualizar `@angular/cdk` e `@angular/google-maps` junto (21.x) |
| Budget CSS (`irregularidade-fluxo-list`) | Baixo | Warning já conhecido; não elevar error sem necessidade |
| LTS Angular 20 | **Alto calendário** | Preferir janela curta pós-baseline |

### Pré-voo

- [ ] Node **24.x** na máquina de build
- [ ] TypeScript **~5.9** (já no front; Angular 21 exige ≥5.9 &lt;6 — manter 5.9 nesta fase)
- [ ] Working tree limpa (só branch da migração)
- [ ] Branch: `chore/angular-21`

### Execução (resumo)

```bash
cd frontend
# Opcional: dry-run / relatório
npx ng update @angular/core@^21 @angular/cli@^21 --dry-run

npx ng update @angular/core@^21 @angular/cli@^21
npx ng update @angular/cdk@^21
# google-maps / demais @angular/* alinhados à 21.x
npm install
npm run build -- --configuration production
```

- [ ] Revisar diffs gerados pelos schematics (`angular.json`, `tsconfig`, `main`/`app.config`)
- [ ] Garantir `provideZoneChangeDetection` permanece (não remover zone.js nesta fase)
- [ ] Alinhar pins: core/compiler/forms/router/platform-browser/compiler-cli + build/cli na **mesma** 21.x patch
- [ ] Manter `xlsx` no CDN 0.20.3 (não voltar ao npm 0.18.5)

### Critérios de aceite (web)

- [ ] `ng build --configuration production` OK
- [ ] Login + tema claro/escuro
- [ ] Listagens com export Excel (exceljs) e PDF (jspdf)
- [ ] Documentos: upload, preview `.xlsx` / `.xls`, link público (RN-DOC-009)
- [ ] Fluxo irregularidades: Tratamento → Manutenção → Validação (telas principais)
- [ ] Controle de escala: filtros, grade, alerta retido
- [ ] Google Maps (se usado na sessão de teste)
- [ ] `npm audit --omit=dev`: sem high/critical novos; residual exceljs/uuid aceito

### Deploy

- [ ] `deploy.ps1` / `atualizar-servidor.ps1` (só frontend se back inalterado)
- [ ] Validar `/omni` via IIS + API intacta

### Rollback A

1. Reverter branch / restaurar `frontend/package.json` + lock da baseline  
2. Rebuild + redeploy front  
3. Hard refresh no browser (hash de assets)

---

## Fase A2 — Angular 21 (mobile)

**Depende de:** Fase A estável ≥ alguns dias.

| Item | Nota |
|------|------|
| Mobile hoje | Angular **20.3.20** (atrasado vs web) |
| Capacitor 8 / Ionic 7 | Validar peeres com Angular 21 antes do bump |
| AGP9 / proguard patch | Manter `postinstall` / `fix-agp9-proguard.mjs` |

### Critérios de aceite (mobile)

- [ ] `ng build` + `cap sync` + `assembleDebug`
- [ ] Login, biometria (se aplicável), câmera, áudio, pesquisa
- [ ] Não misturar com Nest 12 na mesma janela

---

## Fase B — NestJS 11 → 12 (backend)

### Contexto / riscos

| Tema | Impacto OMNI | Mitigação |
|------|--------------|-----------|
| Pacotes Nest **ESM-only** | Médio — app pode permanecer CJS com Node `require(esm)` | Node ≥20.19 (OMNI: 24); **não** converter o projeto para ESM nesta fase |
| TypeScript **6** (peer do schematics/CLI 12) | Alto em tooling | Subir TS 6 + `typescript-eslint` / ts-node compatíveis; validar `nest build` + migrations |
| `nest upgrade` | Preferir ao ncu manual | Rodar `--dry-run` primeiro |
| `@nestjs/config` validation options | Médio se houver Joi/Zod no register | Revisar `ConfigModule` / `registerAs` |
| `@Optional()` em subclasses | Médio | Revisar providers que estendem classes Nest |
| Swagger / Schedule / TypeORM / Passport / JWT | Médio | Todos `@nestjs/*` na major 12 **juntos** |
| `bcrypt` nativo | Baixo se Node já 24 | `npm ci --omit=dev` no servidor após deploy |
| Multer / Express 5 (se vier com adapter 12) | Médio (uploads) | Testar upload documentos + anexos irregularidade |

Referência oficial: [Nest migration guide](https://docs.nestjs.com/migration-guide) · compat: Nest 12 → Node 20.19+ / 22.12+.

### Pré-voo

- [ ] Fase A (web) em prod/homolog estável
- [ ] Node **24.x** no servidor NSSM confirmado (`node -v`)
- [ ] Branch: `chore/nestjs-12`
- [ ] Backup `.env` / não commitar segredos
- [ ] `nest upgrade --dry-run` (ou equivalente CLI local atualizado)

### Execução (resumo)

```bash
cd backend
# Atualizar CLI local + TypeScript 6 conforme guia Nest
npm i -D @nestjs/cli@^12 @nestjs/schematics@^12 typescript@^6

npx nest upgrade --dry-run
npx nest upgrade

npm run build
npm run start:dev   # smoke local
```

- [ ] Conferir relatório do `nest upgrade` (itens não migrados automaticamente)
- [ ] Ajustar ESLint / tsconfig se TS 6 exigir
- [ ] Rodar `migration:run` em **dev** (não gerar migration só por upgrade)
- [ ] Swagger `/api/docs` abre
- [ ] Jobs `@nestjs/schedule` (poll BRT / telemetria / escala) sobem sem erro de bootstrap

### Critérios de aceite (API)

- [ ] Login JWT + refresh (se houver)
- [ ] Reset de senha (nodemailer 10)
- [ ] Upload multipart (documentos / evidências)
- [ ] Envio e-mail irregularidades + PDF
- [ ] Endpoints BRT/ERP (ou mock) sem regressão de contrato
- [ ] Escala: sync / telemetria / troca veículo (1 fluxo)
- [ ] `npm audit --omit=dev`: sem high/critical novos
- [ ] `npm ci --omit=dev` + `start:prod` OK (simula servidor)

### Deploy

- [ ] Janela dedicada; `nssm stop` → copiar build → `npm ci --omit=dev` → migrations se houver → `nssm start`
- [ ] Validar via IIS: `/api`, `/api/docs`, login na SPA

### Rollback B

1. `nssm stop`  
2. Restaurar artefato/locks Nest 11 da baseline  
3. `npm ci --omit=dev` + start  
4. Validar `/api` + login  

---

## Fase C — Residuais de audit (opcional)

Só após A + B estáveis.

| Item | Ação | Risco |
|------|------|-------|
| `exceljs` → `uuid` | `overrides`/`resolutions` para `uuid@^11.1.1` | Médio — testar export + preview |
| glob/minimatch CLI | Aceitar ou esperar patch na linha Angular 21 CLI | Baixo em runtime |
| TypeORM glob | Aceitar até TypeORM patch; **nunca** `--force` para 1.x | — |

---

## Matriz de validação manual (smoke curto)

Usar em cada fase (marcar o que couber):

| # | Fluxo | RN / área | A (web) | B (API) |
|---|-------|-----------|---------|---------|
| 1 | Login + tema | RN-AUTH | ☐ | ☐ |
| 2 | CRUD cadastro leve | — | ☐ | ☐ |
| 3 | Documentos + preview Excel | RN-DOC-002/009 | ☐ | ☐ |
| 4 | Irregularidades fila → manutenção | RN-VIS-006 | ☐ | ☐ |
| 5 | Escala / retido | RN-ESC-005 | ☐ | ☐ |
| 6 | E-mail reset ou OS | RN-AUTH / VIS | ☐ | ☐ |
| 7 | Upload arquivo | — | ☐ | ☐ |

## Riscos residuais (aceitos até Fase C)

- Audit total do front ainda lista moderate de **devDependency** (CLI)
- `exceljs`/`uuid` moderate em prod audit
- Mobile pode ficar 1 sprint atrás do web na 21

## Documentos relacionados

- `docs/PLANO_ATUALIZACAO_NODE.md` — Node 24 / IIS / NSSM  
- `docs/CHECKLIST_NODE_24_DEV.md` — padrão de checklist  
- `scripts/verify-stack-deps.mjs` — backup/audit/full  
- `scripts/atualizar-servidor.ps1` — deploy produção  

## Histórico

| Data | Mudança |
|------|---------|
| 2026-11-24 | Plano inicial: sequência A (Angular 21 web) → A2 (mobile) → B (Nest 12) → C (residuais); baseline segurança pré-requisito |
