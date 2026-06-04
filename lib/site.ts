/** GitHub Pages 프로젝트 사이트: /stock- */
export const GITHUB_PAGES_BASE_PATH = "/stock-";

export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!base) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${normalized}`;
}
