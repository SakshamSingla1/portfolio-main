import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, ArrowUpRight, Download } from "lucide-react";
import { useColors, gradients } from "../../../utils/theme";
import type { NavItem } from "../../../utils/types";
import { getOptimizedImageUrl } from "../../../utils/helper";
import { usePublicResumeService } from "../../../services/usePublicResumeService";

interface Props {
  items: NavItem[];
  profileName?: string;
  logoUrl?: string;
  userName?: string;
}

const Navbar = ({ items, profileName = "Portfolio", logoUrl, userName }: Props) => {
  const colors = useColors();
  const g = gradients(colors);
  const publicResumeService = usePublicResumeService();

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.section);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [items]);

  const scrollTo = (section: string) => {
    const el = document.getElementById(section);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleResume = () => {
    if (userName) {
      const url = publicResumeService.getDownloadResumeUrl(userName);
      window.open(url, "_blank");
    }
  };

  return (
    <motion.nav
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={
        scrolled
          ? {
              backgroundColor: `${colors.neutral900}E8`,
              // This is a fixed-position element live for essentially the
              // entire time a visitor scrolls past 50px, so the browser has
              // to re-sample and re-blur whatever scrolls underneath it on
              // every frame. A much smaller radius reads almost identically
              // as "frosted" at typical navbar heights but is far cheaper to
              // recompute continuously.
              backdropFilter: "blur(14px) saturate(150%)",
              WebkitBackdropFilter: "blur(14px) saturate(150%)",
              borderBottom: `1px solid ${colors.neutral700}35`,
              boxShadow: `0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 ${colors.neutral700}15`,
            }
          : undefined
      }
    >
      <motion.div
        style={{
          scaleX,
          transformOrigin: "0% 50%",
          height: 2,
          background: `linear-gradient(90deg, ${colors.primary500}, ${colors.accent500})`,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          boxShadow: `0 0 8px ${colors.primary500}60`,
        }}
      />

      <div className="max-w-350 xl:max-w-400 mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between h-16 lg:h-20 xl:h-24">

        <button
          className="font-display font-bold text-lg lg:text-xl xl:text-2xl cursor-pointer flex items-center gap-3 group"
          onClick={() => scrollTo("hero")}
          aria-label="Scroll to top"
        >
          {logoUrl && (
            <div className="relative">
              <img
                src={getOptimizedImageUrl(logoUrl, { width: 120, height: 120 })}
                alt="Logo"
                className="h-8 w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 rounded-full transition-transform duration-300 group-hover:scale-105"
                style={{ boxShadow: `0 0 16px ${colors.primary500}25` }}
              />
              <div
                className="absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `${colors.primary500}20`, filter: "blur(4px)" }}
              />
            </div>
          )}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary400}, ${colors.accent400})` }}
          >
            {profileName}
          </span>
        </button>

        <div
          className="hidden md:flex items-center gap-1 rounded-full px-3 py-2 lg:px-4 lg:py-2.5 relative"
          style={{
            // No backdrop-blur: this pill lives inside the fixed navbar, which
            // already repaints on every scroll frame — a second live-blurred
            // layer here just doubles that cost for an always-mounted element.
            backgroundColor: `${colors.neutral800}B3`,
            border: `1px solid ${colors.neutral700}28`,
          }}
        >
          <AnimatePresence>
            {hoveredItem && hoveredItem !== activeSection && (
              <motion.div
                key={hoveredItem}
                layoutId="navHover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-y-1.5 rounded-full pointer-events-none"
                style={{
                  backgroundColor: `${colors.neutral700}40`,
                }}
              />
            )}
          </AnimatePresence>

          {items.map((item) => (
            <button
              key={item.section}
              onClick={() => scrollTo(item.section)}
              onMouseEnter={() => setHoveredItem(item.section)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative text-sm lg:text-base px-4 py-2 lg:px-5 lg:py-2.5 rounded-full transition-colors duration-200"
              style={{
                color: activeSection === item.section ? colors.primary400 : colors.neutral400,
                fontWeight: activeSection === item.section ? 500 : undefined,
              }}
            >
              {activeSection === item.section && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: `${colors.primary500}18`,
                    border: `1px solid ${colors.primary500}28`,
                    boxShadow: `inset 0 0 12px ${colors.primary500}08`,
                  }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
              {activeSection === item.section && (
                <motion.div
                  layoutId="activeUnderline"
                  className="absolute bottom-1 left-4 right-4"
                  style={{
                    height: 1.5,
                    borderRadius: 99,
                    background: `linear-gradient(90deg, ${colors.primary500}, ${colors.accent500})`,
                    opacity: 0.7,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          <motion.button
            onClick={() => scrollTo("contact")}
            className="flex items-center gap-2 text-sm lg:text-base px-5 py-2.5 lg:px-6 lg:py-3 xl:px-7 xl:py-3.5 rounded-xl font-semibold text-white"
            style={{
              background: g.ctaGradient,
              boxShadow: `0 0 24px ${colors.primary500}35`,
            }}
            whileHover={{ scale: 1.05, boxShadow: `0 0 36px ${colors.primary500}55` }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Hire Me <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5" />
          </motion.button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 rounded-xl transition-colors duration-200"
          style={{
            color: colors.neutral200,
            background: mobileOpen ? `${colors.neutral700}50` : undefined,
            border: `1px solid ${mobileOpen ? colors.neutral600 + "50" : "transparent"}`,
          }}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              backgroundColor: `${colors.neutral900}F5`,
              backdropFilter: "blur(28px)",
              borderBottom: `1px solid ${colors.neutral700}30`,
            }}
          >
            <div className="px-5 py-4 space-y-1.5">
              {items.map((item, i) => (
                <motion.button
                  key={item.section}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  onClick={() => {
                    setMobileOpen(false);
                    setTimeout(() => scrollTo(item.section), 200);
                  }}
                  className="flex items-center justify-between w-full py-3 px-4 text-sm rounded-xl transition-all duration-200"
                  style={
                    activeSection === item.section
                      ? {
                          backgroundColor: `${colors.primary500}12`,
                          color: colors.primary400,
                          fontWeight: 500,
                          borderLeft: `2px solid ${colors.primary500}`,
                          paddingLeft: 14,
                        }
                      : { color: colors.neutral400 }
                  }
                >
                  {item.label}
                  {activeSection === item.section && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.primary500 }} />
                  )}
                </motion.button>
              ))}

              <div className="pt-2 space-y-2">
                {userName && (
                  <motion.button
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: items.length * 0.04 }}
                    onClick={() => { setMobileOpen(false); handleResume(); }}
                    className="flex items-center gap-2 w-full justify-center py-3 px-4 text-sm rounded-xl font-medium"
                    style={{
                      color: colors.neutral300,
                      border: `1px solid ${colors.neutral700}40`,
                      background: `${colors.neutral800}50`,
                    }}
                  >
                    <Download className="w-4 h-4" /> Download Resume
                  </motion.button>
                )}

                <motion.button
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (items.length + 1) * 0.04 }}
                  onClick={() => {
                    setMobileOpen(false);
                    setTimeout(() => scrollTo("contact"), 200);
                  }}
                  className="flex items-center gap-2 w-full justify-center py-3 px-4 text-sm rounded-xl font-semibold text-white"
                  style={{
                    background: g.ctaGradient,
                    boxShadow: `0 0 20px ${colors.primary500}35`,
                  }}
                >
                  Hire Me <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default React.memo(Navbar);
