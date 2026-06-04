import { EquiDashShell } from "@/components/equidash/EquiDashShell";
import { StitchHomePreview } from "@/components/StitchHomePreview";
import { StockSearchForm } from "@/components/StockSearchForm";

export default function HomePage() {
  return (
    <EquiDashShell>
      <div className="space-y-6">
        <StitchHomePreview />
        <StockSearchForm />
      </div>
    </EquiDashShell>
  );
}
