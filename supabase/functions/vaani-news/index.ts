import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { category, language, literacy, city } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const systemPrompt = `You are Vaani's Live News Engine for The Economic Times. Generate the LATEST breaking Indian business and financial news as of ${today}.

Return valid JSON array of 8-10 articles:
[
  {
    "title": "headline",
    "summary": "2-3 sentence summary with specific numbers, names, stock movements",
    "category": "Markets|Economy|Industry|Policy|Startups|Technology",
    "time": "relative time like '15 min ago', '1 hour ago', '3 hours ago'",
    "source": "ET Markets|ET Economy|ET Industry|ET Policy|ET Startups|ET Tech"
  }
]

Rules:
- Use REAL current events, companies, and data points from India
- Include specific numbers: stock prices, percentage changes, rupee amounts, user counts
- Cover diverse categories: at least 2 Markets, 1 Economy, 1 Industry, 1 Policy/Startups
- Make headlines punchy and specific, not generic
- Reference real Indian companies: Reliance, TCS, Infosys, HDFC, Tata, Zomato, Paytm, Ola, etc.
- Include RBI, SEBI, government policy updates when relevant
- Times should span the last 12 hours realistically
${category && category !== "All" ? `- Focus primarily on ${category} category` : ""}
- Adapt language register for a ${literacy} reader in ${city} who prefers ${language}
- Keep summaries in English but make them accessible`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate today's latest Indian business news feed${category && category !== "All" ? ` focused on ${category}` : ""}. Today is ${today}.` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "News generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("vaani-news error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
