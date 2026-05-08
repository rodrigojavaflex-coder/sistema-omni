/**
 * Verificação de dependências da stack OMNI (backend, frontend, mobile).
 *
 * Antes de --refresh-deps / --bump-* / --audit-fix*: copia package.json e lock para .omni-deps-backup/
 * Se --full falhar após mutação: restaura arquivos e roda npm ci em cada pacote.
 * Recuperação manual: node scripts/verify-stack-deps.mjs --restore-backup
 *
 * Uso:
 *   node scripts/verify-stack-deps.mjs
 *   node scripts/verify-stack-deps.mjs --full
 *   node scripts/verify-stack-deps.mjs --refresh-deps --full
 *   node scripts/verify-stack-deps.mjs --bump-patch --full
 *   node scripts/verify-stack-deps.mjs --audit-fix --full
 *   node scripts/verify-stack-deps.mjs --audit-fix-force --full   (majors arriscadas; confirmação extra)
 *
 * Confirmação: SKIP_DEPS_CONFIRM=1 para pular (--refresh-deps / bump-* / --audit-fix*).
 */
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const BACKUP_DIR = path.join(REPO_ROOT, '.omni-deps-backup');

const PACKAGES = [
  { id: 'backend', relativePath: 'backend' },
  { id: 'frontend', relativePath: 'frontend' },
  { id: 'mobile', relativePath: 'mobile' },
  { id: 'root', relativePath: '.' },
];

function parseArgs(argv) {
  return {
    full: argv.includes('--full'),
    skipInstall: argv.includes('--skip-install'),
    skipEslint: argv.includes('--skip-eslint'),
    refreshDeps: argv.includes('--refresh-deps'),
    bumpPatch: argv.includes('--bump-patch'),
    bumpMinor: argv.includes('--bump-minor'),
    auditFix: argv.includes('--audit-fix'),
    auditFixForce: argv.includes('--audit-fix-force'),
    restoreBackup: argv.includes('--restore-backup'),
    noAudit: argv.includes('--no-audit'),
    auditProduction: argv.includes('--audit-production'),
    help: argv.includes('--help') || argv.includes('-h'),
  };
}

function run(cmd, args, cwd, { allowNonZero = false } = {}) {
  const res = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  if (res.error) {
    console.error(res.error);
    process.exit(1);
  }
  if (!allowNonZero && res.status !== 0) {
    process.exit(res.status ?? 1);
  }
  return res.status ?? 0;
}

/** Falha sem process.exit — para uso com rollback. */
function runOrThrow(cmd, args, cwd) {
  const res = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  if (res.error) {
    throw res.error;
  }
  if (res.status !== 0) {
    const msg = `[deps] Falha: ${cmd} ${args.join(' ')} (cwd: ${cwd}, código ${res.status ?? '?'})`;
    const err = new Error(msg);
    err.statusCode = res.status ?? 1;
    throw err;
  }
}

/** npm audit fix pode terminar com código ≠0 mesmo após aplicar patches (vulnerabilidades remanescentes). */
function runAuditFix(cmdArgs, cwd) {
  const res = spawnSync('npm', cmdArgs, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  if (res.error) throw res.error;
  if (res.status !== 0 && res.status != null) {
    console.warn(
      `\n[deps] npm ${cmdArgs.join(' ')} (em ${cwd}) saiu com código ${res.status}. ` +
        `É comum quando ainda há vulnerabilidades; com --full seguimos para npm ci + builds.\n`,
    );
  }
}

function hasPackageJson(dir) {
  return fs.existsSync(path.join(dir, 'package.json'));
}

function hasLockfile(dir) {
  return (
    fs.existsSync(path.join(dir, 'package-lock.json')) ||
    fs.existsSync(path.join(dir, 'npm-shrinkwrap.json'))
  );
}

function copyFileIfExists(src, destDir) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(destDir, { recursive: true });
  const base = path.basename(src);
  fs.copyFileSync(src, path.join(destDir, base));
}

function depsBackupSnapshot() {
  fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString();
  fs.writeFileSync(
    path.join(BACKUP_DIR, 'README.txt'),
    `Backup criado em ${stamp} pelo verify-stack-deps.mjs antes de alterar dependências.\n` +
      `Removido automaticamente após --full bem-sucedido pós-mutação.\n` +
      `Use --restore-backup se precisar reverter manualmente.\n`,
    'utf8',
  );

  for (const p of PACKAGES) {
    const pkgDir = path.join(REPO_ROOT, p.relativePath);
    if (!hasPackageJson(pkgDir)) continue;
    const dest = path.join(BACKUP_DIR, p.id);
    fs.mkdirSync(dest, { recursive: true });
    copyFileIfExists(path.join(pkgDir, 'package.json'), dest);
    copyFileIfExists(path.join(pkgDir, 'package-lock.json'), dest);
    copyFileIfExists(path.join(pkgDir, 'npm-shrinkwrap.json'), dest);
  }
}

