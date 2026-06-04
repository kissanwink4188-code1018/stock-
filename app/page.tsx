import { EquiDashShell } from "@/components/equidash/EquiDashShell";
import { StockSearchForm } from "@/components/StockSearchForm";

export default function HomePage() {
  return (
    <EquiDashShell>
      <StockSearchForm />
    </EquiDashShell>
  );
}
