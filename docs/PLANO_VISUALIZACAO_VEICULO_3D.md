# Plano: Visualização 3D do veículo (marcações de irregularidade)

**Data:** 28/09/2026  
**Status:** Em teste no mobile (viewer retomado; articulado verde = Meshy ~3 MB)  
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
| 3D | Viewer de leitura; pins = projeção aproximada das marcações 2D |
| Custo de ferramenta | Preferir stack gratuita (`@google/model-viewer` Apache 2.0 ou Three.js MIT) |
| Tipos | Articulado e biarticulado (e demais silhuetas da frota via asset) |
| Cores | Paletas de referência; asset final pode já trazer a pintura do modelo |
| **Assets GLB** | **Embutidos no app mobile** (~9 modelos × ~3 MB ≈ 30 MB). Catálogo fixo versionado com o APK |
| **Vínculo** | Cada registro em `modelos_veiculo` aponta para **um** arquivo GLB do combo (campo novo, ex.: `arquivo_glb` / chave do asset) |
| Auto-rotate | Desligado (usuário controla orbit/zoom) |
| Update de GLB | Troca de mesh ⇒ nova versão do app (assets estáveis; sem CDN na v1) |

### Combo GLB embutido + cadastro de modelo

1. Pasta no mobile (ex.: `public/3d/`) com um `.glb` por modelo de veículo da frota (meta ≤ ~3–4 MB cada).
2. Tela/cadastro de **Modelo de veículo**: combo/select listando os GLBs embutidos; valor persistido em `modelos_veiculo` (migration: coluna texto/varchar com nome do arquivo ou chave estável).
3. No viewer: `veiculo.idModelo` → `modelo.arquivoGlb` → carrega `/3d/{arquivo}`.
4. Sem GLB cadastrado: fallback (placeholder procedural ou mensagem “modelo sem visualização 3D”).
5. Fora da v1: download remoto/CDN (só se o pacote ou a frequência de troca de asset crescer).

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

### Fase B — Assets reais embutidos + cadastro
1. Montar combo de ~9 GLBs comprimidos (≤ ~3–4 MB) em `public/3d/`
2. Migration em `modelos_veiculo`: campo para chave/arquivo GLB (ex.: `arquivo_glb varchar`)
3. UI de Modelo de veículo: select com os GLBs do pacote do app
4. Viewer resolve o GLB pelo modelo do veículo selecionado
5. Documentar licenças dos assets no `LICENSE` / plano

### Fase C — Pins das marcações 2D
1. Projetar `posXPct`/`posYPct` + face da vista como hotspots
2. Ocultar pin cuja normal não aponta para a câmera (frente/trás não “vazam” no perfil lateral)
3. Calibração fina por modelo GLB se necessário
4. Clique no pin → detalhe da irregularidade
5. **Não** alterar create/update de irregularidade nem PDF 2D

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
| Assets | Combo `public/3d/*.glb` embutido no APK (~30 MB para 9 modelos) |
| Cadastro | `modelos_veiculo.arquivo_glb` (ou equivalente) + combo na tela de modelos |
| Rotas / permissão | Entrada no fluxo real (pendências/histórico); protótipo só para teste |
| Backend | Migration + DTO/Swagger do campo GLB no modelo |
| RN | Atualizar `docs/regras-negocio.md` se pins 3D / asset por modelo virarem regra oficial |

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
| 2026-09-29 | Viewer retomado para teste; `articulado-verde.glb` = Meshy biometano comprimido (~2,9 MB) |
| 2026-09-29 | Pins: carrega marcações pendentes do veículo **1210** no articulado (mapa 2D→hotspot aproximado; 4 vistas) |
| 2026-09-29 | Decisão: combo de GLBs **embutidos no app** e setados em `modelos_veiculo` |
| 2026-09-29 | Pins frente/trás: filtro por orbit (face dominante) + `data-visible`; U% alinhado às laterais |