function depsRestoreFilesFromBackup() {
  for (const p of PACKAGES) {
    const srcDir = path.join(BACKUP_DIR, p.id);
    if (!fs.existsSync(srcDir)) continue;
    const pkgDir = path.join(REPO_ROOT, p.relativePath);
    for (const name of ['package.json', 'package-lock.json', 'npm-shrinkwrap.json']) {
      const from = path.join(srcDir, name);
      if (fs.existsSync(from)) {
        fs.copyFileSync(from, path.join(pkgDir, name));
      }
    }
  }
}

function depsBackupRemove() {
  fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
}

function depsBackupExists() {
  return fs.existsSync(path.join(BACKUP_DIR, 'README.txt'));
}

function reinstallAllAfterRestore() {
  printSection('Reinstalando dependências (npm ci) após restauração');
  for (const p of PACKAGES) {
    const cwd = path.join(REPO_ROOT, p.relativePath);
    if (!hasPackageJson(cwd)) continue;
    console.log(`\n--- ${p.id} ---`);
    if (hasLockfile(cwd)) {
      runOrThrow('npm', ['ci'], cwd);
    } else {
      runOrThrow('npm', ['install'], cwd);
    }
  }
}

async function confirm(question) {
  if (process.env.SKIP_DEPS_CONFIRM === '1') return true;
  const rl = readline.createInterface({ input, output });
  try {
    const ans = (await rl.question(`${question} (s/N): `)).trim().toLowerCase();
    return ans === 's' || ans === 'sim' || ans === 'y' || ans === 'yes';
  } finally {
    rl.close();
  }
}

function printSection(title) {
  console.log('\n' + '='.repeat(Math.min(title.length + 8, 72)));
  console.log(` ${title}`);
  console.log('='.repeat(Math.min(title.length + 8, 72)) + '\n');
}

async function reportOutdated() {
  printSection('npm outdated (por pacote)');
  for (const p of PACKAGES) {
    const cwd = path.join(REPO_ROOT, p.relativePath);
    if (!hasPackageJson(cwd)) continue;
    console.log(`\n--- ${p.id} (${p.relativePath}) ---`);
    run('npm', ['outdated'], cwd, { allowNonZero: true });
  }
}

function reportAudit(opts) {
  printSection('npm audit');
  const extra = opts.auditProduction ? ['--production'] : [];
  for (const p of PACKAGES) {
    const cwd = path.join(REPO_ROOT, p.relativePath);
    if (!hasPackageJson(cwd)) continue;
    console.log(`\n--- ${p.id} (${p.relativePath}) ---`);
    run('npm', ['audit', ...extra], cwd, { allowNonZero: true });
  }
}

function installPackage(dir) {
  const cwd = path.join(REPO_ROOT, dir);
  if (!hasPackageJson(cwd)) return;
  if (hasLockfile(cwd)) {
    run('npm', ['ci'], cwd);
  } else {
    console.warn(`[warn] Sem lockfile em ${dir}; usando npm install`);
    run('npm', ['install'], cwd);
  }
}

function installPackageThrow(dir) {
  const cwd = path.join(REPO_ROOT, dir);
  if (!hasPackageJson(cwd)) return;
  if (hasLockfile(cwd)) {
    runOrThrow('npm', ['ci'], cwd);
  } else {
    console.warn(`[warn] Sem lockfile em ${dir}; usando npm install`);
    runOrThrow('npm', ['install'], cwd);
  }
}

function runValidations(opts) {
  const backendRoot = path.join(REPO_ROOT, 'backend');
  if (opts.skipEslint) {
    printSection('Validação backend (build; ESLint omitido por --skip-eslint)');
  } else {
    printSection('Validação backend (eslint sem --fix + build)');
    run('npx', ['eslint', 'src/**/*.ts'], backendRoot);
  }
  run('npm', ['run', 'build'], backendRoot);

  printSection('Validação frontend (build produção)');
  const frontendRoot = path.join(REPO_ROOT, 'frontend');
  run('npm', ['run', 'build', '--', '--configuration', 'production'], frontendRoot);

  printSection('Validação mobile (build)');
  const mobileRoot = path.join(REPO_ROOT, 'mobile');
  run('npm', ['run', 'build'], mobileRoot);
}

