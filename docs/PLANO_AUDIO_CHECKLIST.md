# Plano de Desenvolvimento — Áudio no Checklist da Vistoria

## Objetivo
Adicionar captura e armazenamento de áudio nos itens do checklist da vistoria, sem transcrição, com foco em uso móvel (Ionic/Capacitor) e backend NestJS.

## Escopo
- Gravar áudio por item do checklist.
- Enviar áudio via API e armazenar no backend.
- Listar áudios existentes por item.
- Remover áudio de um item (opcional, mas recomendado).

## Fora de escopo (por enquanto)
- Transcrição de áudio (STT).
- Processamento assíncrono por fila.
- Armazenamento externo (S3/GCS/Azure) — opção futura.

## Requisitos funcionais
- O usuário consegue gravar e anexar áudio ao item atual do checklist.
- O áudio fica associado ao `ChecklistVistoria`.
- É possível visualizar a lista de áudios anexados ao item.
- O usuário pode remover áudio antes de finalizar a vistoria.

## Requisitos não funcionais
- Limite de tamanho e duração configuráveis (ex.: 10 MB e 90 s).
- Aceitar formatos `audio/m4a` (iOS) e `audio/webm` (Android).
- Respeitar status da vistoria: não permitir upload se finalizada/cancelada.

## Backend (NestJS + TypeORM)
### Entidade e migração
- Criar entidade `AudiosVistoria` vinculada ao `ChecklistVistoria`.
- Tabela sugerida: `audiosvistoria`
- Campos:
  - `idchecklistvistoria` (UUID, FK)
  - `nome_arquivo` (string)
  - `mime_type` (string)
  - `tamanho` (bigint)
  - `duracao_ms` (int, opcional)
  - `dados_bytea` (bytea)
  - `criado_em` / `atualizado_em` (BaseEntity)
- Criar migração reversível (up/down).

### DTOs
- `CreateChecklistAudioDto` (nome_arquivo, tamanho, mime_type, duracao_ms)
- `ChecklistAudioResumoDto` para retorno da listagem

### Endpoints
- `POST /vistoria/:id/checklist/:checklistId/audio`
  - Multipart, recebe 1..N arquivos
  - Valida status da vistoria e existência do checklist
- `GET /vistoria/:id/checklist/audio`
  - Retorna áudios por item
- `DELETE /vistoria/:id/checklist/:checklistId/audio/:audioId`
  - Remove áudio específico

### Regras
- Validar tamanho máximo e mime type permitido.
- Se o item for salvo novamente, manter os áudios existentes (não apagar).

## Mobile (Ionic/Capacitor)
### UI/UX
- Botão “Gravar áudio” e “Parar”.
- Lista de áudios do item com duração e ação de remover.
- Feedback de upload (loading e mensagens de erro).

### Gravação
- Usar `@capacitor-community/voice-recorder` ou plugin equivalente.
- Converter para `Blob` e enviar via `FormData`.
- Tratar permissões de microfone.

### Service
- Adicionar métodos no `VistoriaService`:
  - `uploadChecklistAudio(vistoriaId, checklistId, files)`
  - `listarChecklistAudio(vistoriaId)`
  - `removerChecklistAudio(vistoriaId, checklistId, audioId)`

## Web (Admin)
- Opcional: listar áudios no painel web da vistoria (somente leitura).

## Segurança e limites
- Limitar tamanho e quantidade de áudios por item.
- Validar extensão e mime type no backend.
- Considerar criptografia em repouso no banco (opcional).

## Entregáveis
- Migração + entidade de áudio.
- Endpoints REST documentados (Swagger).
- Integração no app mobile.
- Teste manual de gravação, upload e remoção.

## Testes recomendados
- Gravação curta e longa.
- Upload com item conforme/não conforme.
- Upload com vistoria finalizada/cancelada (deve falhar).
- Múltiplos áudios no mesmo item.
- Remoção de áudio específico.

## Próximos passos (futuro)
- Transcrição com STT.
- Armazenamento em blob externo.
- Processamento assíncrono e reprocessamento.
