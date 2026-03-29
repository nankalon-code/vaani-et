import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import { demoArticles, categories } from "@/data/demoArticles";
import { ArrowRight, Loader2, RefreshCw, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import { callEdgeFunction, getUserProfile } from "@/lib/vaaniApi";
import { useToast } from "@/hooks/use-toast";

const features = [
  {
    title: "My ET",
    desc: "Live articles culturally adapted per user in real time -- language, literacy, city all factored in.",
    link: "/",
    tag: "Feed",
  },
  {
    title: "News Navigator",
    desc: "One deep interactive briefing instead of 8 scattered articles. With in-document Q&A.",
    link: "/brief",
    tag: "Briefing",
  },
  {
    title: "Story Arc Tracker",
    desc: "Interactive timeline tracking sentiment shifts, key players, predictions, and silence signals.",
    link: "/arc",
    tag: "Timeline",
  },
  {
    title: "Cultural Engine",
    desc: "Silence Detector, SEBI Mapper, Voice-first scripts, paragraph-level Explain This.",
    link: "/silence",
    tag: "Intelligence",
  },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [articles, setArticles] = useState(demoArticles);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLiveNews = async (category?: string) => {
    setLoading(true);
    try {
      const profile = getUserProfile();
      const data = await callEdgeFunction("vaani-news", {
        category: category || "All",
        language: profile.language,
        literacy: profile.literacy,
        city: profile.city,
      });
      const content = data.result;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArticles(parsed);
          setIsLive(true);
          toast({ title: "Live Feed Active", description: `${parsed.length} articles loaded from AI newsroom.` });
        }
      }
    } catch (e) {
      console.error("Failed to fetch live news:", e);
      toast({
        title: "Feed Error",
        description: e instanceof Error ? e.message : "Could not fetch live news. Showing cached articles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNews();
  }, []);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (isLive) {
      fetchLiveNews(cat);
    }
  };

  const filtered = !isLive && activeCategory !== "All"
    ? articles.filter((a) => a.category === activeCategory)
    : articles;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(40_70%_55%_/_0.08),_transparent_50%)]" />
        <div className="container mx-auto px-6 py-20 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-xs font-body font-medium text-gold">ET Gen AI Hackathon 2026 -- Problem Statement #8</span>
            </div>
            <h1 className="font-editorial text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              India's Intelligent{" "}
              <span className="gold-text-gradient">Newsroom</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-body leading-relaxed max-w-2xl mb-4">
              ET spent 40 years building the best business journalism in India -- for 5 crore English readers. Vaani gives the other 135 crore access to it -- in their language, at their literacy level, with their local market context.
            </p>
            <p className="font-editorial text-xl italic text-gold/90 mb-10">
              Not translation. Understanding.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/onboard"
                className="gold-gradient px-6 py-3 rounded-lg text-sm font-body font-semibold text-primary-foreground transition-transform hover:scale-[1.02] inline-flex items-center gap-2"
              >
                Launch Your Vaani <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/arc"
                className="border border-gold/30 px-6 py-3 rounded-lg text-sm font-body font-medium text-gold hover:bg-gold/5 transition-colors"
              >
                See Story Arc Demo
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-6"
          >
            {[
              { label: "Languages", value: "12+" },
              { label: "Literacy Levels", value: "4" },
              { label: "Cities", value: "50+" },
              { label: "API Endpoints", value: "12" },
              { label: "Revenue Uplift", value: "Rs 600Cr" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="text-center md:text-left"
              >
                <p className="font-editorial text-2xl md:text-3xl font-bold text-gold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-body mt-1 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Pillars */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-body font-semibold uppercase tracking-[0.3em] text-gold mb-2">Product Pillars</p>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold mb-8">Four Pillars. One Mission.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {features.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={pillar.link}
                className="block h-full rounded-lg border border-border bg-card p-6 hover:border-gold/30 hover:glow-gold transition-all group"
              >
                <span className="inline-block text-[10px] font-body font-semibold uppercase tracking-widest text-gold/60 bg-gold/5 px-2 py-0.5 rounded mb-3">
                  {pillar.tag}
                </span>
                <h3 className="font-editorial text-lg font-semibold mb-2 group-hover:text-gold transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{pillar.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-body text-gold/60 group-hover:text-gold transition-colors">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Category filter + Live badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-editorial text-2xl font-bold">Live Feed</h2>
            {isLive && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-body font-semibold text-emerald-400 uppercase tracking-wider">
                <Wifi className="h-3 w-3" />
                Live
              </span>
            )}
            <button
              onClick={() => fetchLiveNews(activeCategory)}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-body text-muted-foreground hover:border-gold/30 hover:text-gold transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Refresh
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-body font-medium transition-all ${
                  activeCategory === cat
                    ? "gold-gradient text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground hover:border-gold/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 text-gold animate-spin" />
            <p className="text-sm font-body text-muted-foreground">Fetching latest news from AI newsroom...</p>
          </div>
        )}

        {/* Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((article, i) => (
            <ArticleCard key={`${article.title}-${i}`} {...article} index={i} />
          ))}
        </div>

        {/* What India Thinks */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 via-transparent to-transparent p-8"
        >
          <p className="text-xs font-body font-semibold uppercase tracking-[0.3em] text-gold mb-2">Unique to Vaani</p>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold mb-4">What Makes This Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[
              {
                title: "Silence as Intelligence",
                desc: "We track what journalism stopped covering. When a story goes silent, that silence itself becomes a signal -- unresolved litigation, missing regulatory reports, abandoned investigations.",
              },
              {
                title: "Cultural, Not Translated",
                desc: "\"Repo rate hike\" becomes \"RBI ne loan mahenga kar diya -- aapki EMI badhegi\" for a Hindi reader in Patna. Same fact, entirely different understanding.",
              },
              {
                title: "Contrarian Surfacing",
                desc: "Every story arc automatically identifies and presents the minority view. Fights echo chambers algorithmically. The view nobody wants to hear, served with data.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="font-editorial text-base font-semibold text-gold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </section>
    </Layout>
  );
};

export default Index;
