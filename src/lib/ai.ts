import OpenAI from "openai";

export function getAiConfig() {
  if (process.env.NVIDIA_API_KEY) {
    return {
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
      model: process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct",
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: undefined as string | undefined,
      model: "gpt-4o-mini",
    };
  }
  throw new Error("No AI provider configured — set NVIDIA_API_KEY or OPENAI_API_KEY");
}

function extractJsonObject(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenced ? fenced[1] : trimmed;
  return JSON.parse(jsonText);
}

// Provider-agnostic JSON-object prompting: no reliance on any single provider's
// structured-output feature, since not all OpenAI-SDK-compatible providers (e.g.
// NVIDIA NIM) support it. Callers validate the parsed JSON with their own Zod schema.
export async function generateJson(system: string, user: string): Promise<unknown> {
  const { apiKey, baseURL, model } = getAiConfig();
  const client = new OpenAI({ apiKey, baseURL });

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const content = completion.choices[0]?.message.content;
  if (!content) {
    throw new Error("AI returned an empty response");
  }

  try {
    return extractJsonObject(content);
  } catch {
    throw new Error("AI did not return valid JSON");
  }
}
