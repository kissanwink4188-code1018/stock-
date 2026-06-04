import { sampleNewsForSymbol } from "@/data/sampleData";
import { fetchFinnhubNews } from "@/lib/finnhub";
import { normalizeSymbol } from "@/lib/stockUtils";
import type { ApiErrorBody, NewsPayload } from "@/lib/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MISSING_KEY_MSG =
  "FINNHUB_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해주세요.";

export async function GET(req: Request): Promise<NextResponse<NewsPayload | ApiErrorBody>> {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("symbol") ?? "";
    const symbol = normalizeSymbol(raw);

    if (!symbol) {
      return NextResponse.json({ error: "티커를 입력해주세요." }, { status: 400 });
    }

    const token = process.env.FINNHUB_API_KEY?.trim();
    if (!token) {
      console.error("[api/news] FINNHUB_API_KEY is missing");
      return NextResponse.json({ error: MISSING_KEY_MSG }, { status: 503 });
    }

    let payload: NewsPayload;
    try {
      const items = await fetchFinnhubNews(symbol, token);
      if (items !== null) {
        payload = { symbol, news: items, isFallback: false };
      } else {
        console.error(`[api/news] News fetch failed for ${symbol}, using fallback`);
        payload = sampleNewsForSymbol(symbol);
      }
    } catch (e) {
      console.error("[api/news] News error:", e);
      payload = sampleNewsForSymbol(symbol);
    }

    return NextResponse.json(payload);
  } catch (e) {
    console.error("[api/news] Unexpected error:", e);
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
