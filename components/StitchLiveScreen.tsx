"use client";

import { MaterialIcon } from "@/components/equidash/MaterialIcon";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function StitchLiveScreenInner() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId")?.trim() ?? "";
  const screenId = searchParams.get("screenId")?.trim() ?? "";
  const title = searchParams.get("title")?.trim() ?? "Stitch 화면";

  if (!projectId || !screenId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-on-surface">
        <MaterialIcon name="info" className="text-4xl text-outline" />
        <p className="text-sm text-on-surface-variant">projectId와 screenId가 필요합니다.</p>
        <Link href="/design" className="text-sm text-secondary underline-offset-2 hover:underline">
          디자인 목록으로
        </Link>
      </div>
    );
  }

  const iframeSrc = `/api/stitch/html?projectId=${encodeURIComponent(projectId)}&screenId=${encodeURIComponent(screenId)}`;

  return (
    <>
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-outline-variant bg-surface-container px-4 py-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-on-surface">{title}</p>
          <p className="text-xs text-on-surface-variant">Stitch 다크 UI · 라이브 미리보기</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/design"
            className="text-xs font-medium text-on-surface-variant underline-offset-2 hover:text-secondary hover:underline"
          >
            목록
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-secondary-container px-3 py-1.5 text-xs font-medium text-on-secondary-container hover:opacity-90"
          >
            터미널
          </Link>
        </div>
      </header>

      <iframe
        title={title}
        src={iframeSrc}
        className="min-h-0 flex-1 w-full border-0 bg-background"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </>
  );
}

export function StitchLiveScreen() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center bg-background text-sm text-on-surface-variant">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary" />
              Stitch 화면을 불러오는 중…
            </div>
          </div>
        }
      >
        <StitchLiveScreenInner />
      </Suspense>
    </div>
  );
}
