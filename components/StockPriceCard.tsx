import { MaterialIcon } from "@/components/equidash/MaterialIcon";
import { changeTextClass, getChangeTone } from "@/lib/equidashTheme";
import { formatDecimal } from "@/lib/stockUtils";
import type { StockQuotePayload } from "@/lib/types";

type Props = {
  data: StockQuotePayload | null;
  loading: boolean;
  hasFetchedOnce: boolean;
  symbolLabel?: string | null;
};

export function StockPriceCard({ data, loading, hasFetchedOnce, symbolLabel }: Props) {
  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high p-4">
        <div className="mb-6 h-8 w-48 shimmer rounded" />
        <div className="mb-4 h-16 w-full shimmer rounded-lg" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-outline-variant/30 bg-surface-container-lowest py-16">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary" />
          <p className="text-sm text-on-surface-variant">데이터를 불러오는 중입니다.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-high p-8 text-center">
        <MaterialIcon name="candlestick_chart" className="mb-3 text-4xl text-outline" />
        <p className="text-sm text-on-surface-variant">
          {hasFetchedOnce
            ? "주가 정보를 불러오지 못했습니다."
            : "종목을 선택하면 실시간 주가가 표시됩니다."}
        </p>
      </div>
    );
  }

  const tone = getChangeTone(data.change);
  const toneClass = changeTextClass(tone);

  return (
    <section
      className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high p-4 md:p-6"
      aria-label={`${data.symbol} 주가 정보`}
    >
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 font-mono text-[11px] font-bold tracking-widest text-secondary uppercase">
            실시간 주가
          </p>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-4xl font-bold tracking-tight text-on-surface md:text-5xl">
              {data.symbol}
            </span>
            {symbolLabel && (
              <span className="text-lg text-on-surface-variant">{symbolLabel}</span>
            )}
            {data.isFallback && (
              <span className="rounded bg-error-container px-2 py-0.5 text-xs font-medium text-on-error-container">
                샘플 데이터
              </span>
            )}
          </div>
        </div>
        <div className="text-left md:text-right">
          <div className="font-mono text-4xl font-semibold leading-tight text-on-surface md:text-5xl">
            ${formatDecimal(data.currentPrice)}
          </div>
          <div className={`flex items-center gap-1 font-bold md:justify-end ${toneClass}`}>
            <MaterialIcon
              name={tone === "positive" ? "arrow_drop_up" : "arrow_drop_down"}
              className="text-2xl"
            />
            <span className="font-mono text-sm md:text-base">
              {tone === "positive" ? "+" : ""}
              {formatDecimal(data.change)} ({tone === "positive" ? "+" : ""}
              {formatDecimal(data.changePercent)}%)
            </span>
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "전일 종가", value: `$${formatDecimal(data.previousClose)}` },
          {
            label: "전일 대비",
            value: `${tone === "positive" ? "+" : ""}${formatDecimal(data.changePercent)}%`,
            valueClass: toneClass,
          },
          { label: "고가", value: `$${formatDecimal(data.high)}` },
          { label: "저가", value: `$${formatDecimal(data.low)}` },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-outline-variant/50 bg-surface-container p-4"
          >
            <dt className="text-xs text-on-surface-variant">{item.label}</dt>
            <dd
              className={`mt-1 font-mono text-lg font-semibold text-on-surface ${item.valueClass ?? ""}`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
