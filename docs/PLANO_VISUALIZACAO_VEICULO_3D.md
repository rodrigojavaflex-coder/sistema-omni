# Plano: Visualização 3D do veículo (marcações de irregularidade)

**Data:** 28/09/2026  
**Status:** Adiado (protótipo removido do app mobile)  
**Objetivo:** Permitir visualizar em 3D o veículo (articulado / biarticulado) e, em fase posterior, projetar as marcações já gravadas no mapa 2D (`idVista` + `posXPct`/`posYPct`) sem alterar o fluxo de registro.

**Escopo futuro:** App Mobile (Ionic) e/ou Web; assets GLB; viewer 3D; opcionalmente calibração vista 2D → face 3D.  
**Fora de escopo (mantém RN-VIS-009):** marcação em 3D; GPS/perícia; envio de coordenada ao ERP; substituição do mapa 2D operacional/PDF.

**Relacionado:** RN-VIS-009 (`docs/regras-negocio.md`), `docs/PLANO_MAPA_AVARIA_MODELO.md` (mapa 3D já listado como fora de escopo do mapa 2D).

---

## Contexto

O OMNI já persiste marcações aproximadas em vistas JPEG do modelo (`exigeMarcacaoMapa`, overlay percentual). Surge interesse em **só visualizar** o veículo em 3D (e depois pins das irregularidades), sem gravar ponto 3D.

Em set/2026 foi feito um **protótipo gratuito** no mobile (`model-viewer` + GLBs procedurais articulado/biarticulado × verde/azul). O protótipo foi **retirado do app** para não poluir a Home/produção; este documento registra o que validar e como retomar.

---

## Decisões (já alinhadas no protótipo)

| Tema | Decisão |
|------|--------|
| Marcação | Continua só no mapa **2D** (fonte da verdade) |
| 3D | Viewer de leitura; pins = fase 2 |
| Custo de ferramenta | Preferir stack gratuita (`@google/model-viewer` Apache 2.0 ou Three.js MIT) |
| Tipos | Articulado e biarticulado |
| Cores | Duas paletas de referência (verde lima/escuro; azul BRT branco/faixa/royal) |
| Assets | GLB embutido ou por `modelo_veiculo` (fase posterior) |
| Auto-rotate | Desligado (usuário controla orbit/zoom) |

---

## O que o protótipo chegou a validar

- Viewer no Ionic com orbit/zoom
- Seletor tipo (articulado / biarticulado) e cor (verde / azul)
- GLBs procedurais low-poly (frente suave, sanfona no gabarito, rodas no eixo do veículo)
- Zero custo de licença de software

**Limitações observadas:** modelo procedural ≠ frota real; pins 2D→3D não implementados; chunk do viewer pesado (~2 MB).

---

## Fases sugeridas (quando retomar)

### Fase A — Viewer limpo (sem Home de demo)
1. Tela acessível por fluxo de negócio (ex.: pendências/histórico do veículo), não botão genérico na Home
2. `@google/model-viewer` + GLBs (procedural ou assets CC0/comerciais)
3. Seletores tipo/cor ou vínculo a `modelo_veiculo`
4. Tema claro/escuro; sem auto-rotate

### Fase B — Assets reais
1. GLB articulado e biarticulado mais fiéis (compra / artista / conversão)
2. Cadastro opcional de asset por modelo de veículo
3. Orçamento e licença comercial documentados

### Fase C — Pins das marcações 2D
1. Calibração `id_vista` / catálogo → face/UV do GLB
2. Projetar `posXPct`/`posYPct` como hotspots (CSS2D ou sprites)
3. Clique no pin → detalhe da irregularidade
4. **Não** alterar create/update de irregularidade nem PDF 2D

---

## Critérios de aceite (quando implementar)

- Visualização 3D não quebra mapa 2D, SOS nem PDF (RN-VIS-009 / RN-VIS-007)
- Orbit/zoom manuais; tema claro e escuro ok
- Articulado e biarticulado disponíveis (ou mapeados ao modelo do veículo)
- Fase C: pin coerente com a marcação 2D (aproximação visual, não perícia)
- Sem migration de coordenadas 3D na v1 de pins (só calibração + overlay)

---

## Impacto técnico (checklist)

| Item | Ação |
|------|------|
| Dependência | `@google/model-viewer` (ou Three.js) |
| Assets | `public/3d/*.glb` + licença |
| Rotas / permissão | Definir entrada no fluxo real (não demo na Home) |
| Backend | Nenhuma mudança na Fase A; Fase B pode exigir campo de asset no modelo |
| RN | Atualizar `docs/regras-negocio.md` se pins 3D virarem regra oficial |

---

## Referências do protótipo removido (histórico)

Código e assets removidos do mobile em 28/09/2026:

- Página `prototipo-veiculo-3d`
- Rota `/prototipo/veiculo-3d` e botão na Home
- `public/3d/*.glb`, script `scripts/gerar-onibus-3d.mjs`
- Dependências `@google/model-viewer` e `three` (dev)

Para regenerar GLBs procedurais no futuro, recriar script Three.js + `GLTFExporter` com gabarito articulado/biarticulado e paletas verde/azul.

---

## Histórico

| Data | Evento |
|------|--------|
| 2026-09-25 | Protótipo inicial (viewer + GLB único procedural) |
| 2026-09-28 | Tipos articulado/biarticulado × cores; ajustes de frente/rodas/sanfona |
| 2026-09-28 | Protótipo removido do mobile; plano adiado neste documento |
