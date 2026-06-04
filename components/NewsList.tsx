import { MaterialIcon } from "@/components/equidash/MaterialIcon";
import { formatNewsDate } from "@/lib/stockUtils";
import type { NewsItemPayload } from "@/lib/types";
import type { ReactNode } from "react";

type Props = {
  symbol: string | null;
  items: NewsItemPayload[];
  isFallback: boolean;
  loading: boolean;
  hasFetchedOnce: boolean;
};

export function NewsList({ symbol, items, isFallback, loading, hasFetchedOnce }: Props) {
  const shell = (content: ReactNode) => (
    <aside className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container lg:min-h-[480px]">
      <div className="flex items-center justify-between border-b border-outline-variant p-4">
        <h3 className="text-lg font-semibold text-on-surface">최신 뉴스</h3>
        {isFallback && (
          <span className="text-xs font-medium text-secondary">샘플</span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">{content}</div>
    </aside>
  );

  if (!symbol) {
    return shell(
      <p className="p-4 text-sm text-on-surface-variant">종목을 선택하면 뉴스가 표시됩니다.</p>,
    );
  }

  if (loading) {
    return shell(
      <div className="flex flex-col gap-3 p-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-20 shimmer rounded-lg" />
        ))}
      </div>,
    );
  }

  if (!hasFetchedOnce) {
    return shell(
      <p className="p-4 text-sm text-on-surface-variant">조회 시 최근 30일 뉴스가 표시됩니다.</p>,
    );
  }

  if (items.length === 0) {
    return shell(
      <p className="p-4 text-sm text-on-surface-variant">최근 뉴스를 찾을 수 없습니다.</p>,
    );
  }

  return shell(
    <ul className="divide-y divide-outline-variant/30">
      {items.map((n) => (
        <li key={`${n.url}-${n.datetime}`}>
          <a
            href={n.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 transition-colors hover:bg-surface-container-highest"
          >
            <div className="mb-1 flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="font-bold">{n.source}</span>
              <span>·</span>
              <span>{formatNewsDate(n.datetime)}</span>
            </div>
            <h4 className="mb-1 text-sm font-semibold text-on-surface transition-colors group-hover:text-secondary">
              {n.headline}
            </h4>
            <span className="inline-flex items-center gap-1 text-xs text-secondary opacity-0 transition-opacity group-hover:opacity-100">
              기사 열기
              <MaterialIcon name="open_in_new" className="text-sm" />
            </span>
          </a>
        </li>
      ))}
    </ul>,
  );
}
