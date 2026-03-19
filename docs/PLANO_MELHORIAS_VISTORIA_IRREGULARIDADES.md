# Plano: Melhorias – Vistoria e Irregularidades

**Data:** 10/03/2026  
**Objetivo:** Agrupar alterações e melhorias incrementais no fluxo de vistoria e irregularidades (backend, frontend web e mobile), mantendo um único plano genérico para evoluções futuras.

---

## Índice das alterações

| # | Alteração | Status |
|---|-----------|--------|
| 1 | [Irregularidades pendentes (informativo)](#alteração-1--irregularidades-pendentes-e-configuração-na-matriz) | **Implementado (sem flag na matriz)** |
| 2 | [Usabilidade: Bottom Sheets para áreas e componentes](#alteração-2--usabilidade-bottom-sheets-para-áreas-e-componentes) | Planejado |
| 3 | [Mídias unificadas (irregularidades_midias) e múltiplos áudios](#alteração-3--mídias-unificadas-irregularidades_midias-e-múltiplos-áudios) | Planejado |

---

## Alteração 1 — Irregularidades pendentes (informativo)

### Contexto

Hoje cada vistoria possui sua própria lista de irregularidades. Em uma nova vistoria do mesmo veículo:
- **Não** são mostradas irregularidades de vistorias anteriores.
- O usuário **pode** registrar novamente o mesmo componente/sintoma sem saber que já existe uma irregularidade não tratada.

Regra adotada (atual):
1. **Mostrar** ao usuário se já existe irregularidade (não resolvida) para aquele veículo + componente + sintoma (avisos nas telas).
2. **Não bloquear** o registro de nova irregularidade por essa pendência (sem flag na matriz; backend não retorna 400 por duplicidade pendente).

### Regras de negócio

- **Irregularidade pendente:** mesmo veículo, mesmo componente e mesmo sintoma, `resolvido = false`, em qualquer vistoria.
- **Removido:** campo `permite_nova_irregularidade_se_ja_existe` da tabela `matriz_criticidade` e de toda a UI/API.

### Backend: Matriz de Criticidade

- Matriz contém apenas gravidade, exige foto e permite áudio (sem controle de recorrência).

### Backend: Irregularidades pendentes do veículo

- **API:** `GET /veiculo/:idVeiculo/irregularidades-pendentes` — lista de irregularidades com `resolvido = false` daquele veículo (resumo: id, area, componente, sintoma, observacao, resolvido, atualizadoEm, idVistoria, dataVistoria).
- **Permissão:** compatível com leitura de vistoria/irregularidades.

### Backend: Criação de irregularidade

- Não há bloqueio por existir pendente no mesmo veículo/componente/sintoma.

### Mobile

- Serviço para `GET /veiculo/:idVeiculo/irregularidades-pendentes`; carregar ao iniciar/retomar vistoria.
- **Áreas:** exibir contagem/listagem de pendentes além das irregularidades da vistoria atual.
- **Componentes:** indicar "Já existe irregularidade pendente" por componente.
- **Seleção de sintoma:** exibir aviso se existe pendente em vistoria anterior; o usuário pode registrar normalmente.

### Testes

- Backend: matriz `false` → 400 ao criar duplicata; matriz `true` → permitir. API pendentes retorna apenas não resolvidas do veículo.
- Mobile: exibição de pendentes e bloqueio de registro conforme matriz.

---

## Alteração 2 — Usabilidade: Bottom Sheets para áreas e componentes

### Objetivo

Melhorar a usabilidade do app mobile exibindo as listas de **áreas** e de **componentes** por meio de **Bottom Sheets** em vez de telas cheias, reduzindo a profundidade de navegação e mantendo contexto visível. Aplicar e adaptar ao fluxo; se necessário, é possível reverter para o modelo atual (listas em tela cheia).

### Escopo

- **Áreas:** ao acessar o resumo da vistoria, a lista de áreas pode ser exibida em um Bottom Sheet (ex.: `ion-modal` com `initialBreakpoint` e `breakpoints` em estilo sheet).
- **Componentes:** ao selecionar uma área, a lista de componentes da área pode ser exibida em Bottom Sheet (em vez de navegar para uma nova página).
- Seleção de componente → segue para a tela de sintoma/registro de irregularidade (pode permanecer em tela cheia ou ser adaptada conforme usabilidade).

### Backend

- Nenhuma alteração necessária; as APIs atuais (áreas por modelo, componentes por área) permanecem.

### Mobile

- Implementar Bottom Sheets (Ionic: `ion-modal` em estilo sheet) para as listas de áreas e de componentes.
- Ajustar fluxo de navegação: abrir sheet em vez de push de página; ao selecionar item, fechar sheet e prosseguir (área → sheet componentes; componente → tela irregularidade).
- Garantir gestos (arrastar para fechar), acessibilidade e bom comportamento com teclado aberto quando houver campos no contexto.
- Se a experiência não for satisfatória, reverter para o fluxo atual (telas cheias com `ion-list`).

### Testes

- Validar abertura/fechamento dos sheets, seleção de área e de componente, e conclusão do fluxo até registrar irregularidade.
- Validar em dispositivos reais (Android/iOS).

---

## Alteração 3 — Mídias unificadas (irregularidades_midias) e múltiplos áudios

### Objetivo

- Unificar imagens e áudios em uma única tabela **`irregularidades_midias`** com coluna `tipo` (`imagem` | `audio`), permitindo **múltiplos áudios** por irregularidade (assim como já existem múltiplas imagens).
- Remover a tabela `irregularidades_imagens` e as colunas de áudio da tabela `irregularidades`.

### Modelagem

- **Nova tabela `irregularidades_midias`:**
  - `id`, `id_irregularidade`, `tipo` (enum: `'imagem'` | `'audio'`), `nome_arquivo`, `mime_type`, `tamanho`, `dados_bytea`; para áudio: `duracao_ms` (opcional).
- **Tabela `irregularidades`:**
  - Remover colunas: `audio_nome_arquivo`, `audio_mime_type`, `audio_tamanho`, `audio_duracao_ms`, `audio_dados_bytea`.
- **Remover tabela** `irregularidades_imagens`.

### Migration

- **Apenas alteração de esquema** (sistema não está em uso; não há migração de dados).
  - Criar tabela `irregularidades_midias` com os campos acima.
  - Dropar tabela `irregularidades_imagens`.
  - Remover as colunas de áudio da tabela `irregularidades`.

### Backend

- Nova entidade `IrregularidadeMidia` (ou equivalente) mapeada para `irregularidades_midias`; remover/refatorar `IrregularidadeImagem`.
- Entidade `Irregularidade`: relação `OneToMany` com midias; remover campos de áudio.
- DTOs e endpoints: listar midias da irregularidade (ou por tipo); upload de imagem(s); upload de áudio(s); remoção de mídia por id. Manter compatibilidade com o que o mobile consome (ex.: listagem de imagens e de áudios para exibição e upload).
- Ajustar validações (ex.: `exige_foto` na matriz) para considerar presença de mídia do tipo imagem.

### Mobile

- Tela de irregularidade: permitir **adicionar e remover vários áudios** (análogo às fotos); exibir lista de áudios gravados; ao salvar, enviar todos os áudios (upload por mídia ou em lote conforme API).
- Ajustar chamadas de API para os novos endpoints de midias (imagens e áudios sob a mesma tabela/recurso).

### Frontend web (admin)

- Se houver tela de detalhe/consulta de irregularidade com imagens e áudio, exibir lista de midias (imagens e áudios) a partir de `irregularidades_midias`.

### Testes

- Backend: criar irregularidade, anexar múltiplas imagens e múltiplos áudios; listar e remover midias.
- Mobile: gravar vários áudios, anexar fotos, salvar irregularidade e validar exibição e reprodução.

---

## Entregáveis gerais

- Migrations, entidades, DTOs e endpoints conforme cada alteração.
- Ajustes no frontend web (admin) e no app mobile conforme cada alteração.
- Testes e validação por alteração.
- Documentação atualizada (este plano e referências no plano de reestruturação).

---

## Referências

- [PLANO_REESTRUTURACAO_VISTORIA_IRREGULARIDADES.md](./PLANO_REESTRUTURACAO_VISTORIA_IRREGULARIDADES.md) — contexto da estrutura de vistoria por irregularidades.