function runValidationsThrow(opts) {
  const backendRoot = path.join(REPO_ROOT, 'backend');
  if (opts.skipEslint) {
    printSection('Validação backend (build; ESLint omitido por --skip-eslint)');
  } else {
    printSection('Validação backend (eslint sem --fix + build)');
    runOrThrow('npx', ['eslint', 'src/**/*.ts'], backendRoot);
  }
  runOrThrow('npm', ['run', 'build'], backendRoot);

  printSection('Validação frontend (build produção)');
  const frontendRoot = path.join(REPO_ROOT, 'frontend');
  runOrThrow('npm', ['run', 'build', '--', '--configuration', 'production'], frontendRoot);

  printSection('Validação mobile (build)');
  const mobileRoot = path.join(REPO_ROOT, 'mobile');
  runOrThrow('npm', ['run', 'build'], mobileRoot);
}

function rollbackAfterMutationFailure(err) {
  console.error('\n[deps] Erro durante mutação ou validação:', err.message || err);
  if (!depsBackupExists()) {
    console.error('[deps] Sem backup em .omni-deps-backup/ — rollback manual necessário.');
    process.exit(err.statusCode ?? 1);
  }
  printSection('Rollback: restaurando package.json e locks do backup');
  try {
    depsRestoreFilesFromBackup();
    reinstallAllAfterRestore();
  } catch (rollbackErr) {
    console.error(
      '[deps] Falha ao restaurar. Backup mantido em .omni-deps-backup/. Rode: npm run deps:restore\n',
      rollbackErr,
    );
    process.exit(1);
  }
  depsBackupRemove();
  console.error('\n[deps] Estado restaurado ao momento anterior à mutação. Revise os logs acima.\n');
  process.exit(err.statusCode ?? 1);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(`
OMNI — verificação de dependências

Backup automático antes de --refresh-deps, --bump-*, --audit-fix ou --audit-fix-force.
Com --full, se npm ci/build/lint falhar: restaura manifestos + locks + npm ci (rollback).

  node scripts/verify-stack-deps.mjs
      Relatório: npm outdated + npm audit.

  node scripts/verify-stack-deps.mjs --full
      npm ci + validações.

  node scripts/verify-stack-deps.mjs --audit-fix --full
      Backup → npm audit fix (cada pacote) → relatório → npm ci + builds/lint.
      Falha na validação = rollback automático.
      Nem tudo é corrigível sem --audit-fix-force nem sem substituir pacotes sem fix.

  node scripts/verify-stack-deps.mjs --audit-fix-force --full
      Como acima com npm audit fix --force (pode subir majors). Mais risco; confirmação no terminal.

  node scripts/verify-stack-deps.mjs --refresh-deps --full
      Backup → npm update → relatório → npm ci + validações.

  node scripts/verify-stack-deps.mjs --bump-patch --full
      Backup → ncu patch + install → --full.

  node scripts/verify-stack-deps.mjs --restore-backup
      Restaura package.json/locks do último backup e npm ci (útil se o processo foi interrompido).

  Opções:
    --no-audit              Não executa npm audit
    --audit-production      npm audit --production no relatório
    --audit-fix             Correção segura recomendada: npm audit fix (combinar com --full)
    --audit-fix-force       npm audit fix --force (majors possíveis; usar com --full)
    --skip-eslint           Com --full, não roda ESLint no backend
    --full --skip-install   Valida sem npm ci antes (node_modules precisam estar alinhados aos locks)
`);
    process.exit(0);
  }

  process.chdir(REPO_ROOT);

  if (opts.restoreBackup) {
    if (!depsBackupExists()) {
      console.error('Nenhum backup em .omni-deps-backup/. Nada a restaurar.');
      process.exit(1);
    }
    printSection('Restauração manual a partir de .omni-deps-backup/');
    depsRestoreFilesFromBackup();
    reinstallAllAfterRestore();
    depsBackupRemove();
    console.log('\nRestauração concluída.\n');
    process.exit(0);
  }

  if (opts.auditFix && opts.auditFixForce) {
    console.error('Use apenas uma entre: --audit-fix e --audit-fix-force');
    process.exit(1);
  }

  const mutateCount =
    Number(opts.refreshDeps) +
    Number(opts.bumpPatch) +
    Number(opts.bumpMinor) +
    Number(opts.auditFix) +
    Number(opts.auditFixForce);
  if (mutateCount > 1) {
    console.error(
      'Use apenas uma mutação entre: --refresh-deps, --bump-patch, --bump-minor, --audit-fix, --audit-fix-force',
    );
    process.exit(1);
  }

  const willMutate = mutateCount === 1;

  if (willMutate) {
    if (opts.refreshDeps) {
      const ok = await confirm('Continuar com npm update em cada pacote (pode alterar locks)?');
      if (!ok) {
        console.log('Operação cancelada.');
        process.exit(0);
      }
    } else if (opts.bumpPatch) {
      const ok = await confirm(
        'Isso alterará package.json e locks (patch via npm-check-updates). Continuar?',
      );
      if (!ok) {
        console.log('Operação cancelada.');
        process.exit(0);
      }
    } else if (opts.bumpMinor) {
      const ok = await confirm(
        'Isso alterará package.json e locks (minor via npm-check-updates). Continuar?',
      );
      if (!ok) {
        console.log('Operação cancelada.');
        process.exit(0);
      }
    } else if (opts.auditFix) {
      const ok = await confirm(
        'Executar npm audit fix em backend, frontend, mobile e raiz (altera package-lock / package.json)?',
      );
      if (!ok) {
        console.log('Operação cancelada.');
        process.exit(0);
      }
      if (!opts.full) {
        console.warn(
          '\n[deps] Sem --full, não haverá validação automática nem rollback ao detectar quebra.\n',
        );
      }
    } else if (opts.auditFixForce) {
      const ok = await confirm(
        'ATENÇÃO: npm audit fix --force pode atualizar majors e quebrar builds. Confirmar?',
      );
      if (!ok) {
        console.log('Operação cancelada.');
        process.exit(0);
      }
      if (!opts.full) {
        console.warn(
          '\n[deps] Sem --full, rollback automático em caso de falha não roda até você validar.\n',
        );
      }
    }

    depsBackupSnapshot();
    printSection('Backup salvo em .omni-deps-backup/');

    try {
      if (opts.refreshDeps) {
        printSection('npm update (respeita ranges em package.json)');
        for (const p of PACKAGES) {
          const cwd = path.join(REPO_ROOT, p.relativePath);
          if (!hasPackageJson(cwd)) continue;
          console.log(`\n--- ${p.id} ---`);
          runOrThrow('npm', ['update'], cwd);
        }
      } else if (opts.bumpPatch || opts.bumpMinor) {
        const target = opts.bumpMinor ? 'minor' : 'patch';
        printSection(`npx npm-check-updates -t ${target} + npm install`);
        for (const p of PACKAGES) {
          const cwd = path.join(REPO_ROOT, p.relativePath);
          if (!hasPackageJson(cwd)) continue;
          console.log(`\n--- ${p.id} ---`);
          runOrThrow('npx', ['--yes', 'npm-check-updates', '-t', target, '-u'], cwd);
          runOrThrow('npm', ['install'], cwd);
        }
      } else if (opts.auditFix) {
        printSection('npm audit fix (backend, frontend, mobile, raiz)');
        for (const p of PACKAGES) {
          const cwd = path.join(REPO_ROOT, p.relativePath);
          if (!hasPackageJson(cwd)) continue;
          console.log(`\n--- ${p.id} ---`);
          runAuditFix(['audit', 'fix'], cwd);
        }
      } else if (opts.auditFixForce) {
        printSection('npm audit fix --force (pode causar upgrades major)');
        for (const p of PACKAGES) {
          const cwd = path.join(REPO_ROOT, p.relativePath);
          if (!hasPackageJson(cwd)) continue;
          console.log(`\n--- ${p.id} ---`);
          runAuditFix(['audit', 'fix', '--force'], cwd);
        }
      }

      await reportOutdated();
      if (!opts.noAudit) {
        reportAudit(opts);
      }

      if (opts.full) {
        if (!opts.skipInstall) {
          printSection('npm ci (ou install se não houver lock)');
          for (const p of PACKAGES) {
            installPackageThrow(p.relativePath);
          }
        }
        runValidationsThrow(opts);
        depsBackupRemove();
        printSection('Concluído: validações passaram — backup removido');
      } else {
        console.log(
          '\n[deps] Backup mantido em .omni-deps-backup/ até você rodar o mesmo comando com --full (sucesso remove o backup) ou usar --restore-backup.\n',
        );
      }
    } catch (err) {
      rollbackAfterMutationFailure(err);
    }
  } else {
    await reportOutdated();
    if (!opts.noAudit) {
      reportAudit(opts);
    }

    if (opts.full) {
      if (!opts.skipInstall) {
        printSection('npm ci (ou install se não houver lock)');
        for (const p of PACKAGES) {
          installPackage(p.relativePath);
        }
      }
      runValidations(opts);
      printSection('Concluído: validações passaram');
    } else {
      console.log(
        '\nDica: segurança com rollback: npm run deps:audit-fix:full (ou --audit-fix-force --full)\n',
      );
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
