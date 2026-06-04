import type { SearchResultItem } from "@/lib/types";

/** 미국 시가총액 상위 50종목(학습용 고정 목록) — 한글명·별칭 검색 지원 */
export type KoreanPopularEntry = {
  symbol: string;
  description: string;
  aliases: readonly string[];
};

export const TOP_US_STOCKS_50: readonly KoreanPopularEntry[] = [
  { symbol: "AAPL", description: "애플 (Apple)", aliases: ["애플", "앱플", "apple", "에이플"] },
  {
    symbol: "MSFT",
    description: "마이크로소프트 (Microsoft)",
    aliases: ["마이크로소프트", "마소", "microsoft", "윈도우"],
  },
  {
    symbol: "NVDA",
    description: "엔비디아 (NVIDIA)",
    aliases: ["엔비디아", "엔비", "nvidia", "그래픽카드"],
  },
  { symbol: "AMZN", description: "아마존 (Amazon)", aliases: ["아마존", "amazon", "베조스"] },
  {
    symbol: "GOOGL",
    description: "알파벳 · 구글 (Alphabet Class A)",
    aliases: ["구글", "알파벳", "google", "알파"],
  },
  {
    symbol: "META",
    description: "메타 (Meta Platforms)",
    aliases: ["메타", "페이스북", "페북", "facebook", "meta"],
  },
  {
    symbol: "BRK.B",
    description: "버크셔 해서웨이 B (Berkshire Hathaway B)",
    aliases: ["버크셔", "버크셔해서웨이", "버핏", "brk", "워런버핏"],
  },
  { symbol: "TSLA", description: "테슬라 (Tesla)", aliases: ["테슬라", "tesla", "일론머스크"] },
  {
    symbol: "AVGO",
    description: "브로드컴 (Broadcom)",
    aliases: ["브로드컴", "broadcom", "아브고"],
  },
  {
    symbol: "LLY",
    description: "일라이 릴리 (Eli Lilly)",
    aliases: ["일라이릴리", "릴리", "eli lilly", "제약"],
  },
  {
    symbol: "JPM",
    description: "JP모건체이스 (JPMorgan Chase)",
    aliases: ["jp모건", "제이피모건", "jpmorgan", "모건"],
  },
  { symbol: "V", description: "비자 (Visa)", aliases: ["비자", "visa"] },
  {
    symbol: "UNH",
    description: "유나이티드헬스 (UnitedHealth)",
    aliases: ["유나이티드헬스", "유니티드헬스", "unitedhealth"],
  },
  {
    symbol: "XOM",
    description: "엑손모빌 (Exxon Mobil)",
    aliases: ["엑손", "엑손모빌", "exxon", "모빌"],
  },
  { symbol: "MA", description: "마스터카드 (Mastercard)", aliases: ["마스터카드", "mastercard"] },
  { symbol: "ORCL", description: "오라클 (Oracle)", aliases: ["오라클", "oracle"] },
  { symbol: "COST", description: "코스트코 (Costco)", aliases: ["코스트코", "costco"] },
  {
    symbol: "PG",
    description: "프록터앤갬블 (Procter & Gamble)",
    aliases: ["피앤지", "프록터", "procter", "갬블"],
  },
  { symbol: "HD", description: "홈디포 (Home Depot)", aliases: ["홈디포", "homedepot"] },
  {
    symbol: "JNJ",
    description: "존슨앤존슨 (Johnson & Johnson)",
    aliases: ["존슨앤존슨", "존슨", "jnj"],
  },
  { symbol: "NFLX", description: "넷플릭스 (Netflix)", aliases: ["넷플릭스", "넷플", "netflix"] },
  {
    symbol: "AMD",
    description: "AMD (Advanced Micro Devices)",
    aliases: ["amd", "에이엠디", "라이젠"],
  },
  {
    symbol: "CRM",
    description: "세일즈포스 (Salesforce)",
    aliases: ["세일즈포스", "salesforce"],
  },
  {
    symbol: "BAC",
    description: "뱅크오브아메리카 (Bank of America)",
    aliases: ["뱅크오브아메리카", "뱅오브", "boa", "bankofamerica"],
  },
  { symbol: "ABBV", description: "애브비 (AbbVie)", aliases: ["애브비", "abbvie"] },
  { symbol: "KO", description: "코카콜라 (Coca-Cola)", aliases: ["코카콜라", "코카", "cocacola", "콜라"] },
  { symbol: "PEP", description: "펩시코 (PepsiCo)", aliases: ["펩시", "펩시코", "pepsi"] },
  { symbol: "CVX", description: "셰브론 (Chevron)", aliases: ["셰브론", "chevron"] },
  {
    symbol: "TMO",
    description: "써모피셔 (Thermo Fisher)",
    aliases: ["써모피셔", "thermo", "thermofisher"],
  },
  { symbol: "WMT", description: "월마트 (Walmart)", aliases: ["월마트", "walmart"] },
  { symbol: "DIS", description: "월트디즈니 (The Walt Disney)", aliases: ["디즈니", "disney", "미키"] },
  { symbol: "CSCO", description: "시스코 (Cisco)", aliases: ["시스코", "cisco"] },
  { symbol: "ACN", description: "액센츄어 (Accenture)", aliases: ["액센츄어", "accenture"] },
  {
    symbol: "MCD",
    description: "맥도날드 (McDonald's)",
    aliases: ["맥도날드", "맥날", "mcdonalds", "맥도"],
  },
  { symbol: "LIN", description: "린데 (Linde)", aliases: ["린데", "linde"] },
  { symbol: "ADBE", description: "어도비 (Adobe)", aliases: ["어도비", "adobe"] },
  { symbol: "INTC", description: "인텔 (Intel)", aliases: ["인텔", "intel"] },
  { symbol: "INTU", description: "인튜이트 (Intuit)", aliases: ["인튜이트", "intuit"] },
  { symbol: "QCOM", description: "퀄컴 (Qualcomm)", aliases: ["퀄컴", "qualcomm"] },
  {
    symbol: "TXN",
    description: "텍사스인스트루먼트 (Texas Instruments)",
    aliases: ["텍사스인스트루먼트", "텍스인스트", "ti"],
  },
  {
    symbol: "AMAT",
    description: "어플라이드머티리얼즈 (Applied Materials)",
    aliases: ["어플라이드머티리얼즈", "appliedmaterials", "반도체장비"],
  },
  {
    symbol: "MU",
    description: "마이크론 (Micron Technology)",
    aliases: ["마이크론", "micron", "메모리반도체"],
  },
  { symbol: "IBM", description: "IBM", aliases: ["아이비엠", "ibm", "인터내셔널비즈니스머신"] },
  {
    symbol: "GE",
    description: "GE에어로스페이스 (GE Aerospace)",
    aliases: ["지이", "ge", "제너럴일렉트릭"],
  },
  {
    symbol: "CAT",
    description: "캐터필러 (Caterpillar)",
    aliases: ["캐터필러", "caterpillar", "중장비"],
  },
  {
    symbol: "GS",
    description: "골드만삭스 (Goldman Sachs)",
    aliases: ["골드만", "골드만삭스", "goldman"],
  },
  {
    symbol: "MS",
    description: "모건스탠리 (Morgan Stanley)",
    aliases: ["모건스탠리", "morganstanley"],
  },
  { symbol: "BA", description: "보잉 (Boeing)", aliases: ["보잉", "boeing"] },
  { symbol: "NKE", description: "나이키 (Nike)", aliases: ["나이키", "nike"] },
  {
    symbol: "SBUX",
    description: "스타벅스 (Starbucks)",
    aliases: ["스타벅스", "스벅", "starbucks"],
  },
] as const;

