/**
 * 티커 정규화: trim 후 대문자.
 */
export function normalizeSymbol(raw: string): string {
  return raw.trim().toUpperCase();
}

export function roundTwo(n: number): number {
  return Math.round(n * 100) / 100;
}

export function computeChange(currentPrice: number, previousClose: number): number {
  return roundTwo(currentPrice - previousClose);
}

export function computeChangePercent(change: number, previousClose: number): number {
  if (previousClose === 0) return 0;
  return roundTwo((change / previousClose) * 100);
}

export function formatDecimal(n: number): string {
  return roundTwo(n).toFixed(2);
}

export function formatNewsDate(epochSeconds: number, locale = "ko-KR"): string {
  const ms = epochSeconds > 1e12 ? epochSeconds : epochSeconds * 1000;
  return new Date(ms).toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
