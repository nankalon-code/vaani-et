import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Search, TrendingUp, TrendingDown, Minus, AlertTriangle, Eye, Users } from "lucide-react";

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
};

const SentimentIcon = ({ sentiment }: { sentiment: string }) => {
  if (sentiment === "positive") return <TrendingUp className="h-4 w-4 text-emerald-400" />;
  if (sentiment === "negative") return <TrendingDown className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const StoryArc = () => {
  const [query, setQuery] = useState("");

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
        <div className="relative max-w-xl mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Jio vs Airtel, India EV revolution, SEBI algo trading..."
            className="w-full rounded-lg border border-border bg-card pl-11 pr-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
        </div>

        {/* Demo Arc */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="font-editorial text-2xl font-bold mb-1 text-gold">{demoArc.keyword}</h2>
          <p className="text-xs text-muted-foreground font-body mb-8">Pre-built demo arc -- {demoArc.events.length} events tracked</p>

          {/* Timeline */}
          <div className="relative ml-4 border-l-2 border-border pl-8 space-y-8 mb-12">
            {demoArc.events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="relative"
              >
                <div className="absolute -left-[2.55rem] top-1 h-3 w-3 rounded-full border-2 border-gold bg-background" />
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-body font-semibold text-gold">{event.date}</span>
                  <SentimentIcon sentiment={event.sentiment} />
                </div>
                <h4 className="font-body font-semibold text-sm mb-1">{event.title}</h4>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">{event.detail}</p>
              </motion.div>
            ))}
          </div>

          {/* Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Key Players */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-gold" />
                <h3 className="font-editorial text-sm font-semibold">Key Players</h3>
              </div>
              <ul className="space-y-2">
                {demoArc.players.map((p) => (
                  <li key={p} className="text-sm text-muted-foreground font-body">{p}</li>
                ))}
              </ul>
            </div>

            {/* Predictions */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-gold" />
                <h3 className="font-editorial text-sm font-semibold">Predictions</h3>
              </div>
              <ul className="space-y-3">
                {demoArc.predictions.map((p, i) => (
                  <li key={i} className="text-sm text-muted-foreground font-body leading-relaxed">{p}</li>
                ))}
              </ul>
            </div>

            {/* Silence Signals */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-gold" />
                <h3 className="font-editorial text-sm font-semibold">Silence Signals</h3>
              </div>
              <ul className="space-y-3">
                {demoArc.silence.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground font-body leading-relaxed">{s}</li>
                ))}
              </ul>
              <div className="mt-4 rounded-md bg-gold/5 border border-gold/20 p-3">
                <p className="text-xs font-body italic text-gold/80">
                  Contrarian view: {demoArc.contrarian}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default StoryArc;
