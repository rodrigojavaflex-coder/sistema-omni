# PLANO DE ATUALIZACAO DO NODE.JS (FUTURO)
Data: 31/01/2026
Status: Planejado (manter Node v22 por enquanto)

## Objetivo
Atualizar o Node.js para a versao LTS mais recente (v24) sem impactar
as migracoes de vistoria em producao.

## Premissas
- Node atual em producao: v22.
- Nao executar `install-omni.ps1` novamente.
- Atualizacao de Node sera manual no servidor.
- Docker nao faz parte do fluxo atual.

## Dependencias e pontos de risco
- Backend usa `bcrypt` (modulo nativo): pode exigir rebuild ou update.
- `@types/node` no backend precisa ser alinhado com v24.
- npm mais recente pode alterar o `package-lock.json`.

## Escopo da atualizacao (quando executar)
1. Repositorio
   - Atualizar `scripts/install-omni.ps1` para baixar Node v24 LTS.
   - Atualizar `deploy.ps1` (texto do README gerado) para v24.
   - Atualizar `backend/package.json` para `@types/node: ^24.x`.
   - Avaliar se `engines.node` deve subir para `>=24`.

2. Servidor (manual)
   - Instalar Node v24 LTS via MSI.
   - Validar `node -v` e `npm -v`.
   - Reiniciar o servico do backend.

3. Testes locais (Node v24)
   - Backend: `npm ci` + `npm run build` + `npm run start:prod`.
   - Frontend: `npm ci` + `npm run build -- --configuration production`.
   - Mobile: `npm ci` + `npm run build` + `npm run sync`.

## Sequencia recomendada (futura)
1. Finalizar migracoes de vistoria em producao.
2. Aplicar ajustes no repositorio (escopo acima).
3. Validar localmente com Node v24.
4. Atualizar Node no servidor (manual).
5. Rodar deploy normal e validar endpoints.

## Checklist de validacao
- API responde em `/api` e `/api/docs`.
- Frontend carrega em `/omni`.
- Logs do backend sem erros de modulo nativo.
- Mobile builda e sincroniza sem falhas.

## Rollback (rapido)
1. Parar servico: `nssm stop "OMNI-Sistema"`.
2. Reinstalar Node v22 (MSI).
3. Reinstalar dependencias no backend:
   - `npm install --production`
4. Iniciar servico: `nssm start "OMNI-Sistema"`.
5. Validar API e frontend.

## Observacoes
- Manter este plano atualizado sempre que houver mudancas
  nas dependencias principais.
