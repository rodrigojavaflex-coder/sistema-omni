# 🚀 COMANDOS RÁPIDOS - MOBILE

## ⚡ Comandos Principais

### Iniciar Servidor de Desenvolvimento

```powershell
# Opção 1: Usar npm script (recomendado)
npm run serve

# Opção 2: Comando direto
ionic serve --project=mobile

# Opção 3: Sem abrir navegador automaticamente
npm run serve:no-open
# ou
ionic serve --project=mobile --no-open
```

### Build e Sincronização

```powershell
# Build para produção
npm run build

# Build para desenvolvimento
npm run build -- --configuration development

# Sincronizar com Capacitor
npm run sync
# ou
npx cap sync
```

### Abrir no Android Studio

```powershell
npx cap open android
```

---

## ⚠️ IMPORTANTE

O comando `ionic serve` **sempre** precisa do flag `--project=mobile` porque:
- O projeto Angular se chama `mobile` (não `app`)
- O Ionic CLI tenta usar `app:serve` por padrão
- É necessário especificar explicitamente o projeto

**Solução:** Use sempre `npm run serve` que já inclui o flag correto.

---

## 📝 Scripts Disponíveis

- `npm run serve` - Inicia servidor (abre navegador)
- `npm run serve:no-open` - Inicia servidor (não abre navegador)
- `npm run build` - Build para produção
- `npm run sync` - Sincroniza com Capacitor
- `npm start` - Usa `ng serve` diretamente (sem Ionic)

---

**Última Atualização:** 21/01/2026
