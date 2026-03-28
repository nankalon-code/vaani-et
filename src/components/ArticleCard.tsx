import { motion } from "framer-motion";
import { Globe, Mic, Lightbulb, Clock, ArrowUpRight } from "lucide-react";

interface ArticleCardProps {
  title: string;
  summary: string;
  category: string;
  time: string;
  source: string;
  index: number;
}

const ArticleCard = ({ title, summary, category, time, source, index }: ArticleCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group border border-border rounded-lg bg-card p-6 transition-all hover:border-gold/30 hover:glow-gold"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-body font-semibold uppercase tracking-widest text-gold">
          {category}
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
          <Clock className="h-3 w-3" />
          {time}
        </span>
      </div>

      <h3 className="font-editorial text-lg font-semibold leading-tight mb-2 group-hover:text-gold transition-colors">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
        {summary}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-body">{source}</span>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-body font-medium text-muted-foreground transition-all hover:border-gold/50 hover:text-gold">
            <Globe className="h-3.5 w-3.5" />
            Adapt
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-body font-medium text-muted-foreground transition-all hover:border-gold/50 hover:text-gold">
            <Lightbulb className="h-3.5 w-3.5" />
            Explain
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-body font-medium text-muted-foreground transition-all hover:border-gold/50 hover:text-gold">
            <Mic className="h-3.5 w-3.5" />
            Voice
          </button>
          <button className="flex items-center justify-center rounded-md border border-border p-1.5 text-muted-foreground transition-all hover:border-gold/50 hover:text-gold">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ArticleCard;
