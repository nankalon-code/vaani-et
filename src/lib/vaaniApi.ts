const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function getUserProfile() {
  try {
    const raw = localStorage.getItem("vaani_profile");
    if (!raw) return { language: "Hindi", literacy: "Intermediate", city: "Mumbai", interests: [] };
    const data = JSON.parse(raw);
    const languageOptions = ["Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi", "Odia", "Urdu", "English"];
    const literacyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];
    const cityOptions = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat", "Patna", "Lucknow"];
    return {
      language: languageOptions[(data[0]?.indexOf(data[0]?.[0]) ?? 0)] || data[0]?.[0] || "Hindi",
      literacy: literacyOptions[(data[1]?.indexOf(data[1]?.[0]) ?? 0)]?.split(" -- ")[0] || "Intermediate",
      city: data[2]?.[0] || "Mumbai",
      interests: data[3] || [],
    };
  } catch {
    return { language: "Hindi", literacy: "Intermediate", city: "Mumbai", interests: [] };
  }
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
