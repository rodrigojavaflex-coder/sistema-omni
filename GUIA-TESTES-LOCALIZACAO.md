# 🧪 Guia de Testes - Componente de Localização

## Testes Manuais Passo-a-Passo

### Teste 1: Geocodificação Automática

**Objetivo:** Verificar que preencher "Local Detalhado" atualiza mapa automaticamente

**Passos:**
```
1. Abrir http://localhost:4200/ocorrencia/new
2. Rolar até seção "Localização"
3. No campo "Local Detalhado", digitar: "Av. Paulista, 1578, São Paulo, SP"
4. Aguardar 1-2 segundos
```

**Resultado Esperado:**
- ✅ Mapa atualiza posição para São Paulo
- ✅ Marcador vermelho (📍) aparece no local
- ✅ InfoWindow exibe coordenadas aproximadas
- ✅ Sem erros no DevTools (F12)

**Se Falhar:**
- Verificar se Google Cloud Billing está ativo
- Verificar console (F12) para erros específicos
- Testar outro endereço válido

---

### Teste 2: Clique Manual no Mapa

**Objetivo:** Verificar que clique no mapa seleciona localização

**Passos:**
```
1. Limpar campo "Local Detalhado" (deixar vazio)
2. Clicar em outro local no mapa (ex: zona leste de SP)
3. Observar comportamento
```

**Resultado Esperado:**
- ✅ Marcador aparece exatamente onde clicou
- ✅ Mapa centra no novo ponto
- ✅ InfoWindow exibe novas coordenadas
- ✅ InfoWindow abre automaticamente

**Se Falhar:**
- Verificar se mapa tem dimensões adequadas (não está colapsado)
- Testar em navegador diferente
- Verificar se AdvancedMarkerElement está funcionando

---

### Teste 3: Geocodificação + Ajuste Manual

**Objetivo:** Verificar fluxo misto (geocodificação + clique)

**Passos:**
```
1. Digitar endereço: "Rua Augusta, 2500, São Paulo"
2. Aguardar geocodificação
3. Clicar em outro local próximo no mapa
4. Repetir processo
```

**Resultado Esperado:**
- ✅ Primeiro marcador aparece do geocoding
- ✅ Clique sobrescreve localização anterior
- ✅ Ambos os métodos funcionam harmoniosamente
- ✅ Localização final é a do último clique/geocoding

---

### Teste 4: Endereço Inválido

**Objetivo:** Verificar tratamento de geocodificação falha

**Passos:**
```
1. Digitar: "Planeta Marte, Via Láctea Setentrional"
2. Aguardar 2-3 segundos
3. Observar console (F12 → Console)
```

**Resultado Esperado:**
- ✅ Mapa NÃO atualiza
- ✅ Marcador anterior mantém-se (se houver)
- ✅ Console mostra: "Geocodificação falhou: ZERO_RESULTS"
- ✅ Sem exceção não tratada
- ✅ Nenhum erro visual para o usuário

---

### Teste 5: Preenchimento Parcial

**Objetivo:** Verificar geocodificação com dados mínimos

**Passos:**
```
1. Digitar só a cidade: "São Paulo"
2. Aguardar resposta
3. Depois digitar mais específico: "Avenida Paulista, 1000"
```

**Resultado Esperado:**
- ✅ Primeiro geocoding: centra no centro de SP
- ✅ Segundo geocoding: move para Av. Paulista
- ✅ Ambos funcionam (mesmo com dados parciais)

---

### Teste 6: Salvamento de Localização

**Objetivo:** Verificar que dados geográficos salvam corretamente

**Passos:**
```
1. Preencher formulário:
   - Data e Hora: 2025-10-31 14:00
   - Tipo: Acidente
   - Descrição: Teste de localização
   - Veículo: (selecionar qualquer um)
   - Motorista: (selecionar qualquer um)
   - Houve Vítimas: Não
   - Local Detalhado: "Av. Paulista, 1578"

2. Aguardar geocodificação
3. Clicar "Salvar"
4. Observar redirecionamento para listagem
```

**Resultado Esperado:**
- ✅ Notificação: "Ocorrência cadastrada com sucesso!"
- ✅ Redirecionamento para /ocorrencia
- ✅ Nova ocorrência aparece na lista
- ✅ No banco: SELECT id, localizacao FROM ocorrencias ORDER BY created_at DESC LIMIT 1;
  - Mostra: `{"type":"Point","coordinates":[-46.6545,-23.5615]}`

---

### Teste 7: Edição de Ocorrência

**Objetivo:** Verificar carregamento e edição de localização

**Passos:**
```
1. Clicar em uma ocorrência que já tem localização
2. Ou clicar "Editar" de uma ocorrência recém criada
3. Observar se mapa carrega com o marcador anterior
4. Mudar localização:
   - Opção A: Digitar novo endereço
   - Opção B: Clicar novo local no mapa
5. Clicar "Salvar"
```

**Resultado Esperado:**
- ✅ Mapa carrega com marcador da localização anterior
- ✅ Ambas opções (A e B) funcionam
- ✅ Salvamento atualiza corretamente
- ✅ Notificação: "Ocorrência atualizada com sucesso!"
- ✅ Listagem reflete mudança

---

### Teste 8: Responsividade

**Objetivo:** Verificar funcionamento em diferentes tamanhos de tela

**Passos:**
```
1. F12 → Devtools
2. Clicar icon "Toggle device toolbar" (ou Ctrl+Shift+M)
3. Testar resoluções:
   - iPhone 12 (390 x 844)
   - iPad (768 x 1024)
   - Desktop (1920 x 1080)
4. Em cada resolução:
   - Preencher endereço
   - Clicar no mapa
   - Salvar
```

