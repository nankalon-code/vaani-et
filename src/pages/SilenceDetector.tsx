import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Search, VolumeX, TrendingDown, Calendar, AlertTriangle } from "lucide-react";

const demoSilence = {
  topic: "Yes Bank Restructuring",
  analysis: {
    peakCoverage: "March 2020 -- April 2020",
    currentStatus: "Near-zero coverage since Q3 2025",
    articlesLastMonth: 2,
    articlesPeak: 347,
    coverageDropPercent: 99.4,
  },
  signals: [
    {
      type: "Coverage Cliff",
      detail: "Coverage dropped from 45 articles/week in March 2020 to under 1 article/month by late 2025. The reconstruction story was declared 'done' by editorial consensus -- but restructuring continues.",
    },
    {
      type: "Unresolved Thread",
      detail: "AT1 bond write-down litigation is still ongoing in Supreme Court. Over Rs 8,400 crore in investor claims remain unresolved. No major publication has covered the February 2026 hearing.",
    },
    {
      type: "Ownership Ambiguity",
      detail: "SBI's stake reduction roadmap remains unclear. Lock-in period for consortium investors ended in March 2025 but no exit activity has been reported or investigated.",
    },
    {
      type: "Regulatory Gap",
      detail: "RBI's final report on supervisory failures that led to the Yes Bank crisis has never been published. No publication has filed an RTI or FOI request for it.",
    },
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
};

const maxArticles = Math.max(...demoSilence.trend.map((t) => t.articles));

const SilenceDetector = () => {
  const [query, setQuery] = useState("");

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

        <div className="relative max-w-xl mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Yes Bank, IL&FS, Adani-Hindenburg, PMC Bank..."
            className="w-full rounded-lg border border-border bg-card pl-11 pr-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="font-editorial text-2xl font-bold text-gold mb-1">{demoSilence.topic}</h2>
          <p className="text-xs text-muted-foreground font-body mb-8">Silence analysis with coverage trend</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Peak Coverage", value: demoSilence.analysis.peakCoverage, icon: Calendar },
              { label: "Articles at Peak", value: demoSilence.analysis.articlesPeak.toString(), icon: TrendingDown },
              { label: "Articles Last Month", value: demoSilence.analysis.articlesLastMonth.toString(), icon: VolumeX },
              { label: "Coverage Drop", value: `${demoSilence.analysis.coverageDropPercent}%`, icon: AlertTriangle },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
                <stat.icon className="h-4 w-4 text-gold mb-2" />
                <p className="font-editorial text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-body mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Coverage Trend Bar Chart */}
          <div className="rounded-lg border border-border bg-card p-6 mb-10">
            <h3 className="font-editorial text-base font-semibold mb-4">Coverage Trend</h3>
            <div className="flex items-end gap-1.5 h-40">
              {demoSilence.trend.map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(point.articles / maxArticles) * 100}%` }}
                    transition={{ delay: 0.05 * i, duration: 0.5 }}
                    className="w-full rounded-t-sm gold-gradient min-h-[2px]"
                  />
                  <span className="text-[9px] text-muted-foreground font-body leading-none hidden md:block">
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
            {demoSilence.signals.map((signal, i) => (
              <motion.div
                key={signal.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-lg border border-border bg-card p-5"
              >
                <h4 className="font-body font-semibold text-sm text-gold mb-2">{signal.type}</h4>
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
