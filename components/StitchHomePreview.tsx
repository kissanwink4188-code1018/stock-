"use client";

import { MaterialIcon } from "@/components/equidash/MaterialIcon";
import {
  DEFAULT_STITCH_PROJECT_ID,
  DEFAULT_STITCH_SCREEN_ID,
} from "@/lib/stitchDefaults";
import { equidashMutedText, equidashPanelHigh } from "@/lib/equidashTheme";
import { isStaticExport, withBasePath } from "@/lib/site";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const apiIframeSrc = `/api/stitch/html?projectId=${encodeURIComponent(DEFAULT_STITCH_PROJECT_ID)}&screenId=${encodeURIComponent(DEFAULT_STITCH_SCREEN_ID)}`;
const viewHref = `/design/view?projectId=${encodeURIComponent(DEFAULT_STITCH_PROJECT_ID)}&screenId=${encodeURIComponent(DEFAULT_STITCH_SCREEN_ID)}&title=${encodeURIComponent("EquiDash Stock Dashboard")}`;

export function StitchHomePreview() {
  const [iframeError, setIframeError] = useState(false);
  const iframeSrc = useMemo(
    () => (isStaticExport ? withBasePath("/stitch/equidash.html") : apiIframeSrc),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    void fetch(iframeSrc)
      .then((res) => {
        if (!cancelled && !res.ok) setIframeError(true);
      })
      .catch(() => {
        if (!cancelled) setIframeError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [iframeSrc]);

  return (
    <section className={`overflow-hidden ${equidashPanelHigh} border-secondary/30`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant px-4 py-3">
        <div className="flex items-center gap-2">
          <MaterialIcon name="palette" className="text-secondary" />
          <div>
            <h2 className="text-sm font-semibold text-on-surface">Stitch 디자인 미리보기</h2>
            <p className={`text-xs ${equidashMutedText}`}>
              Google Stitch에서 만든 EquiDash 다크 UI (원본 HTML)
            </p>
          </div>
        </div>
        {!isStaticExport && (
          <Link
            href={viewHref}
            className="rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-on-secondary hover:bg-secondary/90"
          >
            전체 화면
          </Link>
        )}
      </div>

      {!iframeError ? (
        <iframe
          title="EquiDash Stitch 디자인"
          src={iframeSrc}
          className="h-[min(520px,70vh)] w-full border-0 bg-background"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
          <MaterialIcon name="info" className="text-3xl text-outline" />
          <p className="text-sm text-on-surface-variant">
            Stitch HTML을 불러오지 못했습니다. `.env.local`의 `STITCH_API_KEY`와 개발 서버를 확인해주세요.
          </p>
          {!isStaticExport && (
            <Link href="/design" className="text-sm text-secondary underline-offset-2 hover:underline">
              Stitch 디자인 페이지로 이동
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
