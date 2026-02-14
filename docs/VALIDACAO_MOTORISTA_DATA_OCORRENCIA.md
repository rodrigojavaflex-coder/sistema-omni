# Validação Motorista + Data/Hora na Ocorrência

## O que faz
Verifica se **já existe** outra ocorrência para o **mesmo motorista** na **mesma data e hora** (mesmo minuto).  
**Não bloqueia** o formulário: apenas exibe um **aviso** (toast de warning).

## Quando é disparada

1. **Novo registro**  
   - **Ao selecionar o motorista** no autocomplete (só chama a API se Data e Hora já estiverem preenchidos).  
   - **Ao alterar Data ou Hora** depois de preencher os dois (valueChanges com debounce 400 ms).

2. **Edição**  
   - **Ao abrir o formulário** de edição: após carregar a ocorrência, a verificação roda uma vez (com delay 300 ms). A própria ocorrência em edição é ignorada na busca (`idOcorrenciaExcluir`), então o aviso só aparece se existir **outra** ocorrência com o mesmo motorista na mesma data/hora.  
   - **Ao alterar o motorista** no autocomplete.  
   - **Ao alterar Data ou Hora** (valueChanges com debounce 400 ms).

## Por que pode “não aparecer” o aviso

- **Data ou hora em branco**  
  A verificação **não** roda se faltar data ou hora.  
  Preencha primeiro **Data e Hora** e depois o **Motorista** (ou o contrário), mas os dois precisam estar preenchidos.

- **Campo “Data e Hora”**  
  É um único controle no form, mas no layout são dois inputs (data e hora).  
  O valor só é gravado no form quando **os dois** estão preenchidos.  
  Se só a data ou só a hora foi preenchida, o form ainda não tem valor e a verificação não é chamada.

- **Em edição**  
  A própria ocorrência em edição é ignorada (não conta como “outra” ocorrência).

## Fluxo técnico

- **Frontend:** `ocorrencia-form.ts`  
  - `onMotoristaSelected()` → chama `verificarOcorrenciaMotoristaDataHora()` (com `setTimeout(0)`).  
  - `form.get('dataHora').valueChanges` (com `debounceTime(400)`) → chama `verificarOcorrenciaMotoristaDataHora()`.  
  - Só faz a requisição se houver `idMotorista` e `dataHora` no formato `YYYY-MM-DDTHH:mm`.

- **Backend:** `GET /ocorrencias/check-motorista-data?idMotorista=...&dataHora=...&idOcorrenciaExcluir=...`  
  - Retorna `{ existe: boolean }`.  
  - Considera o **mesmo minuto** (intervalo entre `dataHora:00` e o minuto seguinte).  
  - Em edição, `idOcorrenciaExcluir` é o id da ocorrência atual para não contar ela mesma.
