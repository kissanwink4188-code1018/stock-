"use client";

import { MaterialIcon } from "@/components/equidash/MaterialIcon";
import { NewsList } from "@/components/NewsList";
import { StockPriceCard } from "@/components/StockPriceCard";
import { changeIconName, changeTextClass, getChangeTone } from "@/lib/equidashTheme";
import {
  clientFetchNews,
  clientFetchStock,
  clientSearchStocks,
  usesClientApi,
} from "@/lib/clientApi";
import { getAllTopUsStockResults, searchTopUsStocks } from "@/lib/koreanPopularStocks";
import { formatDecimal } from "@/lib/stockUtils";
import type { ApiErrorBody, NewsPayload, SearchPayload, SearchResultItem, StockQuotePayload } from "@/lib/types";
import { useCallback, useMemo, useState } from "react";

function isErrorBody(x: unknown): x is ApiErrorBody {
  return typeof x === "object" && x !== null && "error" in x && typeof (x as ApiErrorBody).error === "string";
}

async function parseResponse<T>(res: Response): Promise<T | ApiErrorBody> {
  try {
    return (await res.json()) as T | ApiErrorBody;
  } catch {
    return { error: "응답을 해석할 수 없습니다." };
  }
}

export function StockSearchForm() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchPayload["results"]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
  const [stock, setStock] = useState<StockQuotePayload | null>(null);
  const [news, setNews] = useState<NewsPayload | null>(null);

  const [searchLoading, setSearchLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const displayResults: SearchResultItem[] = useMemo(() => {
    const q = query.trim();
    if (!hasSearched) {
      return q ? searchTopUsStocks(q) : getAllTopUsStockResults();
    }
    if (searchResults.length > 0) return searchResults;
    return q ? searchTopUsStocks(q) : [];
  }, [query, hasSearched, searchResults]);

  const runFetch = useCallback(async (symbol: string) => {
    setMessage(null);
    setFetchLoading(true);
    setStock(null);
    setNews(null);

    try {
      if (usesClientApi()) {
        const [stockData, newsData] = await Promise.all([
          clientFetchStock(symbol),
          clientFetchNews(symbol),
        ]);
        setStock(stockData);
        setNews(newsData);
        if (stockData.isFallback || newsData.isFallback) {
          setMessage(
            "GitHub Pages 데모: 샘플 시세·뉴스입니다. 실시간 데이터는 로컬 npm run dev 또는 Vercel 배포를 사용하세요.",
          );
          setDismissedBanner(false);
        }
      } else {
        const stockUrl = `/api/stock?symbol=${encodeURIComponent(symbol)}`;
        const newsUrl = `/api/news?symbol=${encodeURIComponent(symbol)}`;

        const [stockRes, newsRes] = await Promise.all([fetch(stockUrl), fetch(newsUrl)]);
        const [stockData, newsData] = await Promise.all([
          parseResponse<StockQuotePayload>(stockRes),
          parseResponse<NewsPayload>(newsRes),
        ]);

        const errors: string[] = [];

        if (!stockRes.ok && isErrorBody(stockData)) {
          errors.push(stockData.error);
        } else if (isErrorBody(stockData)) {
          errors.push(stockData.error);
        } else {
          setStock(stockData);
        }

        if (!newsRes.ok && isErrorBody(newsData)) {
          errors.push(newsData.error);
        } else if (isErrorBody(newsData)) {
          errors.push(newsData.error);
        } else {
          setNews(newsData);
        }

        if (errors.length > 0) {
          setMessage(errors.join(" "));
          setDismissedBanner(false);
        }
      }
    } catch {
      setMessage("조회 요청에 실패했습니다. 네트워크를 확인해주세요.");
      setDismissedBanner(false);
    } finally {
      setFetchLoading(false);
      setHasFetchedOnce(true);
    }
  }, []);

  const onSelectSymbol = useCallback(
    (symbol: string, description: string) => {
      setSelectedSymbol(symbol);
      setSelectedDescription(description);
      void runFetch(symbol);
    },
    [runFetch],
  );

  const runSearch = useCallback(async () => {
    setMessage(null);
    const q = query.trim();
    if (!q) {
      setMessage("검색어를 입력해주세요.");
      setDismissedBanner(false);
      setSearchResults([]);
      return;
    }

    setHasSearched(true);
    setSearchLoading(true);
    try {
      if (usesClientApi()) {
        const payload = await clientSearchStocks(q);
        setSearchResults(payload.results);
        if (payload.results.length === 0) {
          setMessage("검색 결과가 없습니다. 다른 키워드를 시도해주세요.");
          setDismissedBanner(false);
        }
        return;
      }

      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await parseResponse<SearchPayload>(res);

      if (!res.ok && isErrorBody(data)) {
        setSearchResults([]);
        setMessage(data.error);
        setDismissedBanner(false);
        return;
      }

      if (isErrorBody(data)) {
        setSearchResults([]);
        setMessage(data.error);
        setDismissedBanner(false);
        return;
      }

      setSearchResults(data.results);
      if (data.results.length === 0) {
        setMessage("검색 결과가 없습니다. 다른 키워드를 시도해주세요.");
        setDismissedBanner(false);
      }
    } catch {
      setSearchResults([]);
      setMessage("검색 요청에 실패했습니다. 네트워크를 확인해주세요.");
      setDismissedBanner(false);
    } finally {
      setSearchLoading(false);
    }
  }, [query]);

  const busy = searchLoading || fetchLoading;
  const showBanner = Boolean(message) && !dismissedBanner;
  const previewResults = displayResults.slice(0, 8);
  const listResults = displayResults.slice(8);
  const showingTop50Browse = !hasSearched && !query.trim();

  return (
    <div className="space-y-6">
      {showBanner && (
        <div
          className="flex items-center justify-between rounded-lg bg-error-container px-4 py-3 text-on-error-container"
          role="alert"
        >
          <div className="flex items-center gap-3 text-sm">
            <MaterialIcon name="warning" />
            <span>{message}</span>
          </div>
          <button
            type="button"
            onClick={() => setDismissedBanner(true)}
            className="rounded p-1 hover:bg-on-error-container/10"
            aria-label="닫기"
          >
            <MaterialIcon name="close" />
          </button>
        </div>
      )}

      <form
        className="flex flex-col gap-4 md:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void runSearch();
        }}
      >
        <div className="relative flex-1">
          <MaterialIcon
            name="search"
            className="absolute top-1/2 left-4 -translate-y-1/2 text-outline"
          />
          <label className="sr-only" htmlFor="search-query">
            검색어
          </label>
          <input
            id="search-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="한글명·티커 검색 (미국 상위 50종)"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-high py-3 pr-4 pl-12 text-on-surface outline-none transition-all placeholder:text-outline focus:border-secondary focus:ring-1 focus:ring-secondary"
            disabled={busy}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-secondary px-8 py-3 text-sm font-bold text-on-secondary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
        >
          {searchLoading ? "검색 중…" : "검색"}
        </button>
      </form>

      {displayResults.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-on-surface-variant">
            {showingTop50Browse
              ? "미국 시가총액 상위 50종목 — 한글명·티커로 검색할 수 있습니다."
              : `${displayResults.length}건 · 상위 50종목 우선 매칭`}
          </p>
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previewResults.map((r) => {
            const active = selectedSymbol === r.symbol;
            const tone = stock?.symbol === r.symbol && stock ? getChangeTone(stock.change) : null;
            return (
              <button
                key={r.symbol}
                type="button"
                onClick={() => onSelectSymbol(r.symbol, r.description)}
                disabled={busy}
                className={`group rounded-lg border p-4 text-left transition-colors ${
                  active
                    ? "border-secondary bg-surface-container-high"
                    : "border-outline-variant bg-surface-container hover:border-secondary"
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <span className="font-mono text-xs text-on-surface-variant group-hover:text-on-surface">
                    {r.symbol}
                  </span>
                  {tone && stock?.symbol === r.symbol && (
                    <MaterialIcon
                      name={changeIconName(tone)}
                      className={`text-sm ${changeTextClass(tone)}`}
                    />
                  )}
                </div>
                {stock?.symbol === r.symbol && stock ? (
                  <>
                    <div className="font-mono text-lg text-on-surface">
                      ${formatDecimal(stock.currentPrice)}
                    </div>
                    <div className={`text-xs font-bold ${changeTextClass(tone!)}`}>
                      {tone === "positive" ? "+" : ""}
                      {formatDecimal(stock.changePercent)}%
                    </div>
                  </>
                ) : (
                  <p className="line-clamp-2 text-[10px] text-on-surface-variant">{r.description}</p>
                )}
              </button>
            );
          })}
        </section>
        </div>
      )}

      {listResults.length > 0 && (
        <ul className="max-h-52 space-y-1 overflow-y-auto rounded-lg border border-outline-variant bg-surface-container-low p-2">
          {listResults.map((r) => {
            const active = selectedSymbol === r.symbol;
            return (
              <li key={r.symbol}>
                <button
                  type="button"
                  onClick={() => onSelectSymbol(r.symbol, r.description)}
                  disabled={busy}
                  className={`flex w-full flex-col rounded-md px-3 py-2 text-left text-sm transition ${
                    active
                      ? "bg-secondary-container text-on-secondary-container"
                      : "text-on-surface hover:bg-surface-container-highest"
                  }`}
                >
                  <span className="font-mono font-semibold">{r.symbol}</span>
                  <span className="text-xs opacity-80">{r.description}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 space-y-4 lg:col-span-8">
          <StockPriceCard
            data={stock}
            loading={fetchLoading}
            hasFetchedOnce={hasFetchedOnce}
            symbolLabel={selectedDescription}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <NewsList
            symbol={selectedSymbol}
            items={news?.news ?? []}
            isFallback={news?.isFallback ?? false}
            loading={fetchLoading}
            hasFetchedOnce={hasFetchedOnce}
          />
        </div>
      </div>
    </div>
  );
}
