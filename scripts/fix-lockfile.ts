import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lockPath = join(root, "package-lock.json");

const REQUIRED = [
  "@rollup/rollup-linux-x64-gnu",
  "@rollup/rollup-win32-x64-msvc",
  "@esbuild/linux-x64",
];

interface Lockfile {
  packages: Record<string, unknown>;
}

function platformEntries(lock: Lockfile): string[] {
  return Object.keys(lock.packages ?? {});
}

function missing(lock: Lockfile): string[] {
  const entries = platformEntries(lock);
  return REQUIRED.filter(
    (name) => !entries.some((entry) => entry === `node_modules/${name}`),
  );
}

function readLock(path: string): Lockfile {
  return JSON.parse(readFileSync(path, "utf-8")) as Lockfile;
}

function regenerate(): void {
  const temp = mkdtempSync(join(tmpdir(), "lockgen-"));
  try {
    copyFileSync(join(root, "package.json"), join(temp, "package.json"));
    execFileSync(
      process.platform === "win32" ? "npm.cmd" : "npm",
      ["install", "--package-lock-only", "--no-audit", "--no-fund"],
      { cwd: temp, stdio: "inherit" },
    );
    copyFileSync(join(temp, "package-lock.json"), lockPath);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

const checkOnly = process.argv.includes("--check");
let lock = readLock(lockPath);
let gaps = missing(lock);

if (gaps.length === 0) {
  console.log("package-lock.json contains every required platform binary.");
  process.exit(0);
}

if (checkOnly) {
  console.error(
    `package-lock.json is missing platform binaries: ${gaps.join(", ")}`,
  );
  console.error("Run `npm run lock:fix` and commit the result.");
  process.exit(1);
}

console.log(`Missing platform binaries: ${gaps.join(", ")}`);
console.log("Regenerating package-lock.json from a clean tree...");
regenerate();

lock = readLock(lockPath);
gaps = missing(lock);

if (gaps.length > 0) {
  console.error(`Still missing after regeneration: ${gaps.join(", ")}`);
  process.exit(1);
}

const rollup = platformEntries(lock).filter((entry) =>
  entry.startsWith("node_modules/@rollup/rollup-"),
);
console.log(
  `package-lock.json regenerated with ${rollup.length} rollup platform binaries.`,
);
