import { EquiDashShell } from "@/components/equidash/EquiDashShell";
import { StitchLiveScreen } from "@/components/StitchLiveScreen";

export default function StitchViewPage() {
  return (
    <EquiDashShell mode="preview">
      <StitchLiveScreen />
    </EquiDashShell>
  );
}
