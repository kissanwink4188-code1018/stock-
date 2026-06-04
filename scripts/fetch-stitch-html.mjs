import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "public", "stitch", "equidash.html");

if (existsSync(outFile)) {
  console.log(`Stitch HTML 스냅샷 사용: ${outFile}`);
} else {
  console.warn(
    "public/stitch/equidash.html 없음 — 로컬에서 /api/stitch/html 응답을 저장하거나 STITCH_API_KEY로 생성하세요.",
  );
}
