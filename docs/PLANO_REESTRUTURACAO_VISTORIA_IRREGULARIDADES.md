# Plano de Reestruturação: Vistoria por Irregularidades

## Objetivo
Reestruturar o fluxo de vistoria para registrar apenas itens **não conformes** (irregularidades), com catálogo organizado por **Áreas Vistoriadas**, **Componentes**, **Sintomas** e **Matriz de Criticidade**, reaproveitando componentes entre áreas/modelos.

## Escopo
- Remover o modelo antigo de checklist baseado em `itensvistoriados`/`checklistsvistoria`.
- Implementar catálogo novo com filtro por **modelo do veículo**.
- Manter criação/finalização de vistorias já existentes.
- Foco na geração e consulta de **irregularidades**.

## Regras de Negócio
- Vistoria pode ser finalizada **sem irregularidades**.
- `gravidade` da matriz possui **VERDE/AMARELO/VERMELHO**.
- `exige_foto` é configurado pelo usuário na matriz (independente da gravidade).
- Um componente pode ser reutilizado em áreas de modelos diferentes (N:N).

---

## Fase 0 — Alinhamento e validações iniciais
- Definir que **Áreas Vistoriadas** podem atender **vários modelos** (vínculo N:N).
- Definir tabela **`irregularidades_imagens`** para anexos de irregularidade (mesma lógica de compressão/armazenamento).

---

## Fase 1 — Modelagem de dados (DB + entidades)

### Tabelas novas
1) `areas_vistoriadas`
- `id`, `nome`, `ordem_visual`, `ativo`

2) `areas_modelos` (N:N)
- `id`, `area_id`, `modelo` (string vinda de `veiculos.modelo`)

3) `componentes`
- `id`, `nome`, `ativo`

4) `areas_componentes` (N:N)
- `id`, `area_id`, `componente_id`, `ordem_visual` (opcional)

5) `sintomas`
- `id`, `descricao`, `ativo`

6) `matriz_criticidade`
- `id`, `componente_id`, `sintoma_id`, `gravidade`, `exige_foto`, `permite_audio`

7) `irregularidades`
- `id`, `vistoria_id`, `area_id`, `componente_id`, `sintoma_id`, `observacao`, `resolvido`, `audio`
- **Imagens**: tabela `irregularidades_imagens` (suporte a múltiplas fotos por irregularidade)


### Remoção do legado
- Dropar `itensvistoriados` e `checklistsvistoria` (remover sem validação de dados).
- Remover entidades/serviços/rotas correspondentes.

---

## Fase 2 — Backend (NestJS)

### Entidades e DTOs
- Criar entidades e DTOs para todas as novas tabelas.
- Criar enum `Gravidade` com `VERDE | AMARELO | VERMELHO`.
- DTOs com validações (`class-validator`) e `@ApiProperty`.

### Endpoints
**Catálogo**
- `GET /areas?modelo_id=...`
- `GET /componentes?area_id=...`
- `GET /sintomas`
- `GET /matriz-criticidade?componente_id=...`

**Irregularidades**
- `POST /vistorias/:id/irregularidades`
- `GET /vistorias/:id/irregularidades`
- `PATCH /irregularidades/:id` (observacao/resolvido)
- `POST /irregularidades/:id/imagens` (se usar imagens separadas)

### Validações de integridade
- Componente deve pertencer à área.
- Matriz deve existir para `componente + sintoma`.
- Se `exige_foto = true`, bloquear salvar sem foto.

---

## Fase 3 — Frontend Web (Admin)

### Cadastros
1) **Modelos de Veículo**
2) **Áreas Vistoriadas** (por modelo)
3) **Componentes**
4) **Vínculo Área ↔ Componente**
5) **Sintomas**
6) **Matriz de Criticidade**

### Listagens
- Áreas por modelo
- Componentes por área
- Matriz por componente

---

## Fase 4 — App Mobile (Ionic)

### Fluxo novo
1) **Resumo de Áreas**
   - listar áreas do modelo do veículo
   - mostrar contador de irregularidades por área

2) **Componentes da Área**
   - listar componentes vinculados à área
   - selecionar componente para registrar irregularidade

3) **Seleção de Sintoma**
   - listar sintomas disponíveis na matriz do componente
   - exibir gravidade
   - exigir foto quando `exige_foto = true`

4) **Salvar Irregularidade**
   - persistir e retornar para a área

5) **Finalizar Vistoria**
   - permitir finalizar sem irregularidades

---

## Fase 5 — Remoção do legado
- Remover telas/serviços do checklist antigo no mobile.
- Remover endpoints e serviços do backend associados a `itensvistoriados` e `checklistsvistoria`.

---

## Fase 6 — Testes e validação
- Criar vistoria sem irregularidades.
- Criar irregularidade com e sem foto.
- Validar filtros por modelo (áreas e componentes).
- Validar matriz e bloqueio de foto.

---

## Entregáveis
- Migrations com `up/down`.
- Novas entidades + DTOs + controllers/services.
- Telas de cadastro web.
- Fluxo mobile por Áreas/Componentes/Sintomas.
