export type StockQuotePayload = {
  symbol: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  isFallback: boolean;
};

export type NewsItemPayload = {
  headline: string;
  source: string;
  datetime: number;
  url: string;
};

export type NewsPayload = {
  symbol: string;
  news: NewsItemPayload[];
  isFallback: boolean;
};

export type SearchResultItem = {
  symbol: string;
  description: string;
  displaySymbol?: string;
  type?: string;
};

export type SearchPayload = {
  query: string;
  results: SearchResultItem[];
  isFallback: boolean;
};

export type ApiErrorBody = {
  error: string;
};

export type StitchProjectsPayload = {
  projects: Array<{
    id: string;
    title: string;
    thumbnailUrl: string | null;
  }>;
};

export type StitchScreensPayload = {
  projectId: string;
  screens: Array<{
    id: string;
    title: string;
    screenshotUrl: string | null;
    htmlAvailable: boolean;
    width: string | null;
    height: string | null;
    deviceType: string | null;
  }>;
};
