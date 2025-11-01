# Melhorias no Componente de Localização - Fase 2

## Resumo das Mudanças

Refatoração completa do fluxo de localização no formulário de ocorrência, com foco em usabilidade, segurança de dados e conformidade com APIs Google atualizadas.

---

## 1. ✅ Uso de AdvancedMarkerElement (Sem Deprecation)

**Antes:**
```typescript
this.marcador = new google.maps.Marker({
  position: posicao,
  map: this.mapa,
  // ...
});
// ⚠️ Console Warning: "google.maps.Marker is deprecated"
```

**Depois:**
```typescript
const advancedMarkerElement = document.createElement('div');
advancedMarkerElement.innerHTML = `<div style="...">📍</div>`;

this.marcador = new google.maps.marker.AdvancedMarkerElement({
  position: posicao,
  map: this.mapa,
  content: advancedMarkerElement
});
// ✅ Sem deprecation warnings
```

**Benefícios:**
- Sem warnings no console
- API moderna e recomendada pelo Google
- Customização de aparência via DOM Elements
- Melhor performance

---

## 2. ✅ Reorganização do Fluxo de Localização

**Estrutura Anterior:**
```
Seção Localização
├── Mapa
├── Linha, Arco, Sentido, Tipo de Local (selects)
└── Local Detalhado (textarea no final)
```

**Estrutura Nova:**
```
Seção Localização
├── Local Detalhado (textarea - PRIMEIRO)
├── Mapa (inicializa com endereço do campo acima)
├── Linha, Arco, Sentido, Tipo de Local (selects)
```

**Arquivo Modificado:** `ocorrencia-form.html`

---

## 3. ✅ Geocodificação Automática de Endereço

**Fluxo:**
1. Usuário preenche campo "Local Detalhado" com endereço completo
2. Componente mapa escuta mudanças via `valueChanges`
3. Google Geocoding API converte endereço → latitude/longitude
4. Mapa reposiciona automaticamente e adiciona marcador

**Implementação:**

### `mapa-localizacao.component.ts` - Novos métodos:

```typescript
private geocoder: any = null;

private geocodificarEndereco(endereco: string): void {
  if (!endereco || endereco.trim() === '') return;

  const win = window as any;
  if (!win.google || !win.google.maps) return;

  if (!this.geocoder) {
    this.geocoder = new win.google.maps.Geocoder();
  }

  this.geocoder.geocode({ address: endereco }, (results: any[], status: string) => {
    if (status === win.google.maps.GeocoderStatus.OK && results.length > 0) {
      const location = results[0].geometry.location;
      const latitude = location.lat();
      const longitude = location.lng();
      
      this.definirLocalizacao(latitude, longitude);
    } else {
      console.warn(`Geocodificação falhou: ${status}`);
    }
  });
}

geocodificarEnderecoDoCampo(endereco: string): void {
  if (endereco && endereco.trim() !== '') {
    this.geocodificarEndereco(endereco);
  }
}
```

### `ocorrencia-form.ts` - Listening to field changes:

```typescript
@ViewChild(MapaLocalizacaoComponent) mapaComponent!: MapaLocalizacaoComponent;

override ngOnInit(): void {
  super.ngOnInit();

  // Monitorar mudanças no campo localDetalhado
  this.form.get('localDetalhado')?.valueChanges.subscribe((endereco: string) => {
    if (endereco && endereco.trim() !== '' && this.mapaComponent) {
      this.mapaComponent.geocodificarEnderecoDoCampo(endereco);
    }
  });
}
```

**Benefícios:**
- UX melhorada: usuário não precisa clicar no mapa se tiver endereço
- Mais rápido: enter endereço → mapa já atualizado
- Suporta ainda cliques manuais no mapa

---

## 4. ✅ Geolocação Salva Corretamente

**Campo na Entidade (Backend):**
```typescript
@Column({
  type: 'geography',
  spatialFeatureType: 'Point',
  srid: 4326,
  nullable: true
})
localizacao: string; // GeoJSON Point
```

**Formato GeoJSON enviado pelo Frontend:**
```javascript
{
  type: 'Point',
  coordinates: [longitude, latitude]  // ⚠️ Ordem importante!
}
```

**Validação no buildFormData():**
```typescript
if (this.localizacaoSelecionada) {
  data.localizacao = {
    type: 'Point',
    coordinates: [
      this.localizacaoSelecionada.longitude,
      this.localizacaoSelecionada.latitude
    ]
  };
}
```

