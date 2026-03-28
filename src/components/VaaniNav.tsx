import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", label: "My ET" },
  { path: "/arc", label: "Story Arc" },
  { path: "/brief", label: "Navigator" },
  { path: "/sebi", label: "SEBI Mapper" },
  { path: "/silence", label: "Silence Detector" },
];

const VaaniNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface-overlay/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-editorial text-2xl font-bold gold-text-gradient">VAANI</span>
          <span className="hidden text-xs font-body text-muted-foreground tracking-widest uppercase sm:inline">
            India's Intelligent Newsroom
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative px-3 py-2 text-sm font-body font-medium transition-colors"
            >
              <span className={pathname === item.path ? "text-gold" : "text-muted-foreground hover:text-foreground"}>
                {item.label}
              </span>
              {pathname === item.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1 right-1 h-0.5 bg-gold rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </Link>
          ))}
        </div>

        <Link
          to="/onboard"
          className="gold-gradient px-4 py-2 rounded-md text-sm font-body font-semibold text-primary-foreground transition-transform hover:scale-105"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile nav */}
      <div className="flex items-center gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-body font-medium transition-colors ${
              pathname === item.path
                ? "bg-gold text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default VaaniNav;
