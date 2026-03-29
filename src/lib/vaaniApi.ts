const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function getUserProfile() {
  try {
    const raw = localStorage.getItem("vaani_profile");
    if (!raw) return { language: "Hindi", literacy: "Intermediate", city: "Mumbai", interests: [] };
    const data = JSON.parse(raw);
    // data is { "0": ["Hindi"], "1": ["Beginner -- explain everything simply"], "2": ["Mumbai"], "3": ["Stock Markets", ...] }
    const lang = data["0"]?.[0] || data[0]?.[0] || "Hindi";
    const literacyRaw = data["1"]?.[0] || data[1]?.[0] || "Intermediate";
    const literacy = literacyRaw.split(" -- ")[0] || "Intermediate";
    const city = data["2"]?.[0] || data[2]?.[0] || "Mumbai";
    const interests = data["3"] || data[3] || [];
    return { language: lang, literacy, city, interests };
  } catch {
    return { language: "Hindi", literacy: "Intermediate", city: "Mumbai", interests: [] };
  }
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "- ");
}

export async function streamFromEdgeFunction({
  functionName,
  body,
  onDelta,
  onDone,
  onError,
}: {
  functionName: string;
  body: Record<string, unknown>;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Request failed" }));
      onError(err.error || `Error ${resp.status}`);
      return;
    }

    const contentType = resp.headers.get("content-type") || "";

    if (contentType.includes("text/event-stream") && resp.body) {
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) onDelta(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } else {
      const data = await resp.json();
      if (data.result) onDelta(data.result);
      if (data.error) {
        onError(data.error);
        return;
      }
    }

    onDone();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Connection failed");
  }
}

export async function callEdgeFunction(functionName: string, body: Record<string, unknown>) {
  const resp = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `Error ${resp.status}`);
  }

  return resp.json();
}
