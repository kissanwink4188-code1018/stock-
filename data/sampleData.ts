import type { NewsPayload, SearchPayload, StockQuotePayload } from "@/lib/types";

export const SAMPLE_STOCK: StockQuotePayload = {
  symbol: "AAPL",
  currentPrice: 198.42,
  previousClose: 195.1,
  change: 3.32,
  changePercent: 1.7,
  high: 199.88,
  low: 194.5,
  isFallback: true,
};

export const SAMPLE_NEWS: NewsPayload = {
  symbol: "AAPL",
  isFallback: true,
  news: [
    {
      headline: "[샘플] Apple, 분기 실적 발표 일정 안내 (학습용 더미 뉴스)",
      source: "SampleWire",
      datetime: Math.floor(Date.now() / 1000) - 3600,
      url: "https://example.com/news/1",
    },
    {
      headline: "[샘플] 공급망 관련 업계 동향 요약 (학습용 더미 뉴스)",
      source: "SampleTimes",
      datetime: Math.floor(Date.now() / 1000) - 86400,
      url: "https://example.com/news/2",
    },
    {
      headline: "[샘플] 기술 섹터 거래량 동향 (학습용 더미 뉴스)",
      source: "SampleJournal",
      datetime: Math.floor(Date.now() / 1000) - 172800,
      url: "https://example.com/news/3",
    },
  ],
};

export const SAMPLE_SEARCH: SearchPayload = {
  query: "",
  isFallback: true,
  results: [
    { symbol: "AAPL", description: "Apple Inc", type: "Common Stock" },
    { symbol: "MSFT", description: "Microsoft Corp", type: "Common Stock" },
    { symbol: "GOOGL", description: "Alphabet Inc", type: "Common Stock" },
    { symbol: "AMZN", description: "Amazon.com Inc", type: "Common Stock" },
    { symbol: "NVDA", description: "NVIDIA Corp", type: "Common Stock" },
  ],
};

export function sampleStockForSymbol(symbol: string): StockQuotePayload {
  return { ...SAMPLE_STOCK, symbol, isFallback: true };
}

export function sampleNewsForSymbol(symbol: string): NewsPayload {
  return {
    symbol,
    isFallback: true,
    news: SAMPLE_NEWS.news.map((item, i) => ({
      ...item,
      headline: `[${symbol}] ${item.headline.replace("[샘플] ", "")}`,
      url: `https://example.com/news/${symbol.toLowerCase()}-${i + 1}`,
    })),
  };
}

export function sampleSearchForQuery(query: string): SearchPayload {
  const q = query.trim().toLowerCase();
  const filtered = SAMPLE_SEARCH.results.filter(
    (r) =>
      r.symbol.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
  );
  return {
    query,
    isFallback: true,
    results: filtered.length > 0 ? filtered : SAMPLE_SEARCH.results,
  };
}
