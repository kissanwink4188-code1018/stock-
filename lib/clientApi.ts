import { sampleNewsForSymbol, sampleSearchForQuery, sampleStockForSymbol } from "@/data/sampleData";
import { mergeSearchResults, searchTopUsStocks } from "@/lib/koreanPopularStocks";
import { isStaticExport } from "@/lib/site";
import type { NewsPayload, SearchPayload, StockQuotePayload } from "@/lib/types";

export function usesClientApi(): boolean {
  return isStaticExport;
}

export async function clientSearchStocks(query: string): Promise<SearchPayload> {
  const q = query.trim();
  const top50Hits = searchTopUsStocks(q);
  const fallback = sampleSearchForQuery(q);
  const merged = mergeSearchResults(top50Hits, fallback.results, 15);
  return {
    query: q,
    results: merged,
    isFallback: top50Hits.length === 0,
  };
}

export async function clientFetchStock(symbol: string): Promise<StockQuotePayload> {
  return sampleStockForSymbol(symbol);
}

export async function clientFetchNews(symbol: string): Promise<NewsPayload> {
  return sampleNewsForSymbol(symbol);
}
