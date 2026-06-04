import {
  computeChange,
  computeChangePercent,
  normalizeSymbol,
  roundTwo,
} from "@/lib/stockUtils";
import type { NewsItemPayload, SearchResultItem, StockQuotePayload } from "@/lib/types";

const FINNHUB_BASE = "https://finnhub.io/api/v1";

type FinnhubQuote = {
  c?: number;
  pc?: number;
  h?: number;
  l?: number;
};

type FinnhubNewsItem = {
  headline?: string;
  source?: string;
  datetime?: number;
  url?: string;
};

type FinnhubSearchItem = {
  symbol?: string;
  description?: string;
  displaySymbol?: string;
  type?: string;
};

function isUsCommonStock(item: FinnhubSearchItem): boolean {
  const t = (item.type ?? "").toLowerCase();
  if (t && !t.includes("common stock")) return false;
  const sym = item.symbol ?? "";
  if (!/^[A-Z.]{1,10}$/i.test(sym)) return false;
  return true;
}

export function mapQuoteToPayload(symbol: string, data: FinnhubQuote): StockQuotePayload | null {
  const current = data.c;
  const previousClose = data.pc;
  if (typeof current !== "number" || typeof previousClose !== "number") return null;
  if (Number.isNaN(current) || Number.isNaN(previousClose)) return null;
  if (current === 0 && previousClose === 0) return null;

  const high = typeof data.h === "number" && !Number.isNaN(data.h) ? data.h : current;
  const low = typeof data.l === "number" && !Number.isNaN(data.l) ? data.l : current;

  const change = computeChange(current, previousClose);
  const changePercent = computeChangePercent(change, previousClose);

  return {
    symbol: normalizeSymbol(symbol),
    currentPrice: roundTwo(current),
    previousClose: roundTwo(previousClose),
    change,
    changePercent,
    high: roundTwo(high),
    low: roundTwo(low),
    isFallback: false,
  };
}

export async function fetchFinnhubQuote(
  symbol: string,
  token: string,
): Promise<StockQuotePayload | null> {
  const sym = normalizeSymbol(symbol);
  const url = `${FINNHUB_BASE}/quote?symbol=${encodeURIComponent(sym)}&token=${encodeURIComponent(token)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as FinnhubQuote;
  return mapQuoteToPayload(sym, data);
}

export async function fetchFinnhubNews(
  symbol: string,
  token: string,
): Promise<NewsItemPayload[] | null> {
  const sym = normalizeSymbol(symbol);
  const to = new Date();
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - 30);

  const fromStr = from.toISOString().slice(0, 10);
  const toStr = to.toISOString().slice(0, 10);

  const url =
    `${FINNHUB_BASE}/company-news?symbol=${encodeURIComponent(sym)}` +
    `&from=${fromStr}&to=${toStr}&token=${encodeURIComponent(token)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const raw = (await res.json()) as FinnhubNewsItem[];
  if (!Array.isArray(raw)) return null;

  const mapped: NewsItemPayload[] = raw
    .map((n) => ({
      headline: String(n.headline ?? ""),
      source: String(n.source ?? ""),
      datetime: typeof n.datetime === "number" ? n.datetime : 0,
      url: String(n.url ?? ""),
    }))
    .filter((n) => n.headline.length > 0 && n.url.length > 0);

  mapped.sort((a, b) => b.datetime - a.datetime);
  return mapped.slice(0, 5);
}

export async function fetchFinnhubSearch(
  query: string,
  token: string,
): Promise<SearchResultItem[] | null> {
  const q = query.trim();
  if (!q) return [];

  const url = `${FINNHUB_BASE}/search?q=${encodeURIComponent(q)}&token=${encodeURIComponent(token)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = (await res.json()) as { result?: FinnhubSearchItem[] };
  const list = Array.isArray(data.result) ? data.result : [];

  const usStocks = list
    .filter(isUsCommonStock)
    .map((item) => ({
      symbol: normalizeSymbol(item.symbol ?? ""),
      description: String(item.description ?? ""),
      displaySymbol: item.displaySymbol,
      type: item.type,
    }))
    .filter((item) => item.symbol.length > 0);

  const dedup = new Map<string, SearchResultItem>();
  for (const item of usStocks) {
    if (!dedup.has(item.symbol)) dedup.set(item.symbol, item);
    if (dedup.size >= 15) break;
  }

  return [...dedup.values()];
}
