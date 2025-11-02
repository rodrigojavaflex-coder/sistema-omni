## ⚠️ Erro: BillingNotEnabledMapError

### Problema
A chave do Google Maps API não tem faturamento habilitado. Mesmo que a chave seja válida, o Google exige configuração de faturamento para usar a API.

### Solução

#### 1. Ir para Google Cloud Console
- Acesse: https://console.cloud.google.com/
- Selecione o projeto que contém a chave

#### 2. Habilitar Faturamento
- Menu > Faturamento
- Clique em "Ativar faturamento"
- Adicione um método de pagamento (você não será cobrado se estiver dentro dos limites grátis)

#### 3. Verificar Quotas e Limites
- Ir para APIs e Serviços > Quotas
- Procurar por "Maps JavaScript API"
- Verificar se não há restrições

#### 4. Verificar Restrições da Chave
- Ir para APIs e Serviços > Credenciais
- Clique na chave API
- Seção "Restrições de API":
  - Selecionar "Maps JavaScript API"
  - Salvar

#### 5. Teste
- Recarregar a página no navegador
- O mapa deve carregar sem erros

### Limites Gratuitos do Google Maps
- 28.500 carregamentos de mapas/mês
- Sem custo adicional se dentro do limite
- Se exceder, será cobrado $7 por 1000 carregamentos

### Alertas de Deprecação
✅ Já corrigidos no código:
- Usando `loading=async` para melhor performance
- Usando `AdvancedMarkerElement` em vez de `Marker` (com fallback)

### Verificação da Chave Atual
A chave deve estar configurada em `.env` (não fazer commit):
```
GOOGLE_MAPS_API_KEY=SUA_CHAVE_AQUI
```

**Confirme se esta chave tem faturamento habilitado e se está restrita apenas para Maps JavaScript API.**

⚠️ **IMPORTANTE:** Nunca coloque a chave em arquivos que serão commitados no repositório!
