import { listStitchScreens, parseScreenIdFromName, StitchConfigError } from "@/lib/stitch";
import type { ApiErrorBody } from "@/lib/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

export async function GET(req: Request): Promise<NextResponse<StitchScreensPayload | ApiErrorBody>> {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId")?.trim() ?? "";

    if (!projectId) {
      return NextResponse.json({ error: "projectId가 필요합니다." }, { status: 400 });
    }

    const screens = await listStitchScreens(projectId);

    return NextResponse.json({
      projectId,
      screens: screens.map((s) => ({
        id: parseScreenIdFromName(s.name),
        title: s.title,
        screenshotUrl: s.screenshot?.downloadUrl ?? null,
        htmlAvailable: Boolean(s.htmlCode?.downloadUrl),
        width: s.width ?? null,
        height: s.height ?? null,
        deviceType: s.deviceType ?? null,
      })),
    });
  } catch (e) {
    if (e instanceof StitchConfigError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    console.error("[api/stitch/screens]", e);
    return NextResponse.json(
      { error: "Stitch 스크린을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
