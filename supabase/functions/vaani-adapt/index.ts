import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { article, language, literacy, city, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "adapt") {
      systemPrompt = `You are Vaani, a cultural adaptation engine for Indian business news. You rewrite articles so they resonate with a reader in ${city} who speaks ${language} at a ${literacy} literacy level. Do NOT just translate. Use local analogies, references, and context. For example, "repo rate hike" should become something like "RBI ne loan mahenga kar diya" for Hindi beginner readers. Keep the core facts intact. Return the adapted article with a title and body. Respond in ${language} script.`;
      userPrompt = `Adapt this article:\n\nTitle: ${article.title}\n\n${article.summary}`;
    } else if (action === "explain") {
      systemPrompt = `You are Vaani's Explain This engine. Take a paragraph from an Indian business news article and rewrite it with a locally resonant analogy for someone in ${city} who speaks ${language} at a ${literacy} level. Make it feel like a knowledgeable friend explaining over chai. Keep it under 3 sentences. Respond in ${language} script.`;
      userPrompt = `Explain this: "${article.summary}"`;
    } else if (action === "voice") {
      systemPrompt = `You are Vaani's voice script generator. Create a natural, conversational audio script (NOT robotic TTS) for an Indian business news article. The script should sound like a knowledgeable radio host speaking to a ${literacy}-level audience in ${city}. Write in ${language} script. Include natural pauses marked with [pause]. Keep it under 200 words. Make it engaging and warm.`;
      userPrompt = `Generate a voice script for:\n\nTitle: ${article.title}\n\n${article.summary}`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI processing failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("vaani-adapt error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
