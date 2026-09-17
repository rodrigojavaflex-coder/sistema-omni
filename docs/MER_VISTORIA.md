# MER – Tabelas de Vistoria

Diagrama de entidade-relacionamento do módulo de vistoria (backend).

## Diagrama (Mermaid)

```mermaid
erDiagram
  tiposvistoria {
    uuid id PK
    timestamp criadoEm
    timestamp atualizadoEm
    varchar descricao "UK"
    boolean ativo
  }

  vistorias {
    uuid id PK
    timestamp criadoEm
    timestamp atualizadoEm
    uuid idveiculo FK
    uuid idmotorista FK
    uuid idtipovistoria FK
    uuid idusuario FK
    numeric odometro
    numeric porcentagembateria "nullable"
    timestamp datavistoria
    integer tempo
    text observacao "nullable"
    enum status
  }

  areas_vistoriadas {
    uuid id PK
    timestamp criadoEm
    timestamp atualizadoEm
    varchar nome
    integer ordem_visual
    boolean ativo
  }

  areas_modelos {
    uuid id PK
    timestamp criadoEm
    timestamp atualizadoEm
    uuid idarea FK
    uuid idmodelo FK
  }

  areas_componentes {
    uuid id PK
    timestamp criadoEm
    timestamp atualizadoEm
    uuid idarea FK
    uuid idcomponente FK "UQ componente fixo"
    integer ordem_visual
  }

  componentes {
    uuid id PK
    timestamp criadoEm
    timestamp atualizadoEm
    varchar nome
    boolean ativo
  }

  sintomas {
    uuid id PK
    timestamp criadoEm
    timestamp atualizadoEm
    varchar descricao
    boolean ativo
    boolean exige_marcacao_mapa
  }

  vistas_veiculo {
    uuid id PK
    timestamp criadoEm
    timestamp atualizadoEm
    varchar descricao
    boolean ativo
    integer ordem
  }

  modelo_veiculo_vistas {
    uuid id PK
    timestamp criadoEm
    timestamp atualizadoEm
    uuid idmodelo FK
    uuid id_catalogo FK
    varchar descricao
    integer ordem
    varchar mime_type
    varchar nome_arquivo
    bigint tamanho
    bytea dados_bytea
    boolean ativo
  }

  matriz_criticidade {
    uuid id PK
    timestamp criadoEm
    timestamp atualizadoEm
    uuid idtipovistoria FK "nullable"
    uuid idcomponente FK
    uuid idsintoma FK
    enum gravidade "VERDE,AMARELO,VERMELHO"
    boolean exige_foto
    boolean permite_audio
    uuid[] id_vistas "vazio = todas as vistas do modelo"
  }

  irregularidades {
    uuid id PK
    timestamp criadoEm
    timestamp atualizadoEm
    uuid idvistoria FK
    uuid idarea FK
    uuid idcomponente FK
    uuid idsintoma FK
    text observacao "nullable"
    boolean resolvido
    varchar audio_nome_arquivo "nullable"
    varchar audio_mime_type "nullable"
    bigint audio_tamanho "nullable"
    integer audio_duracao_ms "nullable"
    bytea audio_dados_bytea "nullable"
    uuid id_vista FK "nullable"
    numeric pos_x_pct "nullable 0-100"
    numeric pos_y_pct "nullable 0-100"
  }

  irregularidades_imagens {
    uuid id PK
    timestamp criadoEm
    timestamp atualizadoEm
    varchar nome_arquivo
    bigint tamanho
    bytea dados_bytea
    uuid idirregularidade FK
  }

  veiculos {
    uuid id PK
    string descricao
    string placa
    uuid idmodelo FK
  }

  modelos_veiculo {
    uuid id PK
    varchar nome
    boolean ativo
  }

  motoristas {
    uuid id PK
    string nome
  }

  usuarios {
    uuid id PK
    string nome
    string email
  }

  %% Relacionamentos
  tiposvistoria ||--o{ vistorias : "idtipovistoria"
  tiposvistoria ||--o{ matriz_criticidade : "idtipovistoria"

  vistorias }o--|| veiculos : "idveiculo"
  vistorias }o--|| motoristas : "idmotorista"
  vistorias }o--|| usuarios : "idusuario"
  vistorias ||--o{ irregularidades : "idvistoria"

  areas_vistoriadas ||--o{ areas_modelos : "idarea"
  areas_vistoriadas ||--o{ areas_componentes : "idarea"
  areas_vistoriadas }o--o{ irregularidades : "idarea"

  modelos_veiculo ||--o{ areas_modelos : "idmodelo"
  modelos_veiculo ||--o{ veiculos : "idmodelo"
  modelos_veiculo ||--o{ modelo_veiculo_vistas : "idmodelo"
  vistas_veiculo ||--o{ modelo_veiculo_vistas : "id_catalogo"

  componentes ||--o{ areas_componentes : "idcomponente"
  componentes ||--o{ matriz_criticidade : "idcomponente"
  componentes }o--o{ irregularidades : "idcomponente"

  sintomas ||--o{ matriz_criticidade : "idsintoma"
  sintomas }o--o{ irregularidades : "idsintoma"

  modelo_veiculo_vistas ||--o{ irregularidades : "id_vista"

  irregularidades ||--o{ irregularidades_imagens : "idirregularidade"
```

## Resumo das entidades

| Tabela | Descrição |
|--------|-----------|
| **tiposvistoria** | Cadastro de tipos de vistoria (ex.: Preventiva, Corretiva). |
| **vistorias** | Cabeçalho da vistoria: veículo, motorista, tipo, usuário, odômetro, data, status. |
| **areas_vistoriadas** | Áreas de inspeção (ex.: Dianteiro, Traseiro). |
| **areas_modelos** | Quais modelos de veículo cada área atende (área ↔ modelo). |
| **areas_componentes** | Quais componentes são vistoriados em cada área (1 componente → 1 área). |
| **componentes** | Catálogo de componentes (ex.: Pneu, Farol). |
| **sintomas** | Catálogo de sintomas/defeitos (ex.: Desgaste, Quebrado). Flag `exige_marcacao_mapa`. |
| **vistas_veiculo** | Catálogo de vistas/partes (ex.: Lado Esquerdo, Frente). Sem imagem. |
| **modelo_veiculo_vistas** | Desenho JPEG do modelo para um item do catálogo (único por modelo + vista). |
| **matriz_criticidade** | Regras por (tipo vistoria + componente + sintoma): gravidade, exige foto, permite áudio, vistas do mapa (`id_vistas`; vazio = todas). |
| **irregularidades** | Registro de irregularidade na vistoria: área, componente, sintoma, observação, áudio, marcação no mapa. |
| **irregularidades_imagens** | Fotos anexadas à irregularidade. |

## Regras de negócio refletidas no MER

- **Componente fixo à área:** em `areas_componentes` há UNIQUE em `idcomponente` (cada componente em no máximo uma área).
- **Matriz por tipo de vistoria:** `matriz_criticidade` tem `idtipovistoria`; a regra é por (tipo + componente + sintoma).
- **Áreas por modelo:** `areas_modelos` define quais áreas aparecem para cada modelo de veículo na vistoria mobile.
