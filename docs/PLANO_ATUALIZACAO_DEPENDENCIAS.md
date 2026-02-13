# PLANO DE ATUALIZACAO DE DEPENDENCIAS (BACKEND/FRONTEND)
Data: 31/01/2026
Objetivo: aplicar correcoes do npm audit com risco minimo.

## Premissas
- Manter Node v22 por enquanto.
- Usar apenas `npm audit fix` (sem `--force`).
- Validar cada base separadamente.

## Preparacao
1. Garantir worktree limpo (ou separar commit atual).
2. Fazer backup local do `package-lock.json` de cada base.

## Backend (NestJS)
1. Rodar `npm audit` em `backend`.
2. Executar `npm audit fix` em `backend`.
3. Rodar:
   - `npm run build`
   - `npm run start:prod` (teste rapido)
4. Validar endpoints basicos (ex.: `/api`, `/api/docs`).

## Frontend (Angular)
1. Rodar `npm audit` em `frontend`.
2. Executar `npm audit fix` em `frontend`.
3. Rodar `npm run build -- --configuration production`.
4. Validar carregamento do app no browser.

## Itens conhecidos (risco)
- Backend: vulnerabilidade via `lodash` em dependencias Nest.
  - Evitar `npm audit fix --force`.
- Frontend: `xlsx` sem fix disponivel (alto risco).
  - Avaliar troca da lib no futuro se necessario.

## Avaliacao para atualizacao total (com impacto)
### Backend
- `npm audit fix --force` pode instalar versoes antigas/incompativeis do Nest
  (o audit atual sugere `@nestjs/config@1.1.5`, que e breaking).
- Impacto esperado: alto (possivel quebra de config, injecoes e bootstrap).
- Recomendacao: nao aplicar update total sem revisao manual de versoes.

### Frontend
- `npm audit fix --force` pode atualizar `@angular/cli` e toolchain
  para versoes fora da linha atual do Angular 20.
- Impacto esperado: medio/alto (possivel quebra de build e configs).
- Recomendacao: evitar `--force`; atualizar manualmente por versao se preciso.

### Dependencias sem fix
- `xlsx` permanece com risco alto sem correcoes disponiveis.
- Impacto de atualizar total: nao resolve `xlsx`, mas aumenta risco geral.

### Conclusao (update total)
- Nao recomendado neste momento.
- Priorizar correcoes seguras (sem `--force`) e planejar troca de `xlsx`
  quando houver janela de manutencao.

## Rollback rapido
1. Reverter `package.json` e `package-lock.json` das bases afetadas.
2. Rodar `npm ci` na base revertida.
3. Repetir build/teste.

## Criterio de sucesso
- Builds das bases concluem sem erro.
- API responde e frontend carrega corretamente.
