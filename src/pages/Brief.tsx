import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Search, MessageSquare, ChevronRight, BookOpen, BarChart3, Scale, Lightbulb, FileText } from "lucide-react";

const demoBriefing = {
  topic: "India EV Revolution 2026",
  sections: [
    {
      icon: BookOpen,
      title: "Executive Summary",
      content: "India's electric vehicle market crossed the 20 lakh annual sales milestone in FY26, growing 62% year-on-year. Two-wheelers dominate with 78% market share, while four-wheeler EVs remain nascent at 4.2% penetration. The FAME III subsidy scheme and state-level incentives continue to drive adoption, though charging infrastructure gaps persist outside metro cities."
    },
    {
      icon: BarChart3,
      title: "Key Data Points",
      content: "Total EV sales FY26: 20.3 lakh units. Two-wheeler market share: Ola Electric (28%), Ather (22%), TVS (22%). Four-wheeler leader: Tata Motors with 72% share. Charging stations nationwide: 12,400 (up from 6,800 in FY25). Average EV loan tenure: 4.2 years. Battery cost decline: 18% YoY."
    },
    {
      icon: Scale,
      title: "Policy Landscape",
      content: "FAME III allocated Rs 10,900 crore for FY26-28. Maharashtra, Karnataka, and Tamil Nadu offer additional state subsidies of Rs 10,000-25,000 per vehicle. PLI scheme for advanced chemistry cells has attracted Rs 45,000 crore in investment commitments. BIS standards for battery swapping finalized in January 2026."
    },
    {
      icon: Lightbulb,
      title: "What to Watch",
      content: "Ola Electric's IPO performance and its impact on sector valuations. Hyundai and Maruti entry into affordable EV segment (sub-Rs 10 lakh). Lithium refinery projects in Rajasthan and Gujarat. China's BYD potential India entry through CKD route. Hydrogen fuel cell vs battery EV debate intensifying in commercial vehicles."
    },
    {
      icon: FileText,
      title: "Contrarian Take",
      content: "Despite the momentum, some analysts argue India's EV transition is too subsidy-dependent and structurally fragile. Remove FAME III and adoption rates could halve overnight. The real test comes in 2028 when subsidies are scheduled to phase out. Battery recycling infrastructure is almost nonexistent, creating a future environmental liability."
    },
  ],
};

const Brief = () => {
  const [query, setQuery] = useState("");
  const [followUp, setFollowUp] = useState("");

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-body font-semibold uppercase tracking-[0.3em] text-gold mb-2">News Navigator</p>
          <h1 className="font-editorial text-3xl md:text-4xl font-bold mb-2">Deep Briefings</h1>
          <p className="text-muted-foreground font-body mb-8 max-w-xl">
            One structured, interactive briefing instead of 8 scattered articles. Ask follow-up questions within the document.
          </p>
        </motion.div>

        <div className="relative max-w-xl mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. India EV revolution, UPI international expansion, ONDC impact..."
            className="w-full rounded-lg border border-border bg-card pl-11 pr-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
        </div>

        {/* Demo Briefing */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="font-editorial text-2xl font-bold text-gold mb-1">{demoBriefing.topic}</h2>
          <p className="text-xs text-muted-foreground font-body mb-8">Interactive briefing -- 5 sections</p>

          <div className="space-y-4 mb-12">
            {demoBriefing.sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gold/10">
                    <section.icon className="h-4 w-4 text-gold" />
                  </div>
                  <h3 className="font-editorial text-base font-semibold">{section.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Follow-up */}
          <div className="rounded-lg border border-gold/20 bg-gold/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-gold" />
              <h3 className="font-editorial text-sm font-semibold">Ask a Follow-up</h3>
            </div>
            <div className="flex gap-3">
              <input
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder="e.g. How does this affect my Tata Motors shares?"
                className="flex-1 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none"
              />
              <button className="gold-gradient rounded-md px-5 py-2.5 text-sm font-body font-semibold text-primary-foreground flex items-center gap-1.5">
                Ask <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Impact on mutual funds?", "Compare with China EV market", "What about hydrogen fuel?"].map((q) => (
                <button
                  key={q}
                  onClick={() => setFollowUp(q)}
                  className="rounded-full border border-border px-3 py-1 text-xs font-body text-muted-foreground hover:border-gold/30 hover:text-gold transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Brief;
