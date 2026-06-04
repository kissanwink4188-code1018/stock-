import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
};

export function EquiDashPageHeader({
  title,
  description,
  backHref = "/",
  backLabel = "← 대시보드로",
  action,
}: Props) {
  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={backHref}
            className="text-sm font-medium text-secondary underline-offset-2 hover:underline"
          >
            {backLabel}
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-on-surface sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
