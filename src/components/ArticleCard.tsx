import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Mic, Lightbulb, Clock, ArrowUpRight, X, Loader2 } from "lucide-react";
import { streamFromEdgeFunction, getUserProfile } from "@/lib/vaaniApi";

interface ArticleCardProps {
  title: string;
  summary: string;
  category: string;
  time: string;
  source: string;
  index: number;
}

type ActionType = "adapt" | "explain" | "voice" | null;

const ArticleCard = ({ title, summary, category, time, source, index }: ArticleCardProps) => {
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = (action: ActionType) => {
    if (loading) return;
    if (activeAction === action) {
      setActiveAction(null);
      setResult("");
      return;
    }

    setActiveAction(action);
    setResult("");
    setLoading(true);

    const profile = getUserProfile();

    streamFromEdgeFunction({
      functionName: "vaani-adapt",
      body: {
        article: { title, summary },
        language: profile.language,
        literacy: profile.literacy,
        city: profile.city,
        action,
      },
      onDelta: (text) => setResult((prev) => prev + text),
      onDone: () => setLoading(false),
      onError: (err) => {
        setResult(`Error: ${err}`);
        setLoading(false);
      },
    });
  };

  const actionLabels: Record<string, { icon: typeof Globe; label: string; activeLabel: string }> = {
    adapt: { icon: Globe, label: "Adapt", activeLabel: "Culturally Adapted" },
    explain: { icon: Lightbulb, label: "Explain", activeLabel: "Simplified" },
    voice: { icon: Mic, label: "Voice", activeLabel: "Voice Script" },
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group border border-border rounded-lg bg-card overflow-hidden transition-all hover:border-gold/30 hover:glow-gold"
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-body font-semibold uppercase tracking-widest text-gold">
            {category}
          </span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
            <Clock className="h-3 w-3" />
            {time}
          </span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span className="text-xs text-muted-foreground font-body">{source}</span>
        </div>

        <h3 className="font-editorial text-lg font-semibold leading-tight mb-3 group-hover:text-gold transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
          {summary}
        </p>

        {/* Reading Level Indicator */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">Complexity</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-1.5 w-3 rounded-full ${
                    level <= 4 ? "bg-gold/60" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          {activeAction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5"
            >
              <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">After</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 w-3 rounded-full ${
                      level <= 2 ? "bg-emerald-400/60" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(["adapt", "explain", "voice"] as ActionType[]).map((action) => {
            if (!action) return null;
            const { icon: Icon, label } = actionLabels[action];
            const isActive = activeAction === action;
            return (
              <button
                key={action}
                onClick={() => handleAction(action)}
                disabled={loading && activeAction !== action}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-body font-medium transition-all ${
                  isActive
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border text-muted-foreground hover:border-gold/50 hover:text-gold disabled:opacity-40"
                }`}
              >
                {loading && isActive ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
                {label}
              </button>
            );
          })}
          <div className="flex-1" />
          <button className="flex items-center justify-center rounded-md border border-border p-1.5 text-muted-foreground transition-all hover:border-gold/50 hover:text-gold">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* AI Result Panel */}
      <AnimatePresence>
        {activeAction && result && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-5 bg-gold/[0.03]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-body font-semibold uppercase tracking-widest text-gold">
                  {actionLabels[activeAction]?.activeLabel}
                </span>
                <button
                  onClick={() => {
                    setActiveAction(null);
                    setResult("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-sm font-body leading-relaxed whitespace-pre-wrap">
                {result}
                {loading && <span className="inline-block w-1.5 h-4 bg-gold/60 ml-0.5 animate-pulse" />}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default ArticleCard;
