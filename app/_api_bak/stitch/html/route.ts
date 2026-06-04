import { fetchStitchScreenHtml, StitchConfigError } from "@/lib/stitch";
import type { ApiErrorBody } from "@/lib/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<NextResponse<string | ApiErrorBody>> {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId")?.trim() ?? "";
    const screenId = searchParams.get("screenId")?.trim() ?? "";

    if (!projectId || !screenId) {
      return NextResponse.json(
        { error: "projectId와 screenId가 필요합니다." },
        { status: 400 },
      );
    }

    const { html } = await fetchStitchScreenHtml(projectId, screenId);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    if (e instanceof StitchConfigError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    console.error("[api/stitch/html]", e);
    const msg = e instanceof Error ? e.message : "Stitch HTML을 불러오지 못했습니다.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
