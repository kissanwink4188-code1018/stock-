import { describe, expect, it } from "vitest";
import { mapQuoteToPayload } from "@/lib/finnhub";

describe("mapQuoteToPayload", () => {
  it("computes change fields from Finnhub quote", () => {
    const payload = mapQuoteToPayload("aapl", { c: 200, pc: 190, h: 201, l: 195 });
    expect(payload).not.toBeNull();
    expect(payload?.symbol).toBe("AAPL");
    expect(payload?.currentPrice).toBe(200);
    expect(payload?.previousClose).toBe(190);
    expect(payload?.change).toBe(10);
    expect(payload?.changePercent).toBe(5.26);
    expect(payload?.isFallback).toBe(false);
  });

  it("returns null when both prices are zero", () => {
    expect(mapQuoteToPayload("bad", { c: 0, pc: 0 })).toBeNull();
  });
});
