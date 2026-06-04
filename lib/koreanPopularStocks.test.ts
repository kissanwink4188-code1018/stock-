import { describe, expect, it } from "vitest";
import {
  getAllTopUsStockResults,
  KOREAN_POPULAR_US_STOCKS,
  mergeSearchResults,
  searchTopUsStocks,
  TOP_US_STOCKS_50,
} from "@/lib/koreanPopularStocks";
import type { SearchResultItem } from "@/lib/types";

describe("TOP_US_STOCKS_50", () => {
  it("lists 50 unique symbols", () => {
    expect(TOP_US_STOCKS_50.length).toBe(50);
    expect(KOREAN_POPULAR_US_STOCKS.length).toBe(50);
    const symbols = new Set(TOP_US_STOCKS_50.map((r) => r.symbol));
    expect(symbols.size).toBe(50);
  });
});

describe("getAllTopUsStockResults", () => {
  it("returns all 50 browse items", () => {
    expect(getAllTopUsStockResults().length).toBe(50);
  });
});

describe("searchTopUsStocks", () => {
  it("matches Korean company names", () => {
    const a = searchTopUsStocks("애플");
    expect(a.some((x) => x.symbol === "AAPL")).toBe(true);
  });

  it("matches partial Korean nicknames", () => {
    const n = searchTopUsStocks("엔비");
    expect(n.some((x) => x.symbol === "NVDA")).toBe(true);
  });

  it("matches normalized spacing", () => {
    const j = searchTopUsStocks("  제이피모건  ");
    expect(j.some((x) => x.symbol === "JPM")).toBe(true);
  });

  it("matches English alias lowercase", () => {
    const g = searchTopUsStocks("Google");
    expect(g.some((x) => x.symbol === "GOOGL")).toBe(true);
  });

  it("matches Korean names for newly added top-50 names", () => {
    expect(searchTopUsStocks("비자").some((x) => x.symbol === "V")).toBe(true);
    expect(searchTopUsStocks("코스트코").some((x) => x.symbol === "COST")).toBe(true);
    expect(searchTopUsStocks("나이키").some((x) => x.symbol === "NKE")).toBe(true);
  });

  it("matches ticker symbol exactly", () => {
    expect(searchTopUsStocks("NVDA").some((x) => x.symbol === "NVDA")).toBe(true);
    expect(searchTopUsStocks("v").some((x) => x.symbol === "V")).toBe(true);
  });

  it("returns empty for unrelated query", () => {
    expect(searchTopUsStocks("존재하지않는검색어")).toEqual([]);
  });

  it("does not match single ambiguous Korean character", () => {
    expect(searchTopUsStocks("아")).toEqual([]);
  });
});

describe("mergeSearchResults", () => {
  it("dedupes with priority first", () => {
    const a: SearchResultItem[] = [{ symbol: "AAPL", description: "ko" }];
    const b: SearchResultItem[] = [{ symbol: "AAPL", description: "en" }, { symbol: "MSFT", description: "x" }];
    const m = mergeSearchResults(a, b, 15);
    expect(m[0].description).toBe("ko");
    expect(m.map((x) => x.symbol)).toEqual(["AAPL", "MSFT"]);
  });
});
