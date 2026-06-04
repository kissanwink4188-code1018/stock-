import { describe, expect, it, vi, afterEach } from "vitest";

describe("clientApi (static export)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses client API in static export mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_STATIC_EXPORT", "true");
    const { usesClientApi } = await import("@/lib/clientApi");
    expect(usesClientApi()).toBe(true);
  });

  it("merges Korean top-50 hits with sample search", async () => {
    vi.stubEnv("NEXT_PUBLIC_STATIC_EXPORT", "true");
    const { clientSearchStocks } = await import("@/lib/clientApi");
    const result = await clientSearchStocks("애플");
    expect(result.results.some((r) => r.symbol === "AAPL")).toBe(true);
  });
});
