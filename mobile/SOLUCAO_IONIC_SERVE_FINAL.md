# ✅ SOLUÇÃO FINAL - IONIC SERVE

## Problema

O comando `ionic serve` tenta usar `app:serve` mas o projeto se chama `mobile`, causando erro:
```
Error: Unknown arguments: host, port
```

## Solução

**SEMPRE use um dos comandos abaixo:**

### Opção 1: Script npm (RECOMENDADO) ⭐

```powershell
cd C:\PROJETOS\OMNI\mobile
npm run serve
```

Este comando já inclui `--project=mobile` automaticamente.

### Opção 2: Comando direto com flag

```powershell
cd C:\PROJETOS\OMNI\mobile
ionic serve --project=mobile
```

### Opção 3: Sem abrir navegador

```powershell
npm run serve:no-open
# ou
ionic serve --project=mobile --no-open
```

---

## Por que isso acontece?

- O Ionic CLI tenta detectar automaticamente o nome do projeto
- Por padrão, ele assume que o projeto se chama `app`
- Nosso projeto se chama `mobile` (definido no `angular.json`)
- É necessário especificar explicitamente com `--project=mobile`

---

## Scripts Disponíveis no package.json

```json
{
  "scripts": {
    "serve": "ionic serve --project=mobile",
    "serve:no-open": "ionic serve --project=mobile --no-open",
    "sync": "npx cap sync"
  }
}
```

---

## ✅ Resumo

**Use sempre:** `npm run serve` 

Isso evita ter que lembrar do flag `--project=mobile` toda vez.

---

**Última Atualização:** 21/01/2026
