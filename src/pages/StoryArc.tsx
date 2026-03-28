import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Search, TrendingUp, TrendingDown, Minus, AlertTriangle, Eye, Users, Loader2 } from "lucide-react";
import { callEdgeFunction, getUserProfile } from "@/lib/vaaniApi";

const demoArc = {
  keyword: "Jio vs Airtel Price War",
  events: [
    { date: "Jan 2026", title: "Jio slashes 5G recharge by 20%", sentiment: "negative", detail: "Aggressive move targeting tier-2 cities. Airtel stock drops 3.2% on announcement." },
    { date: "Feb 2026", title: "Airtel matches with unlimited 5G bundles", sentiment: "negative", detail: "Retaliatory pricing move. Analyst consensus: margin compression across sector." },
    { date: "Mar 2026", title: "TRAI warns against predatory pricing", sentiment: "neutral", detail: "Regulatory signal. Both companies asked to justify pricing below cost estimates." },
    { date: "Mar 2026", title: "Vi reports 8 lakh subscriber loss", sentiment: "negative", detail: "Collateral damage. Vodafone Idea loses subscribers to both Jio and Airtel." },
    { date: "Apr 2026", title: "Jio launches JioTV+ bundled with 5G plans", sentiment: "positive", detail: "Content bundling strategy shifts focus from price to value. Market responds positively." },
    { date: "Apr 2026", title: "Goldman Sachs upgrades telecom sector", sentiment: "positive", detail: "Report: worst of tariff war is behind us. Consolidation phase expected in H2 2026." },
  ],
  players: ["Mukesh Ambani", "Gopal Vittal", "TRAI Chairman", "Akash Ambani", "Sunil Mittal"],
  predictions: [
    "Tariff war likely ends by Q3 2026 with 10-15% ARPU recovery.",
    "Vi may exit consumer mobile, focus on enterprise.",
    "5G bundled content will become primary differentiator.",
  ],
  contrarian: "Minority view: tariff war benefits consumers long-term and accelerates 5G adoption faster than any government policy could.",
  silence: ["No coverage of tower company impact since February.", "Rural broadband rollout data absent from all reports."],
  sentiment_summary: "Negative trajectory through Q1 2026, shifting positive as value-based competition replaces pure price war.",
};

const SentimentIcon = ({ sentiment }: { sentiment: string }) => {
  if (sentiment === "positive") return <TrendingUp className="h-4 w-4 text-emerald-400" />;
  if (sentiment === "negative") return <TrendingDown className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const sentimentColor = (sentiment: string) => {
  if (sentiment === "positive") return "border-emerald-400/30 bg-emerald-400/5";
  if (sentiment === "negative") return "border-red-400/30 bg-red-400/5";
  return "border-border bg-card";
};

const StoryArc = () => {
  const [query, setQuery] = useState("");
  const [arc, setArc] = useState(demoArc);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateArc = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const profile = getUserProfile();
      const data = await callEdgeFunction("vaani-arc", {
        keyword: query,
        language: profile.language,
        literacy: profile.literacy,
        city: profile.city,
      });
      const content = data.result;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setArc(parsed);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate arc");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-body font-semibold uppercase tracking-[0.3em] text-gold mb-2">Story Arc Tracker</p>
          <h1 className="font-editorial text-3xl md:text-4xl font-bold mb-2">Track Any Story</h1>
          <p className="text-muted-foreground font-body mb-8 max-w-xl">
            Enter any keyword to generate a living timeline with sentiment analysis, key players, predictions, and the intelligence of silence.
          </p>
        </motion.div>

        {/* Search */}
        <div className="flex gap-3 max-w-xl mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateArc()}
              placeholder="e.g. Jio vs Airtel, India EV revolution, SEBI algo trading..."
              className="w-full rounded-lg border border-border bg-card pl-11 pr-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
          </div>
          <button
            onClick={generateArc}
            disabled={loading || !query.trim()}
            className="gold-gradient rounded-lg px-5 py-3 text-sm font-body font-semibold text-primary-foreground disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
          </button>
        </div>

        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mb-10">
          {["India EV Revolution", "Adani-Hindenburg", "UPI International Expansion", "Paytm RBI Ban"].map((s) => (
            <button
              key={s}
              onClick={() => { setQuery(s); }}
              className="rounded-full border border-border px-3 py-1 text-xs font-body text-muted-foreground hover:border-gold/30 hover:text-gold transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-red-400/30 bg-red-400/5 p-4 mb-6 text-sm font-body text-red-400">{error}</div>
        )}

        {/* Arc Display */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-gold">{arc.keyword}</h2>
              <p className="text-xs text-muted-foreground font-body mt-1">{arc.events.length} events tracked</p>
            </div>
            {/* Sentiment heatmap mini */}
            <div className="hidden md:flex items-center gap-1">
              <span className="text-[10px] font-body text-muted-foreground mr-2">SENTIMENT</span>
              {arc.events.map((e, i) => (
                <div
                  key={i}
                  className={`h-6 w-3 rounded-sm ${
                    e.sentiment === "positive" ? "bg-emerald-400/60" :
                    e.sentiment === "negative" ? "bg-red-400/60" : "bg-muted-foreground/30"
                  }`}
                  title={`${e.date}: ${e.sentiment}`}
                />
              ))}
            </div>
          </div>

          {arc.sentiment_summary && (
            <p className="text-sm text-muted-foreground font-body italic mb-8 pl-4 border-l-2 border-gold/30">
              {arc.sentiment_summary}
            </p>
          )}

          {/* Timeline */}
          <div className="relative ml-4 border-l-2 border-border pl-8 space-y-6 mb-12">
            {arc.events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className={`relative rounded-lg border p-4 ${sentimentColor(event.sentiment)}`}
              >
                <div className={`absolute -left-[2.85rem] top-4 h-3 w-3 rounded-full border-2 ${
                  event.sentiment === "positive" ? "border-emerald-400 bg-emerald-400/20" :
                  event.sentiment === "negative" ? "border-red-400 bg-red-400/20" :
                  "border-gold bg-background"
                }`} />
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-body font-semibold text-gold">{event.date}</span>
                  <SentimentIcon sentiment={event.sentiment} />
                  <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">{event.sentiment}</span>
                </div>
                <h4 className="font-body font-semibold text-sm mb-1">{event.title}</h4>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">{event.detail}</p>
              </motion.div>
            ))}
          </div>

          {/* Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-gold" />
                <h3 className="font-editorial text-sm font-semibold">Key Players</h3>
              </div>
              <ul className="space-y-2">
                {arc.players.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold/40" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-4 w-4 text-gold" />
                <h3 className="font-editorial text-sm font-semibold">Forward Predictions</h3>
              </div>
              <ul className="space-y-3">
                {arc.predictions.map((p, i) => (
                  <li key={i} className="text-sm text-muted-foreground font-body leading-relaxed pl-3 border-l border-gold/20">{p}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-gold" />
                <h3 className="font-editorial text-sm font-semibold">Silence Signals</h3>
              </div>
              <ul className="space-y-3">
                {arc.silence.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground font-body leading-relaxed pl-3 border-l border-red-400/20">{s}</li>
                ))}
              </ul>
              <div className="mt-4 rounded-md bg-gold/5 border border-gold/20 p-3">
                <p className="text-[10px] font-body uppercase tracking-widest text-gold/60 mb-1">Contrarian View</p>
                <p className="text-xs font-body italic text-gold/80">{arc.contrarian}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default StoryArc;
