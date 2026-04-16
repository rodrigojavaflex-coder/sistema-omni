# ✅ SOLUÇÃO PARA IONIC SERVE

## Problema Resolvido

O erro `Unknown arguments: host, port` ocorria porque o Ionic CLI estava tentando usar `app:serve` mas o projeto se chama `mobile`.

## Solução Aplicada

Adicionado `defaultProject: "mobile"` no `ionic.config.json`.

## Como Usar

### Opção 1: Usar o comando padrão (recomendado)
```powershell
cd C:\PROJETOS\OMNI\mobile
ionic serve
```

### Opção 2: Especificar o projeto explicitamente
```powershell
ionic serve --project=mobile
```

### Opção 3: Usar ng serve diretamente
```powershell
ng serve mobile
# ou
ng serve mobile --port=8100
```

## Avisos do Vite

Os avisos sobre `dynamic import cannot be analyzed by Vite` são **normais** e **não impedem o funcionamento**. Eles vêm do código do Ionic/Stencil e podem ser ignorados.

Se quiser suprimir os avisos, você pode adicionar no `vite.config.ts` (se existir) ou ignorar, pois não afetam o funcionamento.

## Verificar se está funcionando

1. O servidor deve iniciar em `http://localhost:8100`
2. O navegador deve abrir automaticamente
3. Você deve ver a tela de login

## Próximos Passos

1. ✅ Servidor rodando
2. Testar login no navegador
3. Testar no dispositivo Android com `npx cap open android`

---

**Última Atualização:** 21/01/2026
