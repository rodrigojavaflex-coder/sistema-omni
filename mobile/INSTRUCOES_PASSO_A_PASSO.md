# INSTRUÇÕES PASSO A PASSO - SETUP MOBILE

## ✅ PASSO 1: CONCLUÍDO
**Dependências instaladas**
- `npm install` executado com sucesso
- 947 pacotes instalados

---

## ✅ PASSO 2: CONCLUÍDO  
**Ionic CLI instalado**
- Versão: 7.2.1
- Comando: `npm install -g @ionic/cli`

---

## ⚠️ PASSO 3: AÇÃO NECESSÁRIA
**Criar projeto Ionic base**

Como a estrutura foi criada manualmente, precisamos criar o projeto Ionic base para ter o `angular.json` e outras configurações.

### Opção A: Recriar projeto (Recomendado)

```powershell
# 1. Fazer backup dos arquivos criados (se houver algo importante)
cd C:\PROJETOS\OMNI
Copy-Item "mobile\src" "mobile_src_backup" -Recurse -Force -ErrorAction SilentlyContinue

# 2. Remover diretório mobile
Remove-Item "mobile" -Recurse -Force

# 3. Criar projeto Ionic
ionic start mobile blank --type=angular --capacitor --no-git

# 4. Quando perguntar se quer instalar dependências, escolher "No" (já instalamos)
# 5. Depois copiar nossos arquivos de volta
```

### Opção B: Usar estrutura atual e criar angular.json manualmente

Se preferir manter a estrutura atual, posso criar o `angular.json` manualmente.

**O que você prefere?** Recriar o projeto (Opção A) ou criar angular.json manualmente (Opção B)?

---

## 📋 PASSO 4: Adicionar plataforma Android

**Após o Passo 3 estar completo:**

```powershell
cd C:\PROJETOS\OMNI\mobile
npx cap add android
```

**O que faz:** Adiciona a plataforma Android ao projeto Capacitor.

---

## 📋 PASSO 5: Sincronizar Capacitor

```powershell
cd C:\PROJETOS\OMNI\mobile
npx cap sync
```

**O que faz:** Sincroniza o código web com as plataformas nativas.

---

## 📋 PASSO 6: Testar no navegador

```powershell
cd C:\PROJETOS\OMNI\mobile
ionic serve
```

**O que faz:** Inicia servidor de desenvolvimento e abre no navegador.

**O que verificar:**
- ✅ App abre no navegador
- ✅ Tela de login aparece
- ✅ Consegue fazer login
- ✅ Tela Home mostra dados do usuário

---

## 📋 PASSO 7: Testar no dispositivo Android

```powershell
cd C:\PROJETOS\OMNI\mobile
npx cap open android
```

**O que faz:** Abre o projeto no Android Studio.

**No Android Studio:**
1. Conectar dispositivo Android via USB (com depuração USB ativada)
2. Ou iniciar um emulador Android
3. Clicar em "Run" (Shift+F10) ou botão verde de play
4. App será instalado e executado no dispositivo

**O que verificar:**
- ✅ App instala no dispositivo
- ✅ Tela de login aparece
- ✅ Consegue fazer login
- ✅ Tela Home mostra dados do usuário
- ✅ Logout funciona

---

## 🔧 CONFIGURAÇÕES ADICIONAIS NECESSÁRIAS

### 1. Copiar nossos arquivos para o projeto Ionic

Após criar o projeto base, copiar:

```powershell
# Copiar arquivos de autenticação
Copy-Item "mobile_backup\src\app\services\auth.service.ts" "mobile\src\app\services\" -Force
Copy-Item "mobile_backup\src\app\models\usuario.model.ts" "mobile\src\app\models\" -Force
Copy-Item "mobile_backup\src\app\guards\auth.guard.ts" "mobile\src\app\guards\" -Force
Copy-Item "mobile_backup\src\app\interceptors\auth.interceptor.ts" "mobile\src\app\interceptors\" -Force

# Copiar páginas
Copy-Item "mobile_backup\src\app\pages\login" "mobile\src\app\pages\" -Recurse -Force
Copy-Item "mobile_backup\src\app\pages\home" "mobile\src\app\pages\" -Recurse -Force

# Copiar environments
Copy-Item "mobile_backup\src\environments\environment.ts" "mobile\src\environments\" -Force
Copy-Item "mobile_backup\src\environments\environment.prod.ts" "mobile\src\environments\" -Force

# Atualizar rotas em app.routes.ts
# Atualizar main.ts para incluir interceptor
# Atualizar app.component se necessário
```

### 2. Instalar dependência do Capacitor Preferences

```powershell
cd C:\PROJETOS\OMNI\mobile
npm install @capacitor/preferences
```

### 3. Atualizar main.ts

Adicionar o interceptor no `main.ts`:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';

// No bootstrapApplication:
provideHttpClient(withInterceptors([authInterceptor]))
```

### 4. Atualizar rotas

Adicionar as rotas de login e home no `app.routes.ts`.

---

## ⚠️ IMPORTANTE

1. **Backend deve estar rodando** em `localhost:3000` (dev) ou acessível via `api-dev.sistemasfarmamais.com`
2. **CORS já foi atualizado** no backend para aceitar requisições do mobile
3. **Testar conexão** antes de compilar para Android

---

## 🆘 TROUBLESHOOTING

### Erro: "Cannot find module"
- Executar: `npm install`

### Erro: "angular.json not found"
- Projeto precisa ser criado com `ionic start`

### Erro de CORS no navegador
- Verificar se backend está rodando
- Verificar URL da API no environment.ts

### Erro no dispositivo: "Network request failed"
- Verificar se está usando a URL correta (api-dev.sistemasfarmamais.com)
- Verificar conexão com internet
- Verificar se backend está acessível

---

**Última Atualização:** 21/01/2026
