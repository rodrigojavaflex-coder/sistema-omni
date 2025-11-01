# Exemplos de Queries PostGIS - Campo Localização

## Campo de Armazenamento

```sql
-- Estrutura na tabela ocorrências
ALTER TABLE ocorrencias 
ADD COLUMN localizacao geography(Point,4326);

-- Índice para melhor performance
CREATE INDEX idx_ocorrencias_localizacao ON ocorrencias USING GIST (localizacao);

-- Índice para STDWithin queries
CREATE INDEX idx_ocorrencias_localizacao_gin ON ocorrencias USING GIN 
(ST_DWithin(localizacao, ST_SetSRID(ST_Point(0, 0), 4326), 1000));
```

---

## Inserção de Dados

### Via TypeORM (Frontend enviando GeoJSON)

```typescript
// Frontend envia:
{
  type: 'Point',
  coordinates: [-46.6333, -23.5505]  // [longitude, latitude]
}

// TypeORM recebe e converte automaticamente
// SQL resultante (aprox):
INSERT INTO ocorrencias (localizacao) 
VALUES (ST_GeomFromGeoJSON('{"type":"Point","coordinates":[-46.6333,-23.5505]}'));
```

### Via SQL Direto

```sql
-- Inserir com coordenadas
INSERT INTO ocorrencias (localizacao) 
VALUES (ST_SetSRID(ST_Point(-46.6333, -23.5505), 4326));

-- Ou via GeoJSON
INSERT INTO ocorrencias (localizacao) 
VALUES (ST_GeomFromGeoJSON('{"type":"Point","coordinates":[-46.6333,-23.5505]}'));
```

---

## Consultas Espaciais

### 1. Buscar Ocorrências Próximas (Raio)

```sql
-- Ocorrências em um raio de 1km da Av. Paulista
SELECT id, descricao, localizacao 
FROM ocorrencias
WHERE ST_DWithin(
  localizacao, 
  ST_SetSRID(ST_Point(-46.6545, -23.5615), 4326),
  1000  -- metros
);

-- Com distância calculada
SELECT 
  id, 
  descricao, 
  ST_Distance(localizacao, ST_SetSRID(ST_Point(-46.6545, -23.5615), 4326)) as distancia_metros
FROM ocorrencias
WHERE ST_DWithin(
  localizacao, 
  ST_SetSRID(ST_Point(-46.6545, -23.5615), 4326),
  5000  -- 5km
)
ORDER BY distancia_metros ASC;
```

### 2. Buscar em Polígono (Área)

```sql
-- Ocorrências dentro de um bairro (polígono)
SELECT id, descricao, localizacao 
FROM ocorrencias
WHERE ST_Contains(
  ST_SetSRID(
    ST_GeomFromText('POLYGON((-46.65 -23.55, -46.64 -23.55, -46.64 -23.56, -46.65 -23.56, -46.65 -23.55))'),
    4326
  ),
  localizacao
);
```

### 3. Heatmap - Agrupar Ocorrências por Área

```sql
-- Contar ocorrências por quadrante (1km x 1km)
SELECT 
  ST_SnapToGrid(localizacao, 0.00896, 0.00896) as grid_ponto,
  COUNT(*) as total_ocorrencias
FROM ocorrencias
WHERE localizacao IS NOT NULL
  AND dataHora >= NOW() - INTERVAL '30 days'
GROUP BY grid_ponto
ORDER BY total_ocorrencias DESC;
```

### 4. Distância entre Dois Pontos

```sql
-- Distância entre a ocorrência e uma delegacia
SELECT 
  id,
  descricao,
  ST_Distance(
    localizacao,
    ST_SetSRID(ST_Point(-46.6333, -23.5505), 4326)  -- Delegacia
  ) as distancia_delegacia_metros
FROM ocorrencias
WHERE localizacao IS NOT NULL
ORDER BY distancia_delegacia_metros ASC
LIMIT 10;
```

### 5. Coordenadas em Diferentes Formatos

```sql
-- Extrair latitude e longitude
SELECT 
  id,
  ST_Y(localizacao) as latitude,
  ST_X(localizacao) as longitude,
  ST_AsGeoJSON(localizacao) as geojson
FROM ocorrencias
WHERE localizacao IS NOT NULL
LIMIT 1;

-- Resultado:
-- id: 1
-- latitude: -23.5505
-- longitude: -46.6333
-- geojson: {"type":"Point","coordinates":[-46.6333,-23.5505]}
```

### 6. Rota - Pontos Entre Dois Locais

```sql
-- Ocorrências em uma rota (buffer de 500m)
SELECT 
  id,
  descricao,
  ST_Distance(localizacao, ST_GeomFromText('LINESTRING(-46.65 -23.55, -46.64 -23.56)')) as distancia_rota
FROM ocorrencias
WHERE localizacao IS NOT NULL
  AND ST_DWithin(
    localizacao,
    ST_GeomFromText('LINESTRING(-46.65 -23.55, -46.64 -23.56)'),
    500  -- buffer 500m
  );
```

### 7. Ocorrências por Linha/Dia com Localização

```sql
-- Relatório diário com número de eventos
SELECT 
  DATE(dataHora) as data,
  linha,
  COUNT(*) as total_eventos,
  ST_AsGeoJSON(ST_Centroid(ST_Collect(localizacao))) as centroide_geografico
FROM ocorrencias
WHERE localizacao IS NOT NULL
  AND dataHora >= NOW() - INTERVAL '7 days'
GROUP BY DATE(dataHora), linha
ORDER BY data DESC, total_eventos DESC;
```