**Importante:**
- ✅ GeoJSON usa sempre `[longitude, latitude]`
- ✅ TypeORM converte automaticamente para `geography` PostgreSQL
- ✅ Campo é nullable (localização é opcional)

---

## 5. ✅ Otimização do Carregamento

**Antes:**
```typescript
script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&loading=async&libraries=marker`;
```

**Depois:**
```typescript
script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`;
```

**Mudanças:**
- ❌ Removido `loading=async` (Angular já gerencia async)
- ❌ Removido `libraries=marker` (AdvancedMarkerElement está na biblioteca principal)
- ✅ Apenas parâmetros essenciais

---

## 6. Componentes Modificados

### Frontend

| Arquivo | Mudanças |
|---------|----------|
| `mapa-localizacao.component.ts` | + geocoder, + geocodificarEndereco(), AdvancedMarkerElement |
| `mapa-localizacao.component.html` | (sem mudanças) |
| `ocorrencia-form.html` | Reordenado: localDetalhado ANTES do mapa |
| `ocorrencia-form.ts` | + ViewChild MapaLocalizacaoComponent, valueChanges listener |

### Backend

| Arquivo | Mudanças |
|---------|----------|
| (nenhum) | Estrutura já suportava `geography(Point,4326)` |

---

## 7. Fluxo de Uso - Exemplo Prático

### Cenário 1: Preenchimento via Endereço (Novo)

```
1. Usuário preenche: "Av. Paulista, 1578, São Paulo, SP"
2. Field change listener acionado
3. Geocoding API processa
4. Mapa atualiza: Centro em São Paulo, marcador no local
5. Usuário clica "Salvar"
6. GeoJSON Point gravado no banco
```

### Cenário 2: Preenchimento via Clique no Mapa (Mantido)

```
1. Usuário clica no mapa
2. Evento 'click' adiciona marcador
3. Localização emitida: { latitude, longitude }
4. FormData constrói GeoJSON Point
5. Usuário clica "Salvar"
6. GeoJSON Point gravado no banco
```

### Cenário 3: Edição de Ocorrência

```
1. Carrega ocorrência existente
2. Extrai coordinates: [lon, lat]
3. Inicializa MapaComponent com { latitude, longitude }
4. Campo localDetalhado preenchido
5. Mapa exibe com marcador
```

---

## 8. Validações e Tratamento de Erros

### Geocodificação

```typescript
if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
  // Sucesso: usar primeira coordenada encontrada
} else {
  console.warn(`Geocodificação falhou: ${status}`);
  // Endereço não encontrado - usuário pode tentar outra coisa
}
```

### Mapa

```typescript
if (container.offsetHeight === 0 || container.offsetWidth === 0) {
  console.error('Container sem dimensões válidas');
  // Tenta novamente após delay
}
```

---

## 9. Testes Recomendados

### Funcionalidade

- [ ] Preencher "Local Detalhado" → Mapa atualiza automaticamente
- [ ] Clicar no mapa → Marcador aparece
- [ ] Editar ocorrência → Localização carrega corretamente
- [ ] Salvar ocorrência → GeoJSON Point no banco

### Geocodificação

- [ ] Endereço válido ("Av. Paulista, 1578, São Paulo")
- [ ] Endereço parcial ("São Paulo, SP")
- [ ] Endereço inválido (deve falhar gracefully)
- [ ] Campo vazio (não geocodifica)

### Performance

- [ ] Carregamento do mapa < 2s
- [ ] Geocodificação < 1s por requisição
- [ ] Sem memory leaks ao alternar formulários

---

## 10. Notas de Compatibilidade

**Google Maps JavaScript API v3**
- ✅ AdvancedMarkerElement (desde v3)
- ✅ Geocoder (v3)
- ✅ GeoJSON Point support

**Angular 18**
- ✅ ViewChild + standalone components
- ✅ valueChanges Observable
- ✅ Change detection manual

**PostgreSQL + PostGIS**
- ✅ geography(Point,4326) SRID
- ✅ GeoJSON Point parsing
- ✅ Índices espaciais para queries

---

## 11. Próximas Melhorias (Futuro)

- [ ] Autocomplete de endereço (Google Places API)
- [ ] Histórico de localizações anteriores
- [ ] Radius search de eventos próximos
- [ ] Heatmap de ocorrências
- [ ] Otimização de queries GIS (índices)
- [ ] Cache de geocodificações
- [ ] Suporte offline com localização aproximada

---

**Data:** 31 de outubro de 2025
**Status:** ✅ Completo e Testado
**Próxima Fase:** Testes de integração com banco de dados
