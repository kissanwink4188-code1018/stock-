import type { StitchProjectSummary } from "@/lib/stitch";

/** EquiDash Stock Dashboard (US Stock News Tracker 프로젝트) */
export const DEFAULT_STITCH_PROJECT_ID = "6886253415049893546";
export const DEFAULT_STITCH_SCREEN_ID = "0549ff865b7d4906a9de93066a023b98";

const PREFERRED_PROJECT_PATTERNS = [/equidash/i, /us stock/i, /stock.*dashboard/i, /news tracker/i];

export function pickPreferredStitchProject(
  projects: Array<{ id: string; title: string }>,
): { id: string; title: string } | null {
  if (projects.length === 0) return null;

  const known = projects.find((p) => p.id === DEFAULT_STITCH_PROJECT_ID);
  if (known) return known;

  for (const pattern of PREFERRED_PROJECT_PATTERNS) {
    const hit = projects.find((p) => pattern.test(p.title));
    if (hit) return hit;
  }

  return projects[0] ?? null;
}

export function projectSummaryToOption(p: StitchProjectSummary): { id: string; title: string } {
  return {
    id: p.name.replace(/^projects\//, ""),
    title: p.title,
  };
}