**Resultado Esperado:**
- ✅ Mapa adapta ao tamanho da tela
- ✅ Sem overflow ou corte de elementos
- ✅ Touch funciona em mobile
- ✅ Geocodificação funciona em todas resoluções

---

### Teste 9: Performance

**Objetivo:** Verificar velocidade e ausência de memory leaks

**Passos:**
```
1. F12 → Performance tab
2. Clicar "Record" (círculo vermelho)
3. Executar sequência:
   - Preencher endereço
   - Aguardar geocodificação
   - Clicar mapa
   - Salvar formulário
   - Voltar para novo formulário
   - Repetir 5x
4. Clicar "Stop"
5. Analisar gráfico
```

**Resultado Esperado:**
- ✅ Tempo total < 10 segundos para 5 ciclos
- ✅ Memory heap não cresce indefinidamente
- ✅ Geocodificação < 1s por requisição
- ✅ Sem warnings vermelhos

---

### Teste 10: Navegadores Diferentes

**Objetivo:** Verificar compatibilidade cross-browser

**Teste em:**

```
☐ Chrome (última versão)
   - Esperado: Funciona 100%
   
☐ Firefox
   - Esperado: Funciona 100%
   - Nota: Pode ser ligeiramente mais lento
   
☐ Safari (MacOS/iOS)
   - Esperado: Funciona 100%
   - Nota: Verificar permissions geolocalização
   
☐ Edge (Chromium)
   - Esperado: Funciona 100% (é Chromium)
```

---

## Testes de Integração Backend

### Verificar Dados no Banco

```sql
-- 1. Confirmar que localização foi salva
SELECT 
  id,
  descricao,
  localizacao,
  ST_AsGeoJSON(localizacao) as geojson
FROM ocorrencias
WHERE localizacao IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;

-- 2. Verificar coordenadas
SELECT 
  id,
  ST_Y(localizacao) as latitude,
  ST_X(localizacao) as longitude
FROM ocorrencias
WHERE localizacao IS NOT NULL
LIMIT 5;

-- 3. Validar integridade
SELECT 
  id,
  ST_IsValid(localizacao) as valida,
  ST_GeometryType(localizacao) as tipo
FROM ocorrencias
WHERE localizacao IS NOT NULL;
```

---

## Testes de API

### Via Postman/Insomnia

```
GET http://localhost:3000/api/ocorrencias/1234

Resposta esperada:
{
  "id": "1234",
  "descricao": "...",
  "localizacao": {
    "type": "Point",
    "coordinates": [-46.6545, -23.5615]
  }
}
```

### Criar Ocorrência com cURL

```bash
curl -X POST http://localhost:3000/api/ocorrencias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "dataHora": "2025-10-31T14:00:00",
    "idVeiculo": "uuid-veiculo",
    "idMotorista": "uuid-motorista",
    "tipo": "ACIDENTE",
    "descricao": "Teste de API com localização",
    "houveVitimas": "NAO",
    "localizacao": {
      "type": "Point",
      "coordinates": [-46.6545, -23.5615]
    }
  }'
```

---

## Checklist de Testes

Usar este checklist para validação final:

```
FUNCIONALIDADE
☐ Geocodificação automática funciona
☐ Clique no mapa funciona
☐ Ambos os métodos trabalham juntos
☐ Endereço inválido é tratado
☐ Marcador AdvancedMarkerElement renderiza
☐ InfoWindow exibe coordenadas

PERSISTÊNCIA
☐ Dados salvam corretamente
☐ GeoJSON format está correto
☐ Edição carrega localização anterior
☐ Queries SQL retornam dados válidos

PERFORMANCE
☐ Carregamento < 2s
☐ Geocodificação < 1s
☐ Sem memory leaks
☐ Responsivo em mobile

COMPATIBILIDADE
☐ Chrome: OK
☐ Firefox: OK
☐ Safari: OK
☐ Edge: OK
☐ Mobile: OK

SEGURANÇA
☐ API Key não exposta no console
☐ Sem erro de CORS
☐ Dados trafegam seguramente

CONSOLE
☐ Sem erros (red messages)
☐ Sem warnings críticos (yellow)
☐ Apenas info messages (gray)
```

---

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| Geocodificação não funciona | Google Cloud billing desativado | Ativar billing em Google Cloud Console |
| Marcador não aparece | Container sem dimensões | Verificar CSS do mapa |
| Mapa não carrega | API Key inválida | Regenerar em Google Cloud |
| "Invalid Map ID" error | AdvancedMarkerElement mal configurado | Verificar elemento no DOM |
| CORS error | Origem não autorizada | Configurar API Restrictions em Google Cloud |
| Endereço não encontrado | Geocoder retornou zero resultados | Testar com endereço mais específico |
| Performance ruim | Muitas requisições Geocoding | Implementar debounce em valueChanges |

---

## Logs Esperados (Console)

### Sucesso

```
✅ Script carregado com sucesso
✅ Mapa criado: container id=mapa-container
✅ Geocodificação: "Av. Paulista, 1578" → [-46.6545, -23.5615]
✅ Marcador adicionado em [-46.6545, -23.5615]
✅ InfoWindow aberto
✅ Localização emitida: {latitude: -23.5615, longitude: -46.6545}
```

### Warnings (Aceitáveis)

```
⚠️ Geocodificação falhou: ZERO_RESULTS
   (Endereço inválido - comportamento esperado)
```

### Erros (NÃO Aceitáveis)

```
❌ Container não disponível
❌ Google Maps API não foi carregada
❌ Mapa não foi inicializado
❌ CORS error ao carregar script
```

---

**Última atualização:** 31 de outubro de 2025
**Próxima revisão:** Após testes em produção