---

## Atualização de Dados

### Atualizar Localização Existente

```sql
-- Corrigir coordenada errada
UPDATE ocorrencias
SET localizacao = ST_SetSRID(ST_Point(-46.6333, -23.5505), 4326)
WHERE id = 'uuid-da-ocorrencia';

-- Via GeoJSON
UPDATE ocorrencias
SET localizacao = ST_GeomFromGeoJSON('{"type":"Point","coordinates":[-46.6333,-23.5505]}')
WHERE id = 'uuid-da-ocorrencia';
```

---

## Performance

### Índices Recomendados

```sql
-- Índice GIST (melhor para ST_DWithin)
CREATE INDEX idx_ocorrencias_geom_gist 
ON ocorrencias USING GIST (localizacao);

-- Índice BRIN (quando tabela é muito grande, mais espaço eficiente)
CREATE INDEX idx_ocorrencias_geom_brin 
ON ocorrencias USING BRIN (localizacao);

-- Verificar índices criados
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'ocorrencias' AND indexname LIKE '%geom%';
```

### Plano de Execução

```sql
-- Verificar se está usando índice
EXPLAIN ANALYZE
SELECT id FROM ocorrencias
WHERE ST_DWithin(
  localizacao, 
  ST_SetSRID(ST_Point(-46.6333, -23.5505), 4326),
  1000
);

-- Saída esperada com índice:
-- Index Scan using idx_ocorrencias_geom_gist on ocorrencias
-- Index Cond: (localizacao && '...'::geography)
-- Filter: (ST_DWithin(localizacao, ..., 1000))
```

---

## Funções Úteis

```sql
-- ST_Distance: Distância entre dois pontos (metros)
ST_Distance(geom1, geom2)

-- ST_DWithin: Verifica se está dentro de raio (mais rápido que ST_Distance)
ST_DWithin(geom1, geom2, distancia)

-- ST_Contains: Verifica se um polígono contém um ponto
ST_Contains(poligono, ponto)

-- ST_Centroid: Calcula o centroide (ponto médio) de múltiplos pontos
ST_Centroid(ST_Collect(multiplos_pontos))

-- ST_Collect: Coleta múltiplas geometrias
ST_Collect(localizacao) -- usa com GROUP BY

-- ST_AsGeoJSON: Converte para GeoJSON
ST_AsGeoJSON(localizacao)

-- ST_Y / ST_X: Extrai latitude/longitude
ST_Y(ponto) -- latitude
ST_X(ponto) -- longitude

-- ST_Buffer: Cria buffer (área) ao redor de geometria
ST_Buffer(geom, distancia)

-- ST_SnapToGrid: Arredonda coordenadas para grid
ST_SnapToGrid(geom, grid_tamanho)
```

---

## Integração com TypeORM (Backend)

### Busca com Repositório

```typescript
// Em um repository customizado
import { Repository } from 'typeorm';

@Injectable()
export class OcorrenciaRepository extends Repository<Ocorrencia> {
  
  // Buscar ocorrências próximas
  async findNearby(
    latitude: number, 
    longitude: number, 
    raioMetros: number
  ) {
    return this.query(`
      SELECT o.* FROM ocorrencias o
      WHERE ST_DWithin(
        o.localizacao,
        ST_SetSRID(ST_Point($1, $2), 4326),
        $3
      )
      ORDER BY ST_Distance(o.localizacao, ST_SetSRID(ST_Point($1, $2), 4326)) ASC
    `, [longitude, latitude, raioMetros]);
  }

  // Heatmap
  async getHeatmap(dias: number = 7) {
    return this.query(`
      SELECT 
        ST_Y(o.localizacao) as latitude,
        ST_X(o.localizacao) as longitude,
        COUNT(*) as intensidade
      FROM ocorrencias o
      WHERE o.localizacao IS NOT NULL
        AND o.dataHora >= NOW() - INTERVAL '1 day' * $1
      GROUP BY ST_Y(o.localizacao), ST_X(o.localizacao)
    `, [dias]);
  }
}
```

---

## Debugging

### Ver Dados Armazenados

```sql
-- Verificar o que foi armazenado
SELECT 
  id,
  localizacao,
  ST_AsText(localizacao) as texto,
  ST_AsGeoJSON(localizacao) as geojson,
  ST_SRID(localizacao) as srid
FROM ocorrencias
WHERE localizacao IS NOT NULL
LIMIT 1;
```

### Validar Geometria

```sql
-- Verificar se geometria é válida
SELECT 
  id,
  ST_IsValid(localizacao) as valida,
  ST_IsEmpty(localizacao) as vazia
FROM ocorrencias;

-- Reparar geometrias inválidas
UPDATE ocorrencias
SET localizacao = ST_MakeValid(localizacao)
WHERE NOT ST_IsValid(localizacao);
```

---

## Limpeza de Dados

### Remover Localizações Inválidas

```sql
-- Listar inválidas
SELECT id, localizacao FROM ocorrencias
WHERE localizacao IS NOT NULL
  AND NOT ST_IsValid(localizacao);

-- Remover
UPDATE ocorrencias
SET localizacao = NULL
WHERE NOT ST_IsValid(localizacao);
```

---

**Última atualização:** 31 de outubro de 2025
