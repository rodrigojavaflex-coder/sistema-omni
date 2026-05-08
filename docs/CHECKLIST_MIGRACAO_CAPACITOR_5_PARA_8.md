# Checklist — migração Capacitor 5 → 8 (OMNI Mobile)

Este documento é um roteiro **passo a passo** alinhado aos **Upgrade Guides oficiais** e aos **pacotes/código que o app OMNI usa hoje**.

**Referências oficiais (sempre revisar na versão atual do site):**

- [Atualizar para 6.0](https://capacitorjs.com/docs/updating/6-0)
- [Atualizar para 7.0](https://capacitorjs.com/docs/updating/7-0)
- [Atualizar para 8.0](https://capacitorjs.com/docs/updating/8-0)

---

## 1. Inventário atual no repositório (baseline)

### 1.1 Dependências (`mobile/package.json`)

| Pacote | Versão atual (baseline) |
|--------|-------------------------|
| `@capacitor/core`, `@capacitor/android`, `@capacitor/cli` | ^5 |
| `@capacitor/app`, `@capacitor/camera`, `@capacitor/preferences` | ^5 |
| `capacitor-native-biometric` | ^4.2.2 |
| `capacitor-secure-storage-plugin` | ^0.9.0 |
| `capacitor-voice-recorder` | ^5.0.0 |
| `@ionic/angular` | ^7 |

### 1.2 Onde o código chama APIs (revisão obrigatória após cada salto major)

| Área | Arquivo(s) | APIs |
|------|------------|------|
| App / info | `mobile/src/app/pages/sobre/sobre.page.ts` | `App.getInfo()` |
| Plataforma / base URL | Vários services + `app.component.ts`, páginas | `Capacitor.getPlatform()` |
| Sessão / biometria / storage | `mobile/src/app/services/auth.service.ts` | `Preferences`, `NativeBiometric`, `SecureStoragePlugin` |
| Câmera + áudio (vistoria) | `mobile/src/app/pages/vistoria/vistoria-irregularidade.page.ts` | `Camera.getPhoto`, `VoiceRecorder.*` |

### 1.3 Config (`mobile/capacitor.config.ts`)

- `server.androidScheme: 'https'` — no **Capacitor 6** o default passa a ser `https`; quem já usa `https` pode **remover** a chave redundante quando seguir o guia (ver doc 6.0 sobre `androidScheme` e perda de storage/cookies ao mudar esquema).

---

## 2. Estratégia recomendada: **5 → 6 → 7 → 8** (incremental)

**Por quê não “pular” direto:** cada major altera Gradle, Xcode mínimo, Node e APIs deprecadas. Migrar **em três saltos** reduz superfície de erro e permite testar **`npx cap migrate`** por etapa.

**Em cada etapa:**

1. **Branch Git** dedicada (`chore/capacitor-6`, depois `-7`, depois `-8`).
2. Cumprir **requisitos de Node / Android Studio / Xcode** daquele número **antes** de subir `@capacitor/cli`.
3. Atualizar **versões npm alinhadas** (core + plataforma + plugins oficiais na **mesma** major).
4. Rodar **`npx cap migrate`** e corrigir o que o CLI apontar.
5. **`npx cap sync`**, build nativo Android (e iOS se existir), **testes manuais** nos fluxos da tabela 1.2.
6. Só então repetir para a próxima major.

---

## 3. Pré-requisitos de ambiente por alvo

| Versão Capacitor | Node (guia oficial) | Android Studio (guia) | Xcode (guia) |
|------------------|---------------------|-------------------------|---------------|
| **6** | 18+ | Hedgehog \| 2023.1.1+ | 15+ |
| **7** | 20+ | Ladybug \| 2024.2.1+ (JDK 21) | 16+ |
| **8** | 22+ | Otter \| 2025.2.1+ | Conforme doc 8.0 (verificar no link oficial a versão indicada na data da migração) |

**Projeto OMNI (`package.json` raiz):** hoje `"node": ">=18.0.0"`. Ao fechar na **Cap 8**, a raiz/monorepo deve permitir pelo menos **Node 22** onde o mobile é buildado (CI incluso).

---

## 4. Checklist Capacitor 5 → **6**

- [ ] **Node:** 18+ instalado onde roda `npm`/`cap`.
- [ ] Instalar CLI da linha 6 e migrar:
  - [ ] `npm i -D @capacitor/cli@latest-6`
  - [ ] `npx cap migrate` (resolver avisos do terminal).
- [ ] **Android:** Android Studio Hedgehog+; atualizar `variables.gradle`, Gradle wrapper, AGP/google-services conforme [guia 6.0](https://capacitorjs.com/docs/updating/6-0).
- [ ] **`androidScheme`:** revisar impacto em **cookies/localStorage** (doc 6.0 — se não usava `https` antes, há orientação específica).
- [ ] **Kotlin:** atualizar versão indicada no guia (se projeto usa Kotlin).
- [ ] **iOS:** Xcode 15+; plugins registrados/custom code conforme doc; zoom iOS opcional (`zoomEnabled`).
- [ ] **`addListener`:** se usado sem `await`, ajustar (retorno agora só `Promise`).
- [ ] **`@capacitor/camera`:** OMNI usa `Camera.getPhoto` em `vistoria-irregularidade.page.ts` — revisar permissões Android (Photo Picker / cancelamento mensagem nova no Android).
- [ ] Atualizar **plugins oficiais** para **`@capacitor/*@6`** alinhados com `core`.
- [ ] **Plugins de comunidade — validar antes de bump:**
  - [ ] `capacitor-voice-recorder` — distribuição compatível com **Cap 6**.
  - [ ] `capacitor-native-biometric` — release compatível com **Cap 6**.
  - [ ] `capacitor-secure-storage-plugin` — release compatível com **Cap 6**.
- [ ] `npx cap sync` + build APK + regressão: login, biometria, storage, foto, gravar áudio, “sobre”, APIs base URL nativo.

---

## 5. Checklist Capacitor 6 → **7**

- [ ] **Node:** 20+.
- [ ] Remover **`bundledWebRuntime`** e **`cordova.staticPlugins`** do config se existirem ([guia 7.0](https://capacitorjs.com/docs/updating/7-0)).
- [ ] Telemetry: opcional `npx cap telemetry off`.
- [ ] `npm i -D @capacitor/cli@latest-7` + `npx cap migrate`.
- [ ] **iOS:** deployment target **14.0**; Xcode 16+.
- [ ] **Android:** Android Studio Ladybug+; JDK 21; `variables.gradle`/Gradle conforme doc; entrada opcional **`navigation`** em `configChanges` no `AndroidManifest`.
- [ ] **Plugins oficiais** para **`@capacitor/*@7`** (versões 7.0.0+ no guia).
- [ ] **`@capacitor/app`:** remover tipos deprecados dos imports se aparecer erro de build — usar `RestoredListenerEvent` / `URLOpenListenerEvent` em vez dos antigos.
- [ ] Rever novamente **`capacitor-voice-recorder`**, **`capacitor-native-biometric`**, **`capacitor-secure-storage-plugin`** para **Cap 7** (changelog / issues).
- [ ] **`@ionic/angular`:** avaliar atualização junto ou logo após (Ionic ↔ Cap matrix da época da migração).
- [ ] `npx cap sync` + testes manuais (mesmo conjunto da etapa anterior).

---

## 6. Checklist Capacitor 7 → **8**

- [ ] **Node:** 22+.
- [ ] Ler breaking changes do **Capacitor config** ([guia 8.0](https://capacitorjs.com/docs/updating/8-0)): `appendUserAgent` iOS (espaço extra), **`android.adjustMarginsForEdgeToEdge` removido** — migrar comportamento para **System Bars** / CSS `env()` se você usava isso (OMNI atual não lista `adjustMargins`; confirmar projeto Android gerado).
- [ ] **`@capacitor/cli`:** `npm i -D @capacitor/cli@latest` + `npx cap migrate`.
- [ ] **iOS:** deployment target **15.0**; Xcode conforme doc 8.0; CocoaPods/`Podfile` se aplicável.
- [ ] **Android:** Otter 2025.2.1+; AGP 8.13.0 / Gradle wrapper 8.14.3; `variables.gradle` mínimos do guia; sintaxe Gradle `=` (diff do doc); `google-services` 4.4.4; Kotlin 2.2.20 doc; **`density`** em `configChanges`.
- [ ] Breaking Android: **`bridge_layout_main.xml`** renomeado no ecossistema — se houver código customizado apontando para o arquivo antigo, trocar para `capacitor_bridge_layout_main.xml`.
- [ ] **Plugins oficiais** para **`@capacitor/*@8`** alinhados.
- [ ] Comunidade: confirmar **`capacitor-voice-recorder`**, **`capacitor-native-biometric`**, **`capacitor-secure-storage-plugin`** para **Cap 8** (evitar o mesmo tipo de **ERESOLVE** que ocorreu com `audit fix --force` no Cap 5).
- [ ] `npx cap sync` + regressão completa nos fluxos nativos.

---

## 7. Plugins de terceiros (OMNI) — pontos críticos

### 7.1 `capacitor-voice-recorder`

- Usado em **`vistoria-irregularidade.page.ts`** (`hasAudioRecordingPermission`, `requestAudioRecordingPermission`, `startRecording`, `stopRecording`, `canDeviceVoiceRecord`).
- Para cada major de Capacitor, usar **release do pacote** explicitamente compatível (`peerDependencies`/`README`). Não misturar **Cap 5 core** com **`npm audit fix --force`** tentando empurrar **`1.x`** antigo (foi cenário que conflita com **`@capacitor/core` 5**).

### 7.2 `capacitor-native-biometric`

- Usado em **`auth.service.ts`** (`isAvailable`, `verifyIdentity`).
- Algumas versões ficam atrás ou exigem ajustes de permissões/strings no nativo ao subir SDK.

### 7.3 `capacitor-secure-storage-plugin`

- Usado em **`auth.service.ts`** (`get` / `set` / `remove`).
- Avaliar atualização ou alternativa caso não haja suporte na linha Cap alvo.

### 7.4 Oficiais usados pelo OMNI

- **`@capacitor/app`** — apenas `App.getInfo()` hoje (baixo risco de tipos; ainda assim seguir removals de tipos no 7+ se importar outros).
- **`@capacitor/preferences`** — uso direto em `auth.service.ts`.
- **`@capacitor/camera`** — fluxo foto em vistoria; **Cap 6+** pode alterar permissões Android e mensagens de cancelamento — testar em aparelho real.

---

## 8. **Não usar** como plano único para migrar produto

- **`npm audit fix --force` no mobile** junto do restante do monorepo — pode instalar majors **incompatíveis** entre si (como visto em `npm ci`/`ERESOLVE`). Migrar Capacitor seguindo esta checklist + versões conscientes substitui isso.

---

## 9. Critérios de “pronto” por etapa

- [ ] `ng build` (mobile).
- [ ] Gradle assemble / run no Android Studio sem erro (e equivalente Xcode se existir `ios/`).
- [ ] Fluxos: login persistido / logout, biometria (ativar/desativar quando aplicável), chave segura (token), captura foto, gravar/reprodução do fluxo de áudio, página “sobre”, chamadas HTTP em nativo quando `platform !== web`.

---

## 10. Rastreabilidade (RN / governança)

- Migrações de toolchain que afetarem **URLs nativas**, **armazenamento** ou **permissões de câmera/microfone** podem tocar **riscos funcionais** (**auth**, **vistoria**).
- Ao concluir etapas, vale registrar em PR **o que foi testado** e **mudanças de versão SDK** aceitas pelo produto.

---

## 11. Registro de execução (2026-05-07 — salto direto 5 → 8)

- **Abordagem:** atualização direta para Capacitor 8 em `mobile/` (em vez de três branches 6/7/8), com ajustes Android e plugins alinhados aos peers oficiais.
- **Dependências (`mobile/package.json`):** `@capacitor/*` e CLI em **^8**; removido **`capacitor-native-biometric`**; adicionado **`@aparajita/capacitor-biometric-auth` ^10**; **`capacitor-secure-storage-plugin` ^0.13**; **`capacitor-voice-recorder` ^7.0.6** (peer Cap 7+).
- **`auth.service.ts`:** uso de **`BiometricAuth.checkBiometry()`** (disponibilidade) e **`BiometricAuth.authenticate()`** com **`allowDeviceCredential: true`**.
- **Android:** `variables.gradle` alinhado ao guia **8** (API 36, libs AndroidX do doc); Gradle **8.14.3**; **`compileSdk`** com sintaxe Gradle nova no `app/build.gradle`; **`google-services` 4.4.4**; `AndroidManifest` com **`navigation`** e **`density`** em `configChanges`; **`settings.gradle`** com plugin **`foojay-resolver-convention`**; **`mobile/android/build.gradle`** com toolchain **Java 21** em todas as tarefas `JavaCompile` (Gradle pode rodar com JDK 17; compilação dos módulos Capacitor usa JDK 21 via toolchain).
- **Builds automatizados validados aqui:** `npm install`, `npx cap sync android`, `npx ng build --configuration production`, `gradlew.bat assembleDebug`.
- **Manual / próximos passos:** regressão física conforme §9 (login, biometria, storage, foto, áudio); pasta **`mobile/ios/`** ausente no repo — ao criar projeto iOS com `cap add ios`, incluir **`NSFaceIDUsageDescription`** no `Info.plist`; CI e desenvolvedores: **Node 22+** (§3 — `engines` na raiz ajustados).

---

_Fonte dos requisitos e breaking changes nas seções por major: documentação Capacitor nos links da seção 1. Plugins de comunidade: verificar sempre o repositório/npm na data em que executar o upgrade._
