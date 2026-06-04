import { cpSync, existsSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(root, "app", "api");
const apiBackup = path.join(root, "app", "_api_server_backup");

function run(cmd, args, env = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function backupApi() {
  if (!existsSync(apiDir)) return;
  if (existsSync(apiBackup)) rmSync(apiBackup, { recursive: true, force: true });
  cpSync(apiDir, apiBackup, { recursive: true });
  rmSync(apiDir, { recursive: true, force: true });
}

function restoreApi() {
  if (!existsSync(apiBackup)) return;
  if (existsSync(apiDir)) rmSync(apiDir, { recursive: true, force: true });
  cpSync(apiBackup, apiDir, { recursive: true });
  rmSync(apiBackup, { recursive: true, force: true });
}

try {
  backupApi();

  run("node", ["scripts/fetch-stitch-html.mjs"]);

  run("npm", ["run", "build"], {
    GITHUB_PAGES: "true",
    NEXT_PUBLIC_STATIC_EXPORT: "true",
    NEXT_PUBLIC_BASE_PATH: "/stock-",
  });

  const outDir = path.join(root, "out");
  if (!existsSync(outDir)) {
    console.error("out/ folder missing after build");
    process.exit(1);
  }

  const publishDir = preparePublishDir(root, outDir);
  writeFileSync(path.join(publishDir, ".nojekyll"), "");
  console.log(`Pages publish dir ready: ${publishDir}`);
} finally {
  restoreApi();
}

function preparePublishDir(root, outDir) {
  const publishDir = path.join(root, ".pages-publish");
  const nested = path.join(outDir, "stock-");

  rmSync(publishDir, { recursive: true, force: true });

  if (existsSync(nested)) {
    cpSync(nested, publishDir, { recursive: true });
    const nextAtRoot = path.join(outDir, "_next");
    if (existsSync(nextAtRoot)) {
      cpSync(nextAtRoot, path.join(publishDir, "_next"), { recursive: true });
    }
    const stitchDir = path.join(outDir, "stitch");
    if (existsSync(stitchDir)) {
      cpSync(stitchDir, path.join(publishDir, "stitch"), { recursive: true });
    }
  } else {
    cpSync(outDir, publishDir, { recursive: true });
  }

  return publishDir;
}
