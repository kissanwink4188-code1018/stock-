import { listStitchProjects, StitchConfigError } from "@/lib/stitch";
import type { ApiErrorBody } from "@/lib/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export type StitchProjectsPayload = {
  projects: Array<{
    id: string;
    title: string;
    thumbnailUrl: string | null;
  }>;
};

export async function GET(): Promise<NextResponse<StitchProjectsPayload | ApiErrorBody>> {
  try {
    const projects = await listStitchProjects();

    return NextResponse.json({
      projects: projects.map((p) => ({
        id: p.name.replace(/^projects\//, ""),
        title: p.title,
        thumbnailUrl: p.thumbnailScreenshot?.downloadUrl ?? null,
      })),
    });
  } catch (e) {
    if (e instanceof StitchConfigError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    console.error("[api/stitch/projects]", e);
    return NextResponse.json(
      { error: "Stitch 프로젝트를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
