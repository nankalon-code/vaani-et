import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import { demoArticles, categories } from "@/data/demoArticles";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? demoArticles
    : demoArticles.filter((a) => a.category === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
        <div className="container mx-auto px-6 py-20 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-body font-semibold uppercase tracking-[0.3em] text-gold mb-4">
              AI-Native News Experience
            </p>
            <h1 className="font-editorial text-4xl md:text-6xl font-bold leading-[1.1] mb-6">
              India's Intelligent{" "}
              <span className="gold-text-gradient">Newsroom</span>
            </h1>
            <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-2xl mb-8">
              ET spent 40 years building the best business journalism in India -- for 5 crore English readers. Vaani gives the other 135 crore access to it -- in their language, at their literacy level, with their local market context.
            </p>
            <p className="font-editorial text-lg italic text-gold/80">
              Not translation. Understanding.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: "Languages Supported", value: "12+" },
              { label: "Literacy Levels", value: "4" },
              { label: "Cities with Context", value: "50+" },
              { label: "API Endpoints", value: "12" },
            ].map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <p className="font-editorial text-3xl font-bold text-gold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-body mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { title: "My ET", desc: "Live articles culturally adapted per user in real time." },
            { title: "News Navigator", desc: "One deep interactive briefing instead of 8 scattered articles." },
            { title: "Story Arc", desc: "Interactive timeline tracking sentiment, players, and predictions." },
            { title: "Cultural Engine", desc: "Silence Detector, SEBI Mapper, Voice-first, Explain This." },
          ].map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg border border-border bg-card p-6 hover:border-gold/30 transition-colors"
            >
              <h3 className="font-editorial text-lg font-semibold text-gold mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{pillar.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Category filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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

        {/* Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((article, i) => (
            <ArticleCard key={article.title} {...article} index={i} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
