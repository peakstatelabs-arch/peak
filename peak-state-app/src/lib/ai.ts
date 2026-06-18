import Anthropic from "@anthropic-ai/sdk";

export const AI_MODEL = "claude-sonnet-4-6";

export function getAnthropic(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

export const AI_NOT_CONFIGURED = {
  error:
    "AI isn't configured yet. Add ANTHROPIC_API_KEY in the Vercel project settings to enable this feature.",
};

/** Extract the first JSON object from a Claude text response. */
export function extractJson<T = unknown>(text: string): T | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

export function textOf(content: Anthropic.Messages.ContentBlock[]): string {
  return content.map((b) => (b.type === "text" ? b.text : "")).join("");
}
