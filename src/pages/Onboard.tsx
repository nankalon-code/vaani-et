import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check } from "lucide-react";

const steps = [
  {
    title: "Your Language",
    subtitle: "Which language feels like home?",
    options: ["Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi", "Odia", "Urdu", "English"],
  },
  {
    title: "Reading Comfort",
    subtitle: "How comfortable are you with business terms?",
    options: ["Beginner -- explain everything simply", "Intermediate -- I know the basics", "Advanced -- give me the full picture", "Expert -- data and jargon are fine"],
  },
  {
    title: "Your City",
    subtitle: "Where are you based? We add local market context.",
    options: ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat", "Patna", "Lucknow"],
  },
  {
    title: "Your Interests",
    subtitle: "What matters most to you?",
    options: ["Stock Markets", "Real Estate", "Startups & Tech", "Banking & Loans", "Government Policy", "Agriculture", "Crypto & Digital Assets", "Small Business"],
  },
];

const Onboard = () => {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, string[]>>({});
  const navigate = useNavigate();
  const current = steps[step];

  const toggleOption = (option: string) => {
    const prev = selections[step] || [];
    if (step === 3) {
      // Multi-select for interests
      setSelections({
        ...selections,
        [step]: prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option],
      });
    } else {
      setSelections({ ...selections, [step]: [option] });
    }
  };

  const canProceed = (selections[step]?.length || 0) > 0;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("vaani_profile", JSON.stringify(selections));
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-12">
          {steps.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-secondary">
              <motion.div
                className="h-full gold-gradient"
                initial={{ width: "0%" }}
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-xs font-body font-semibold uppercase tracking-[0.3em] text-gold mb-2">
              Step {step + 1} of {steps.length}
            </p>
            <h1 className="font-editorial text-3xl md:text-4xl font-bold mb-2">{current.title}</h1>
            <p className="text-muted-foreground font-body mb-8">{current.subtitle}</p>

            <div className="grid grid-cols-2 gap-3">
              {current.options.map((option) => {
                const selected = selections[step]?.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={`relative rounded-lg border p-4 text-left text-sm font-body font-medium transition-all ${
                      selected
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-muted-foreground hover:border-gold/30 hover:text-foreground"
                    }`}
                  >
                    {option}
                    {selected && (
                      <Check className="absolute top-3 right-3 h-4 w-4 text-gold" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.button
          onClick={handleNext}
          disabled={!canProceed}
          className={`mt-10 w-full flex items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-body font-semibold transition-all ${
            canProceed
              ? "gold-gradient text-primary-foreground hover:scale-[1.02]"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
          whileTap={canProceed ? { scale: 0.98 } : {}}
        >
          {step < steps.length - 1 ? "Continue" : "Launch My Vaani"}
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default Onboard;
