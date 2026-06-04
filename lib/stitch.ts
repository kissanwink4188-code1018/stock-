const STITCH_MCP_URL = "https://stitch.googleapis.com/mcp";

export type StitchFileRef = {
  name: string;
  downloadUrl: string;
  mimeType?: string;
};

export type StitchScreenSummary = {
  name: string;
  title: string;
  screenshot?: StitchFileRef;
  htmlCode?: StitchFileRef;
  width?: string;
  height?: string;
  deviceType?: string;
};

export type StitchProjectSummary = {
  name: string;
  title: string;
  thumbnailScreenshot?: StitchFileRef;
};

type McpToolCallResult = {
  content?: Array<{ type: string; text?: string }>;
  structuredContent?: unknown;
};

type McpRpcResponse = {
  result?: McpToolCallResult;
  error?: { message?: string };
};

export class StitchConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StitchConfigError";
  }
}

export function parseProjectIdFromName(name: string): string {
  const match = name.match(/^projects\/([^/]+)$/);
  return match?.[1] ?? name;
}

export function parseScreenIdFromName(name: string): string {
  const match = name.match(/\/screens\/([^/]+)$/);
  return match?.[1] ?? name;
}

export function findStitchScreenById(
  screens: StitchScreenSummary[],
  screenId: string,
): StitchScreenSummary | undefined {
  return screens.find((s) => parseScreenIdFromName(s.name) === screenId);
}

function tryParseJson(text: string): unknown | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      try {
        return JSON.parse(fenced[1].trim()) as unknown;
      } catch {
        return null;
      }
    }
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1)) as unknown;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function coerceListPayload<T extends Record<string, unknown>>(
  raw: unknown,
  listKey: keyof T & string,
): T | null {
  if (raw == null) return null;

  if (Array.isArray(raw)) {
    return { [listKey]: raw } as T;
  }

  if (typeof raw !== "object") return null;

  const obj = raw as Record<string, unknown>;
  if (Array.isArray(obj[listKey])) return obj as T;

  const data = obj.data;
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    if (Array.isArray(nested[listKey])) {
      return { [listKey]: nested[listKey] } as T;
    }
  }

  const result = obj.result;
  if (result && typeof result === "object") {
    const nested = result as Record<string, unknown>;
    if (Array.isArray(nested[listKey])) {
      return { [listKey]: nested[listKey] } as T;
    }
  }

  return null;
}

export function parseToolCallPayload<T>(result: McpToolCallResult | undefined): T | null {
  if (!result) return null;

  const candidates: unknown[] = [];
  if (result.structuredContent != null) candidates.push(result.structuredContent);

  for (const block of result.content ?? []) {
    if (block.type === "text" && block.text) {
      const parsed = tryParseJson(block.text);
      if (parsed != null) candidates.push(parsed);
    }
  }

  for (const raw of candidates) {
    if (raw && typeof raw === "object") {
      return raw as T;
    }
  }

  return null;
}

export function parseToolCallListPayload<T extends Record<string, unknown>>(
  result: McpToolCallResult | undefined,
  listKey: keyof T & string,
): T | null {
  const direct = parseToolCallPayload<T>(result);
  if (direct && Array.isArray(direct[listKey])) return direct;

  if (!result) return null;
  const candidates: unknown[] = [];
  if (result.structuredContent != null) candidates.push(result.structuredContent);
  for (const block of result.content ?? []) {
    if (block.type === "text" && block.text) {
      const parsed = tryParseJson(block.text);
      if (parsed != null) candidates.push(parsed);
    }
  }

  for (const raw of candidates) {
    const coerced = coerceListPayload<T>(raw, listKey);
    if (coerced) return coerced;
  }

  return null;
}

async function invokeStitchToolRaw(
  toolName: string,
  args: Record<string, unknown>,
): Promise<McpToolCallResult | undefined> {
  const apiKey = process.env.STITCH_API_KEY?.trim();
  if (!apiKey) {
    throw new StitchConfigError(
      "STITCH_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해주세요.",
    );
  }

  const res = await fetch(STITCH_MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: toolName, arguments: args },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Stitch API HTTP ${res.status}`);
  }

  const data = (await res.json()) as McpRpcResponse;
  if (data.error?.message) {
    throw new Error(data.error.message);
  }

  return data.result;
}

async function callStitchListTool<T extends Record<string, unknown>>(
  toolName: string,
  listKey: keyof T & string,
  args: Record<string, unknown>,
): Promise<T> {
  const result = await invokeStitchToolRaw(toolName, args);
  const parsed = parseToolCallListPayload<T>(result, listKey);
  if (!parsed) {
    throw new Error(`Stitch tool "${toolName}" 응답을 해석할 수 없습니다.`);
  }
  return parsed;
}

export async function callStitchTool<T>(
  toolName: string,
  args: Record<string, unknown>,
): Promise<T> {
  const result = await invokeStitchToolRaw(toolName, args);
  const parsed = parseToolCallPayload<T>(result);
  if (!parsed) {
    throw new Error(`Stitch tool "${toolName}" 응답을 해석할 수 없습니다.`);
  }
  return parsed;
}

export async function listStitchProjects(): Promise<StitchProjectSummary[]> {
  const data = await callStitchListTool<{ projects?: StitchProjectSummary[] }>(
    "list_projects",
    "projects",
    {},
  );
  return data.projects ?? [];
}

export async function listStitchScreens(projectId: string): Promise<StitchScreenSummary[]> {
  const argVariants: Record<string, unknown>[] = [
    { projectId },
    { project_id: projectId },
  ];

  let lastError: Error | null = null;
  for (const args of argVariants) {
    try {
      const data = await callStitchListTool<{ screens?: StitchScreenSummary[] }>(
        "list_screens",
        "screens",
        args,
      );
      return data.screens ?? [];
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }

  throw lastError ?? new Error("Stitch list_screens 호출에 실패했습니다.");
}

export async function fetchStitchScreenHtml(
  projectId: string,
  screenId: string,
): Promise<{ title: string; html: string }> {
  const screens = await listStitchScreens(projectId);
  const screen = findStitchScreenById(screens, screenId);

  if (!screen) {
    throw new Error(`스크린을 찾을 수 없습니다: ${screenId}`);
  }

  const htmlUrl = screen.htmlCode?.downloadUrl;
  if (!htmlUrl) {
    throw new Error(`스크린 HTML이 없습니다: ${screenId}`);
  }

  const res = await fetch(htmlUrl, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Stitch HTML 다운로드 실패 (HTTP ${res.status})`);
  }

  return { title: screen.title, html: await res.text() };
}
