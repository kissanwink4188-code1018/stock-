import { describe, expect, it } from "vitest";
import {
  findStitchScreenById,
  parseProjectIdFromName,
  parseScreenIdFromName,
  parseToolCallPayload,
  type StitchScreenSummary,
} from "@/lib/stitch";

describe("parseProjectIdFromName", () => {
  it("extracts numeric id from projects resource name", () => {
    expect(parseProjectIdFromName("projects/6886253415049893546")).toBe("6886253415049893546");
  });

  it("returns input when pattern does not match", () => {
    expect(parseProjectIdFromName("6886253415049893546")).toBe("6886253415049893546");
  });
});

describe("parseScreenIdFromName", () => {
  it("extracts screen id from resource name", () => {
    expect(parseScreenIdFromName("projects/1/screens/abc123")).toBe("abc123");
  });
});

describe("findStitchScreenById", () => {
  const screens: StitchScreenSummary[] = [
    {
      name: "projects/99/screens/screen-a",
      title: "Dashboard",
    },
  ];

  it("finds screen by id", () => {
    expect(findStitchScreenById(screens, "screen-a")?.title).toBe("Dashboard");
  });

  it("returns undefined when not found", () => {
    expect(findStitchScreenById(screens, "missing")).toBeUndefined();
  });
});

describe("parseToolCallPayload", () => {
  it("prefers structuredContent when present", () => {
    const payload = parseToolCallPayload<{ screens: Array<{ title: string }> }>({
      structuredContent: { screens: [{ title: "Dashboard" }] },
      content: [{ type: "text", text: '{"screens":[]}' }],
    });
    expect(payload?.screens[0]?.title).toBe("Dashboard");
  });

  it("parses JSON from text content", () => {
    const payload = parseToolCallPayload<{ projects: Array<{ title: string }> }>({
      content: [{ type: "text", text: '{"projects":[{"title":"US Stock"}]}' }],
    });
    expect(payload?.projects[0]?.title).toBe("US Stock");
  });

  it("returns null for invalid JSON", () => {
    expect(parseToolCallPayload({ content: [{ type: "text", text: "not-json" }] })).toBeNull();
  });
});
