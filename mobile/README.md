# 📱 OMNI Mobile App

Aplicativo mobile desenvolvido com Ionic 7 + Angular 20 + Capacitor 5.

---

## 🚀 Iniciar Desenvolvimento

### ⚠️ IMPORTANTE: Sempre use o script npm

```powershell
cd C:\PROJETOS\OMNI\mobile
npm run serve
```

**NÃO use** `ionic serve` diretamente - ele tentará usar `app:serve` e falhará.

---

## 📋 Comandos Disponíveis

### Desenvolvimento

```powershell
# Iniciar servidor (abre navegador)
npm run serve

# Iniciar servidor (não abre navegador)
npm run serve:no-open

# Build para desenvolvimento
npm run build -- --configuration development

# Build para produção
npm run build
```

### Capacitor

```powershell
# Sincronizar código com plataformas nativas
npm run sync

# Abrir projeto Android no Android Studio
npx cap open android
```

---

## ⚙️ Configuração

- **API Dev:** `https://api-dev.sistemasfarmamais.com/api`
- **API Prod:** `https://api.sistemasfarmamais.com/api`
- **Porta Dev:** `8100`
- **Projeto Angular:** `mobile` (não `app`)

---

## 🔧 Por que `--project=mobile` é necessário?

O Ionic CLI tenta detectar automaticamente o nome do projeto do Angular, mas por padrão assume `app`. Como nosso projeto se chama `mobile`, é necessário especificar explicitamente.

**Solução:** Use sempre `npm run serve` que já inclui o flag correto.

---

## 📱 Testar no Dispositivo

1. Conectar dispositivo Android via USB (depuração USB ativada)
2. Executar: `npx cap open android`
3. No Android Studio: Clicar em "Run"

---

**Última Atualização:** 21/01/2026
