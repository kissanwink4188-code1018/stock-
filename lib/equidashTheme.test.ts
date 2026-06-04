import { describe, expect, it } from "vitest";
import {
  changeTextClass,
  changeIconName,
  equidashPanel,
  getChangeTone,
} from "@/lib/equidashTheme";

describe("getChangeTone", () => {
  it("returns positive for zero or positive change", () => {
    expect(getChangeTone(0)).toBe("positive");
    expect(getChangeTone(1.5)).toBe("positive");
  });

  it("returns negative for negative change", () => {
    expect(getChangeTone(-0.01)).toBe("negative");
  });
});

describe("changeTextClass", () => {
  it("maps tone to tailwind classes", () => {
    expect(changeTextClass("positive")).toContain("secondary");
    expect(changeTextClass("negative")).toContain("error");
  });
});

describe("changeIconName", () => {
  it("maps tone to material icon names", () => {
    expect(changeIconName("positive")).toBe("trending_up");
    expect(changeIconName("negative")).toBe("trending_down");
  });
});

describe("equidashPanel", () => {
  it("uses dark surface tokens", () => {
    expect(equidashPanel).toContain("surface-container");
    expect(equidashPanel).toContain("outline-variant");
  });
});
