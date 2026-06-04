"use client";

import { MaterialIcon } from "@/components/equidash/MaterialIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** iframe 미리보기 등 — 사이드바 없이 상단 바만 */
  mode?: "app" | "preview";
};

const SIDE_NAV = [
  { icon: "dashboard", label: "Overview", href: "/" },
  { icon: "palette", label: "Stitch 디자인", href: "/design" },
] as const;

export function EquiDashShell({ children, mode = "app" }: Props) {
  const pathname = usePathname();
  const isPreview = mode === "preview";
  const isDesign = pathname.startsWith("/design");

  if (isPreview) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-on-background">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-mono text-xl font-semibold text-secondary hover:opacity-90">
            EquiDash
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                !isDesign
                  ? "border-b-2 border-primary pb-1 text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              시장
            </Link>
            <Link
              href="/design"
              className={`text-sm transition-colors ${
                isDesign
                  ? "border-b-2 border-primary pb-1 text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Stitch 디자인
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container-low px-2 py-1">
          <MaterialIcon name="dark_mode" className="text-base text-secondary" />
          <span className="text-[10px] font-medium text-on-surface-variant">Dark</span>
        </div>
      </header>

      <div className="flex min-h-screen pt-16">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-outline-variant bg-surface-container-low py-4 md:flex">
          <div className="mb-8 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-container">
                <MaterialIcon name="dashboard" className="text-on-secondary-container" />
              </div>
              <div>
                <div className="font-mono text-xs text-on-surface">Market Terminal</div>
                <div className="flex items-center gap-1 text-[10px] text-secondary">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
                  Live · Dark UI
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            {SIDE_NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-surface-container-highest font-bold text-secondary"
                      : "text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  <MaterialIcon name={item.icon} className="text-lg" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto px-4">
            <p className="border-t border-outline-variant pt-4 text-[10px] leading-relaxed text-on-surface-variant">
              학습용 예제 · 투자 자문 아님
            </p>
          </div>
        </aside>

        <main className="relative min-h-[calc(100vh-4rem)] flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-outline-variant bg-surface-container md:hidden">
        {SIDE_NAV.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                active ? "text-secondary" : "text-on-surface-variant"
              }`}
            >
              <MaterialIcon name={item.icon} className="text-xl" />
              <span className="text-[10px]">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
