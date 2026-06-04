import { describe, expect, it } from "vitest";
import {
  computeChange,
  computeChangePercent,
  formatDecimal,
  formatNewsDate,
  normalizeSymbol,
  roundTwo,
} from "@/lib/stockUtils";

describe("normalizeSymbol", () => {
  it("trims and uppercases", () => {
    expect(normalizeSymbol("  aapl  ")).toBe("AAPL");
  });
});

describe("roundTwo", () => {
  it("rounds to two decimals", () => {
    expect(roundTwo(1.234)).toBe(1.23);
    expect(roundTwo(1.235)).toBe(1.24);
  });
});

describe("computeChange", () => {
  it("matches current minus previous close", () => {
    expect(computeChange(10.12, 10)).toBe(0.12);
  });
});

describe("computeChangePercent", () => {
  it("uses previous close as denominator", () => {
    expect(computeChangePercent(1, 100)).toBe(1);
    expect(computeChangePercent(0, 0)).toBe(0);
  });
});

describe("formatDecimal", () => {
  it("formats with two fraction digits", () => {
    expect(formatDecimal(3.3)).toBe("3.30");
  });
});

describe("formatNewsDate", () => {
  it("formats unix seconds", () => {
    const s = formatNewsDate(1700000000, "ko-KR");
    expect(s.length).toBeGreaterThan(6);
  });
});
