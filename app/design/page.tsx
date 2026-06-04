import { EquiDashPageHeader } from "@/components/equidash/EquiDashPageHeader";
import { EquiDashShell } from "@/components/equidash/EquiDashShell";
import { StitchScreensGallery } from "@/components/StitchScreensGallery";

export default function DesignPreviewPage() {
  return (
    <EquiDashShell>
      <EquiDashPageHeader
        title="Stitch 디자인"
        description="Stitch에서 생성한 다크 모드 UI를 라이브 HTML로 보거나 스크린샷과 비교할 수 있습니다."
        backHref="/"
        backLabel="← 터미널로"
      />
      <StitchScreensGallery />
    </EquiDashShell>
  );
}
