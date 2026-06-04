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

export function parseToolCallPayload<T>(result: McpToolCallResult | undefined): T | null {
  if (!result) return null;

  if (result.structuredContent && typeof result.structuredContent === "object") {
    return result.structuredContent as T;
  }

  const text = result.content?.find((c) => c.type === "text")?.text;
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function callStitchTool<T>(
  toolName: string,
  args: Record<string, unknown>,
): Promise<T> {
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

  const parsed = parseToolCallPayload<T>(data.result);
  if (!parsed) {
    throw new Error(`Stitch tool "${toolName}" 응답을 해석할 수 없습니다.`);
  }

  return parsed;
}

export async function listStitchProjects(): Promise<StitchProjectSummary[]> {
  const data = await callStitchTool<{ projects?: StitchProjectSummary[] }>("list_projects", {});
  return data.projects ?? [];
}

export async function listStitchScreens(projectId: string): Promise<StitchScreenSummary[]> {
  const data = await callStitchTool<{ screens?: StitchScreenSummary[] }>("list_screens", {
    projectId,
  });
  return data.screens ?? [];
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
