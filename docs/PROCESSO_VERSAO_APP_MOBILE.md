# Processo de versão do aplicativo mobile

Documento operacional do OMNI (RN-AUTH-007).  
Objetivo: deixar claro **o que é versão do app**, **catálogo**, **versão mínima** e **como atualizar / testar / bloquear**.

---

## 1. Três conceitos (não misturar)

| Conceito | Onde fica | Para que serve |
|----------|-----------|----------------|
| **Versão do app** | `mobile/src/app/constants/app-version.ts` (+ `build.gradle`, `mobile/package.json`) | O que o APK “é”. Aparece no **Login** e no **Sobre**. Vai no header `X-App-Version`. |
| **Catálogo** | `backend/src/data/mobile-app-versions.json` | Lista de opções do **combobox** na Configuração → aba **App** (versão + data). |
| **Versão mínima (bloqueio)** | Banco (`configuracoes.mobile_versao_minima`), tela Configuração → App | A partir de qual versão a **API aceita** o app. |

- Remover uma linha do JSON **não** muda a versão do APK.
- Rodar o script **sem** `-NewVersion` / `-AppVersion` **só rebuilda** a versão já gravada em `app-version.ts`.
- A versão da **web** (`deploy.ps1 -VersionBump`) é **outra linha** (RN-AUTH-003) e **não** controla o app.

---

## 2. Onde a versão do app é definida

Arquivo principal:

```ts
// mobile/src/app/constants/app-version.ts
export const APP_VERSION = '1.3.9';
export const APP_BUILD = '10309';
export const APP_VERSION_DATE = '2026-09-25';
```

Também atualizados pelo script de release:

- `mobile/android/app/build.gradle` → `versionName` / `versionCode`
- `mobile/package.json` → `"version"`

Consumidores no app:

- Login: texto `Versão {{ APP_VERSION }}`
- Sobre: badge / info de versão
- Interceptor HTTP: header `X-App-Version: APP_VERSION`

---

## 3. Script `run-emulator-clean.ps1`

Na raiz do repositório (`C:\PROJETOS\OMNI`).

### Comandos

```powershell
# Rebuild + instalar no emulador/aparelho, SEM mudar o número da versão
.\run-emulator-clean.ps1

# Produção (API prod) — idem, sem bump
.\run-emulator-clean.ps1 -Production

# Sobe o PATCH (ex.: 1.3.8 → 1.3.9), atualiza arquivos + catálogo, build e instala
.\run-emulator-clean.ps1 -NewVersion

# Fixa uma versão explícita (sobe ou desce), atualiza arquivos + catálogo, build e instala
.\run-emulator-clean.ps1 -AppVersion 1.3.8

# Combinar com produção
.\run-emulator-clean.ps1 -Production -NewVersion
.\run-emulator-clean.ps1 -Production -AppVersion 1.3.9
```

### O que `-NewVersion` / `-AppVersion` alteram

1. `mobile/src/app/constants/app-version.ts`
2. `mobile/android/app/build.gradle`
3. `mobile/package.json`
4. `backend/src/data/mobile-app-versions.json` (inclui `{ version, date }` se ainda não existir)

UTF-8 **sem BOM** (para a API ler o JSON corretamente).

---

## 4. Release real (APK instalado celular a celular)

Ordem **obrigatória** para não trancar a frota:

1. Gerar e instalar o APK novo  
   `.\run-emulator-clean.ps1 -Production -NewVersion`  
   (ou `-AppVersion x.y.z`)
2. Distribuir / instalar o APK nos aparelhos
3. `.\deploy.ps1` + `.\scripts\atualizar-servidor.ps1`  
   (sobe o backend com o guard e o catálogo JSON)
4. **Por último:** Configuração do Sistema → aba **App** → escolher a **versão mínima** = versão do APK novo → **Salvar**

Só no passo 4 os apps antigos passam a ser bloqueados.

Se setar a mínima **antes** de instalar o APK novo, a frota antiga fica sem acesso.

---

## 5. Configuração web (aba App)

- **Versão mínima do app:** combobox (`x.y.z — dd/mm/aaaa`) ou “Não bloquear”.
- **Catálogo de versões:** lista com botão **Remover** (tira do JSON/combo; se era a mínima ativa, limpa o bloqueio).
- Permissão: `configuracao:access`.

Após editar o JSON à mão ou rodar `-NewVersion`, o backend local (`npm run start:dev`) precisa estar rodando e a tela de Configuração deve ser **recarregada**. Em ambiente publicado, o JSON sobe no deploy do backend.

---

## 6. Teste de bloqueio (DEV)

Cenário: app `1.3.8`, mínima `1.3.9`.

```powershell
.\run-emulator-clean.ps1 -AppVersion 1.3.8
```

1. Abrir o app → Login deve mostrar **Versão 1.3.8**.
2. Na web (API local via proxy): Configuração → App → mínima **1.3.9** → Salvar.
3. Esperado: overlay “Atualização necessária”, login/API bloqueados.

Para liberar:

```powershell
.\run-emulator-clean.ps1 -AppVersion 1.3.9
```

(ou superior à mínima).

---

## 7. API (referência)

| Item | Detalhe |
|------|---------|
| Header | `X-App-Version: 1.3.8` |
| Sem header | Web / Postman **não** bloqueiam |
| Abaixo da mínima | HTTP `426`, código `APP_VERSION_REQUIRED` |
| Consulta pública | `GET /configuracao/mobile-versao-minima` |
| Remover do catálogo | `DELETE /configuracao/mobile-versoes/:version` |

---

## 8. Checklist rápido

- [ ] Versão do app conferida em Login / Sobre após instalar o APK  
- [ ] Catálogo mostra a versão nova no combo (após deploy/backend)  
- [ ] APKs instalados nos aparelhos **antes** de subir a mínima  
- [ ] Mínima setada na aba App  
- [ ] App antigo bloqueado; app novo entra  

---

## Referências

- Regra de negócio: **RN-AUTH-007** em `docs/regras-negocio.md`
- Versão da web (SPA): **RN-AUTH-003** (`deploy.ps1 -VersionBump`) — independente deste processo
