import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { FileText, AlertTriangle, Building2, TrendingDown, RefreshCw } from "lucide-react";

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
};

const impactColor = (impact: string) => {
  if (impact === "HIGH") return "text-red-400 bg-red-400/10 border-red-400/20";
  if (impact === "MEDIUM") return "text-amber-400 bg-amber-400/10 border-amber-400/20";
  return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
};

const SebiMapper = () => {
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

        <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-body text-muted-foreground hover:border-gold/30 hover:text-gold transition-colors mb-8">
          <RefreshCw className="h-4 w-4" />
          Fetch Latest Circular
        </button>

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
              <h2 className="font-editorial text-lg font-semibold">{demoCircular.subject}</h2>
              <p className="text-xs text-muted-foreground font-body mt-1">
                {demoCircular.title} -- {demoCircular.date}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">{demoCircular.summary}</p>
        </motion.div>

        {/* Impacted Sectors */}
        <h3 className="font-editorial text-xl font-semibold mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-gold" />
          Impacted Sectors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {demoCircular.impactedSectors.map((sector, i) => (
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
          {demoCircular.affectedStocks.map((stock, i) => (
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
      </div>
    </Layout>
  );
};

export default SebiMapper;
