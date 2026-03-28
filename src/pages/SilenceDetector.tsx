import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Search, VolumeX, TrendingDown, Calendar, AlertTriangle, Loader2 } from "lucide-react";
import { callEdgeFunction, getUserProfile } from "@/lib/vaaniApi";

const defaultSilence = {
  topic: "Yes Bank Restructuring",
  analysis: {
    peakCoverage: "March 2020 -- April 2020",
    currentStatus: "Near-zero coverage since Q3 2025",
    articlesLastMonth: 2,
    articlesPeak: 347,
    coverageDropPercent: 99.4,
  },
  signals: [
    { type: "Coverage Cliff", detail: "Coverage dropped from 45 articles/week in March 2020 to under 1 article/month by late 2025. The reconstruction story was declared 'done' by editorial consensus -- but restructuring continues." },
    { type: "Unresolved Thread", detail: "AT1 bond write-down litigation is still ongoing in Supreme Court. Over Rs 8,400 crore in investor claims remain unresolved. No major publication has covered the February 2026 hearing." },
    { type: "Ownership Ambiguity", detail: "SBI's stake reduction roadmap remains unclear. Lock-in period for consortium investors ended in March 2025 but no exit activity has been reported or investigated." },
    { type: "Regulatory Gap", detail: "RBI's final report on supervisory failures that led to the Yes Bank crisis has never been published. No publication has filed an RTI or FOI request for it." },
  ],
  trend: [
    { month: "Mar 2020", articles: 347 },
    { month: "Jun 2020", articles: 120 },
    { month: "Dec 2020", articles: 45 },
    { month: "Jun 2021", articles: 18 },
    { month: "Dec 2021", articles: 12 },
    { month: "Jun 2022", articles: 8 },
    { month: "Dec 2022", articles: 5 },
    { month: "Jun 2023", articles: 4 },
    { month: "Dec 2023", articles: 3 },
    { month: "Jun 2024", articles: 2 },
    { month: "Dec 2024", articles: 2 },
    { month: "Jun 2025", articles: 1 },
    { month: "Mar 2026", articles: 2 },
  ],
  whyItMatters: "",
};

const SilenceDetector = () => {
  const [query, setQuery] = useState("");
  const [silenceData, setSilenceData] = useState(defaultSilence);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maxArticles = Math.max(...silenceData.trend.map((t) => t.articles));

  const analyzesilence = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const profile = getUserProfile();
      const data = await callEdgeFunction("vaani-silence", {
        topic: query,
        language: profile.language,
        literacy: profile.literacy,
        city: profile.city,
      });
      const content = data.result;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setSilenceData(JSON.parse(jsonMatch[0]));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze silence");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-body font-semibold uppercase tracking-[0.3em] text-gold mb-2">Silence Detector</p>
          <h1 className="font-editorial text-3xl md:text-4xl font-bold mb-2">What Stopped Being News?</h1>
          <p className="text-muted-foreground font-body mb-8 max-w-xl">
            Tracks topics that journalism stopped covering and surfaces that absence as an intelligence signal. First-of-its-kind newsroom tool.
          </p>
        </motion.div>

        <div className="flex gap-3 max-w-xl mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyzesilence()}
              placeholder="e.g. Yes Bank, IL&FS, Adani-Hindenburg, PMC Bank..."
              className="w-full rounded-lg border border-border bg-card pl-11 pr-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
          </div>
          <button
            onClick={analyzesilence}
            disabled={loading || !query.trim()}
            className="gold-gradient rounded-lg px-5 py-3 text-sm font-body font-semibold text-primary-foreground disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Detect Silence"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {["IL&FS Collapse", "PMC Bank Scam", "Adani-Hindenburg", "AGR Telecom Dues"].map((s) => (
            <button key={s} onClick={() => setQuery(s)} className="rounded-full border border-border px-3 py-1 text-xs font-body text-muted-foreground hover:border-gold/30 hover:text-gold transition-colors">
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-red-400/30 bg-red-400/5 p-4 mb-6 text-sm font-body text-red-400">{error}</div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="font-editorial text-2xl font-bold text-gold mb-1">{silenceData.topic}</h2>
          <p className="text-xs text-muted-foreground font-body mb-8">Silence analysis with coverage trend</p>

          {silenceData.whyItMatters && (
            <p className="text-sm text-muted-foreground font-body italic mb-8 pl-4 border-l-2 border-gold/30">
              {silenceData.whyItMatters}
            </p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Peak Coverage", value: silenceData.analysis.peakCoverage, icon: Calendar },
              { label: "Articles at Peak", value: String(silenceData.analysis.articlesPeak), icon: TrendingDown },
              { label: "Articles Last Month", value: String(silenceData.analysis.articlesLastMonth), icon: VolumeX },
              { label: "Coverage Drop", value: `${silenceData.analysis.coverageDropPercent}%`, icon: AlertTriangle },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
                <stat.icon className="h-4 w-4 text-gold mb-2" />
                <p className="font-editorial text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-body mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Coverage Trend */}
          <div className="rounded-lg border border-border bg-card p-6 mb-10">
            <h3 className="font-editorial text-base font-semibold mb-4">Coverage Trend</h3>
            <div className="flex items-end gap-1.5 h-40">
              {silenceData.trend.map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="absolute -top-6 hidden group-hover:block bg-card border border-border rounded px-2 py-1 text-[10px] font-body text-foreground whitespace-nowrap z-10">
                    {point.month}: {point.articles} articles
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(point.articles / maxArticles) * 100}%` }}
                    transition={{ delay: 0.04 * i, duration: 0.5 }}
                    className="w-full rounded-t-sm gold-gradient min-h-[2px] cursor-pointer hover:opacity-80"
                  />
                  <span className="text-[8px] text-muted-foreground font-body leading-none hidden md:block">
                    {point.month.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Silence Signals */}
          <h3 className="font-editorial text-xl font-semibold mb-4 flex items-center gap-2">
            <VolumeX className="h-5 w-5 text-gold" />
            Silence Signals
          </h3>
          <div className="space-y-4">
            {silenceData.signals.map((signal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-lg border border-border bg-card p-5 hover:border-gold/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-red-400/60" />
                  <h4 className="font-body font-semibold text-sm text-gold">{signal.type}</h4>
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{signal.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SilenceDetector;
