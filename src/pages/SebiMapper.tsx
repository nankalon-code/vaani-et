import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { FileText, AlertTriangle, Building2, TrendingDown, RefreshCw, Loader2, Calendar } from "lucide-react";
import { callEdgeFunction, getUserProfile } from "@/lib/vaaniApi";
import { useToast } from "@/hooks/use-toast";

const demoCircular = {
  title: "SEBI/HO/MRD/TPD-1/P/CIR/2026/42",
  date: "April 1, 2026",
  subject: "Framework for Algorithmic Trading by Retail Investors",
  summary: "SEBI mandates that all retail algorithmic trading strategies must be registered with stock exchanges. Brokers must maintain complete audit trails of algo orders. Unregistered algo strategies will be blocked from execution after June 30, 2026.",
  impactedSectors: [
    { name: "Discount Brokerages", impact: "HIGH", detail: "Zerodha, Groww, Angel One must overhaul algo infrastructure. Compliance costs estimated at Rs 50-100 crore per broker." },
    { name: "Algo Trading Platforms", impact: "HIGH", detail: "Smallcase, Streak, Tradetron face existential regulatory risk. Must register each strategy template." },
    { name: "Full-Service Brokers", impact: "MEDIUM", detail: "ICICI Direct, HDFC Securities already have compliance frameworks. Incremental cost lower." },
    { name: "Stock Exchanges", impact: "LOW", detail: "NSE and BSE need to build registration portals. Additional revenue from registration fees." },
  ],
  affectedStocks: [
    { ticker: "ANGELONE", name: "Angel One Ltd", change: "-4.2%", reason: "Heavy algo user base at risk of churn" },
    { ticker: "BSE", name: "BSE Ltd", change: "+1.8%", reason: "Registration fee revenue opportunity" },
    { ticker: "CDSL", name: "CDSL", change: "+0.6%", reason: "Increased depository activity from compliance" },
    { ticker: "MOTILALOFS", name: "Motilal Oswal", change: "-1.1%", reason: "Algo advisory services need restructuring" },
  ],
  keyDates: [],
  vernacularExplainer: "",
};

const impactColor = (impact: string) => {
  if (impact === "HIGH") return "text-red-400 bg-red-400/10 border-red-400/20";
  if (impact === "MEDIUM") return "text-amber-400 bg-amber-400/10 border-amber-400/20";
  return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
};

const SebiMapper = () => {
  const [circular, setCircular] = useState(demoCircular);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const fetchLatestCircular = async () => {
    setLoading(true);
    setError("");
    try {
      const profile = getUserProfile();
      const data = await callEdgeFunction("vaani-sebi", {
        language: profile.language,
        literacy: profile.literacy,
        city: profile.city,
      });
      const content = data.result;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setCircular(parsed);
        toast({ title: "Circular Loaded", description: `Analyzed: ${parsed.subject || parsed.title}` });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to fetch circular";
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestCircular();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-body font-semibold uppercase tracking-[0.3em] text-gold mb-2">SEBI Circular Mapper</p>
          <h1 className="font-editorial text-3xl md:text-4xl font-bold mb-2">Regulatory Impact Analysis</h1>
          <p className="text-muted-foreground font-body mb-8 max-w-xl">
            Auto-fetches the latest SEBI circulars and maps them to affected sectors and NSE-listed stocks in plain vernacular language.
          </p>
        </motion.div>

        <button
          onClick={fetchLatestCircular}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-body text-muted-foreground hover:border-gold/30 hover:text-gold transition-colors mb-8 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {loading ? "Analyzing..." : "Fetch Latest Circular"}
        </button>

        {error && (
          <div className="rounded-lg border border-red-400/30 bg-red-400/5 p-4 mb-6 text-sm font-body text-red-400">{error}</div>
        )}

        {loading && !circular.subject ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 text-gold animate-spin" />
            <p className="text-sm font-body text-muted-foreground">Analyzing latest SEBI circular...</p>
          </div>
        ) : (
          <>
            {/* Circular Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-lg border border-border bg-card p-6 mb-8"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-gold/10 shrink-0">
                  <FileText className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-editorial text-lg font-semibold">{circular.subject}</h2>
                  <p className="text-xs text-muted-foreground font-body mt-1">
                    {circular.title} -- {circular.date}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{circular.summary}</p>
              {circular.vernacularExplainer && (
                <div className="mt-4 rounded-md bg-gold/5 border border-gold/20 p-3">
                  <p className="text-[10px] font-body uppercase tracking-widest text-gold/60 mb-1">In Simple Terms</p>
                  <p className="text-sm font-body text-gold/90 italic">{circular.vernacularExplainer}</p>
                </div>
              )}
            </motion.div>

            {/* Key Dates */}
            {circular.keyDates && circular.keyDates.length > 0 && (
              <div className="mb-8">
                <h3 className="font-editorial text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gold" />
                  Key Dates
                </h3>
                <div className="flex flex-wrap gap-3">
                  {circular.keyDates.map((kd: { date: string; event: string }, i: number) => (
                    <div key={i} className="rounded-lg border border-border bg-card px-4 py-3">
                      <p className="text-xs font-body font-semibold text-gold">{kd.date}</p>
                      <p className="text-xs text-muted-foreground font-body mt-1">{kd.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impacted Sectors */}
            <h3 className="font-editorial text-xl font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gold" />
              Impacted Sectors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {circular.impactedSectors.map((sector: { name: string; impact: string; detail: string }, i: number) => (
                <motion.div
                  key={sector.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="rounded-lg border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-body font-semibold text-sm">{sector.name}</h4>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-body font-semibold ${impactColor(sector.impact)}`}>
                      {sector.impact}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body leading-relaxed">{sector.detail}</p>
                </motion.div>
              ))}
            </div>

            {/* Affected Stocks */}
            <h3 className="font-editorial text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-gold" />
              Affected NSE Stocks
            </h3>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="grid grid-cols-4 gap-4 px-5 py-3 border-b border-border text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Ticker</span>
                <span>Company</span>
                <span>Expected Move</span>
                <span>Rationale</span>
              </div>
              {circular.affectedStocks.map((stock: { ticker: string; name: string; change: string; reason: string }, i: number) => (
                <motion.div
                  key={stock.ticker}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + 0.05 * i }}
                  className="grid grid-cols-4 gap-4 px-5 py-4 border-b border-border last:border-0 items-center"
                >
                  <span className="font-body font-semibold text-sm text-gold">{stock.ticker}</span>
                  <span className="text-sm font-body text-foreground">{stock.name}</span>
                  <span className={`text-sm font-body font-semibold ${stock.change.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>
                    {stock.change}
                  </span>
                  <span className="text-xs text-muted-foreground font-body">{stock.reason}</span>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default SebiMapper;
