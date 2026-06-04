"use client";

import type { StitchProjectsPayload } from "@/app/api/stitch/projects/route";
import type { StitchScreensPayload } from "@/app/api/stitch/screens/route";
import { MaterialIcon } from "@/components/equidash/MaterialIcon";
import {
  equidashHeading,
  equidashMutedText,
  equidashPanel,
  equidashPanelHigh,
} from "@/lib/equidashTheme";
import { pickPreferredStitchProject } from "@/lib/stitchDefaults";
import type { ApiErrorBody } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function isErrorBody(x: unknown): x is ApiErrorBody {
  return typeof x === "object" && x !== null && "error" in x && typeof (x as ApiErrorBody).error === "string";
}

function buildViewHref(projectId: string, screenId: string, title: string): string {
  const params = new URLSearchParams({ projectId, screenId, title });
  return `/design/view?${params.toString()}`;
}

type Props = {
  autoOpenFirstScreen?: boolean;
};

export function StitchScreensGallery({ autoOpenFirstScreen = false }: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState<StitchProjectsPayload["projects"]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [screens, setScreens] = useState<StitchScreensPayload["screens"]>([]);
  const [expandedScreenId, setExpandedScreenId] = useState<string | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingScreens, setLoadingScreens] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadScreens = useCallback(
    async (projectId: string, options?: { autoNavigate?: boolean }) => {
      setLoadingScreens(true);
      setMessage(null);
      setScreens([]);
      setExpandedScreenId(null);

      try {
        const res = await fetch(`/api/stitch/screens?projectId=${encodeURIComponent(projectId)}`);
        const data = (await res.json()) as StitchScreensPayload | ApiErrorBody;

        if (!res.ok && isErrorBody(data)) {
          setMessage(data.error);
          return;
        }

        if (isErrorBody(data)) {
          setMessage(data.error);
          return;
        }

        setScreens(data.screens);

        const firstWithHtml = data.screens.find((s) => s.htmlAvailable);
        if (options?.autoNavigate && firstWithHtml) {
          router.push(buildViewHref(projectId, firstWithHtml.id, firstWithHtml.title));
          return;
        }

        if (data.screens.length === 0) {
          setMessage("이 프로젝트에 표시할 스크린이 없습니다.");
        }
      } catch {
        setMessage("스크린 목록을 불러오지 못했습니다.");
      } finally {
        setLoadingScreens(false);
      }
    },
    [router],
  );

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      setLoadingProjects(true);
      setMessage(null);

      try {
        const res = await fetch("/api/stitch/projects");
        const data = (await res.json()) as StitchProjectsPayload | ApiErrorBody;

        if (cancelled) return;

        if (!res.ok && isErrorBody(data)) {
          setMessage(data.error);
          return;
        }

        if (isErrorBody(data)) {
          setMessage(data.error);
          return;
        }

        setProjects(data.projects);
        const preferred = pickPreferredStitchProject(data.projects);
        if (preferred) {
          setSelectedProjectId(preferred.id);
          void loadScreens(preferred.id, { autoNavigate: autoOpenFirstScreen });
        } else {
          setMessage("Stitch 프로젝트가 없습니다.");
        }
      } catch {
        if (!cancelled) setMessage("프로젝트 목록을 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoadingProjects(false);
      }
    };

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, [autoOpenFirstScreen, loadScreens]);

  const onSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    void loadScreens(projectId);
  };

  const expanded = screens.find((s) => s.id === expandedScreenId) ?? null;
  const primaryScreen = screens.find((s) => s.htmlAvailable) ?? screens[0];

  return (
    <div className="space-y-6">
      {primaryScreen && selectedProjectId && primaryScreen.htmlAvailable && (
        <section
          className={`${equidashPanelHigh} border-secondary/40 p-6`}
        >
          <div className="flex items-start gap-3">
            <MaterialIcon name="preview" className="text-2xl text-secondary" />
            <div>
              <h2 className={`text-base font-semibold ${equidashHeading}`}>Stitch 라이브 화면</h2>
              <p className={`mt-1 text-sm ${equidashMutedText}`}>
                Stitch 다크 모드 HTML을 앱 안에서 그대로 띄웁니다.
              </p>
              <Link
                href={buildViewHref(selectedProjectId, primaryScreen.id, primaryScreen.title)}
                className="mt-4 inline-flex rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-on-secondary hover:bg-secondary/90"
              >
                {primaryScreen.title} — 화면으로 보기
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className={`${equidashPanel} p-6`}>
        <h2 className={`text-base font-semibold ${equidashHeading}`}>Stitch 프로젝트</h2>
        <p className={`mt-1 text-sm ${equidashMutedText}`}>
          프로젝트를 선택한 뒤 다크 UI 또는 스크린샷을 확인하세요.
        </p>

        {loadingProjects ? (
          <div className="mt-4 h-10 w-48 shimmer rounded-lg" />
        ) : projects.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {projects.map((p) => {
              const active = selectedProjectId === p.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onSelectProject(p.id)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-secondary text-on-secondary"
                        : "bg-surface-container-highest text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {p.title}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {message && (
          <p
            className="mt-4 rounded-lg bg-error-container px-3 py-2 text-sm text-on-error-container"
            role="status"
          >
            {message}
          </p>
        )}
      </section>

      {loadingScreens ? (
        <div className="space-y-3">
          <div className="h-48 shimmer rounded-xl" />
          <div className="h-48 shimmer rounded-xl" />
        </div>
      ) : screens.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {screens.map((screen) => (
            <article key={screen.id} className={`overflow-hidden ${equidashPanel}`}>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-outline-variant px-4 py-3">
                <div>
                  <h3 className={`text-sm font-semibold ${equidashHeading}`}>{screen.title}</h3>
                  {screen.deviceType && (
                    <p className={`mt-0.5 text-xs ${equidashMutedText}`}>
                      {screen.deviceType}
                      {screen.width && screen.height ? ` · ${screen.width}×${screen.height}` : ""}
                    </p>
                  )}
                </div>
                {screen.htmlAvailable && selectedProjectId && (
                  <Link
                    href={buildViewHref(selectedProjectId, screen.id, screen.title)}
                    className="rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-on-secondary hover:bg-secondary/90"
                  >
                    화면으로 보기
                  </Link>
                )}
              </div>

              {screen.screenshotUrl ? (
                <button
                  type="button"
                  onClick={() =>
                    setExpandedScreenId((id) => (id === screen.id ? null : screen.id))
                  }
                  className="block w-full cursor-zoom-in bg-surface-container-lowest p-2 text-left"
                  aria-label={`${screen.title} 스크린샷 크게 보기`}
                >
                  <div className="relative aspect-[5/4] w-full overflow-hidden rounded-lg border border-outline-variant/50 bg-surface-container-low">
                    <Image
                      src={screen.screenshotUrl}
                      alt={`${screen.title} Stitch 스크린샷`}
                      fill
                      className="object-contain object-top"
                      sizes="100vw"
                      unoptimized
                    />
                  </div>
                  <span className={`mt-2 block px-2 text-xs ${equidashMutedText}`}>
                    스크린샷 · 클릭하면 크게 보기
                  </span>
                </button>
              ) : (
                <p className={`px-4 py-8 text-sm ${equidashMutedText}`}>스크린샷이 없습니다.</p>
              )}
            </article>
          ))}
        </div>
      ) : null}

      {expanded?.screenshotUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${expanded.title} 확대 보기`}
          onClick={() => setExpandedScreenId(null)}
        >
          <div
            className={`relative max-h-[90vh] w-full max-w-5xl overflow-hidden ${equidashPanelHigh}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3">
              <h3 className={`text-sm font-semibold ${equidashHeading}`}>{expanded.title}</h3>
              <button
                type="button"
                onClick={() => setExpandedScreenId(null)}
                className="rounded-md px-2 py-1 text-sm text-on-surface-variant hover:bg-surface-container-highest"
              >
                닫기
              </button>
            </div>
            <div className="relative max-h-[calc(90vh-3rem)] w-full overflow-auto bg-surface-container-lowest p-2">
              <div className="relative mx-auto min-h-[240px] w-full max-w-4xl">
                <Image
                  src={expanded.screenshotUrl}
                  alt={`${expanded.title} 확대 스크린샷`}
                  width={2560}
                  height={2048}
                  className="h-auto w-full object-contain"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