/** @deprecated TOP_US_STOCKS_50 사용 */
export const KOREAN_POPULAR_US_STOCKS = TOP_US_STOCKS_50;

function normalizeForMatch(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
}

function normalizeSymbol(symbol: string): string {
  return normalizeForMatch(symbol.replace(/\./g, ""));
}

function aliasMatches(queryNorm: string, aliasNorm: string): boolean {
  if (!queryNorm || !aliasNorm) return false;
  if (queryNorm === aliasNorm) return true;
  if (queryNorm.length < 2 || aliasNorm.length < 2) return false;
  return aliasNorm.includes(queryNorm) || queryNorm.includes(aliasNorm);
}

function entryMatches(queryNorm: string, row: KoreanPopularEntry): boolean {
  const symbolNorm = normalizeSymbol(row.symbol);
  if (queryNorm === symbolNorm) return true;
  if (queryNorm.length >= 2 && symbolNorm.startsWith(queryNorm)) return true;

  const descNorm = normalizeForMatch(row.description);
  if (queryNorm.length >= 2 && descNorm.includes(queryNorm)) return true;

  return row.aliases.some((alias) => aliasMatches(queryNorm, normalizeForMatch(alias)));
}

export function getAllTopUsStockResults(): SearchResultItem[] {
  return TOP_US_STOCKS_50.map((row) => ({
    symbol: row.symbol,
    description: row.description,
    type: "Common Stock",
  }));
}

export function searchTopUsStocks(query: string): SearchResultItem[] {
  const qNorm = normalizeForMatch(query);
  if (!qNorm) return [];

  const hits: SearchResultItem[] = [];
  for (const row of TOP_US_STOCKS_50) {
    if (entryMatches(qNorm, row)) {
      hits.push({
        symbol: row.symbol,
        description: row.description,
        type: "Common Stock",
      });
    }
  }
  return hits;
}

/** @deprecated searchTopUsStocks 사용 */
export function matchKoreanPopularStocks(query: string): SearchResultItem[] {
  return searchTopUsStocks(query);
}

export function mergeSearchResults(
  priority: SearchResultItem[],
  secondary: SearchResultItem[],
  limit = 15,
): SearchResultItem[] {
  const seen = new Set<string>();
  const out: SearchResultItem[] = [];

  const push = (item: SearchResultItem): void => {
    const key = item.symbol.toUpperCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(item);
  };

  for (const item of priority) push(item);
  for (const item of secondary) {
    if (out.length >= limit) break;
    push(item);
  }

  return out.slice(0, limit);
}
