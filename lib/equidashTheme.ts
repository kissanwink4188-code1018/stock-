export type ChangeTone = "positive" | "negative";

export function getChangeTone(change: number): ChangeTone {
  return change >= 0 ? "positive" : "negative";
}

export function changeTextClass(tone: ChangeTone): string {
  return tone === "positive" ? "text-secondary" : "text-error";
}

export function changeIconName(tone: ChangeTone): string {
  return tone === "positive" ? "trending_up" : "trending_down";
}

/** 공통 다크 UI 패널 (Stitch EquiDash 토큰) */
export const equidashPanel =
  "rounded-xl border border-outline-variant bg-surface-container";

export const equidashPanelHigh =
  "rounded-xl border border-outline-variant bg-surface-container-high";

export const equidashMutedText = "text-on-surface-variant";

export const equidashHeading = "text-on-surface";
