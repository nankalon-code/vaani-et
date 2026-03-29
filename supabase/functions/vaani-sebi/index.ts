import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { language, literacy, city } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const today = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

    const systemPrompt = `You are Vaani's SEBI Circular Mapper. Analyze the latest/most impactful SEBI circular and map its regulatory impact to sectors and NSE-listed stocks.

Return valid JSON:
{
  "title": "SEBI circular reference number",
  "date": "circular date",
  "subject": "circular subject line",
  "summary": "3-4 sentence plain language summary of what the circular mandates",
  "impactedSectors": [
    {"name": "sector name", "impact": "HIGH|MEDIUM|LOW", "detail": "2-3 sentence impact explanation with specific company names and cost estimates"}
  ],
  "affectedStocks": [
    {"ticker": "NSE ticker", "name": "company name", "change": "+/-X.X%", "reason": "1 sentence rationale"}
  ],
  "keyDates": [
    {"date": "date", "event": "compliance deadline or milestone"}
  ],
  "vernacularExplainer": "2-3 sentence explanation in simple terms for a ${literacy} reader"
}

Include 4-6 impacted sectors and 4-6 affected stocks. Use real SEBI circular formats and reference numbers. Reference real NSE-listed companies. Adapt for a ${literacy} reader in ${city} who prefers ${language}. Today's date: ${today}.`;

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
          { role: "user", content: `Analyze the most recent impactful SEBI circular as of ${today} and map its regulatory impact.` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
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
      return new Response(JSON.stringify({ error: "SEBI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("vaani-sebi error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
