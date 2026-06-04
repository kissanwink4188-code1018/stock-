import { describe, expect, it } from "vitest";
import {
  DEFAULT_STITCH_PROJECT_ID,
  pickPreferredStitchProject,
} from "@/lib/stitchDefaults";

describe("pickPreferredStitchProject", () => {
  it("prefers known EquiDash project id", () => {
    const picked = pickPreferredStitchProject([
      { id: "999", title: "Other" },
      { id: DEFAULT_STITCH_PROJECT_ID, title: "US Stock News Tracker" },
    ]);
    expect(picked?.id).toBe(DEFAULT_STITCH_PROJECT_ID);
  });

  it("matches EquiDash by title when id unknown", () => {
    const picked = pickPreferredStitchProject([
      { id: "1", title: "Misc" },
      { id: "2", title: "EquiDash Stock Dashboard" },
    ]);
    expect(picked?.id).toBe("2");
  });
});
