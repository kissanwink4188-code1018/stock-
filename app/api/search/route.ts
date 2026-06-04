import { sampleSearchForQuery } from "@/data/sampleData";
import { fetchFinnhubSearch } from "@/lib/finnhub";
import {
  getAllTopUsStockResults,
  mergeSearchResults,
  searchTopUsStocks,
} from "@/lib/koreanPopularStocks";
import type { ApiErrorBody, SearchPayload } from "@/lib/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MISSING_KEY_MSG =
  "FINNHUB_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해주세요.";

export async function GET(req: Request): Promise<NextResponse<SearchPayload | ApiErrorBody>> {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();
    const preset = searchParams.get("preset");

    if (preset === "top50") {
      return NextResponse.json({
        query: "",
        results: getAllTopUsStockResults(),
        isFallback: false,
      });
    }

    if (!q) {
      return NextResponse.json(
        { error: "검색어를 입력해주세요." },
        { status: 400 },
      );
    }

    const token = process.env.FINNHUB_API_KEY?.trim();
    if (!token) {
      console.error("[api/search] FINNHUB_API_KEY is missing");
      return NextResponse.json({ error: MISSING_KEY_MSG }, { status: 503 });
    }

    const top50Hits = searchTopUsStocks(q);

    let payload: SearchPayload;
    try {
      const remote = await fetchFinnhubSearch(q, token);
      if (remote !== null) {
        const merged = mergeSearchResults(top50Hits, remote, 15);
        payload = { query: q, results: merged, isFallback: false };
      } else {
        console.error(`[api/search] Search failed for "${q}", using fallback`);
        const fb = sampleSearchForQuery(q);
        const merged = mergeSearchResults(top50Hits, fb.results, 15);
        payload = { ...fb, query: q, results: merged };
      }
    } catch (e) {
      console.error("[api/search] Search error:", e);
      const fb = sampleSearchForQuery(q);
      const merged = mergeSearchResults(top50Hits, fb.results, 15);
      payload = { ...fb, query: q, results: merged };
    }

    return NextResponse.json(payload);
  } catch (e) {
    console.error("[api/search] Unexpected error:", e);
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
