import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useColors, gradients } from "../../../utils/theme";
import type { NavItem } from "../../../utils/types";

interface Props {
  items: NavItem[];
  profileName?: string;
}

const Navbar = ({ items, profileName = "Portfolio" }: Props) => {
  const colors = useColors();
  const g = gradients(colors);

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      for (const item of [...items].reverse()) {
        const el = document.getElementById(item.section);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(item.section);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  const scrollTo = (section: string) => {
    const el = document.getElementById(section);
    if (!el) return;

    const yOffset = -80;
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={
        scrolled
          ? {
              backgroundColor: `${colors.neutral900}CC`,
              backdropFilter: "blur(20px)",
              borderBottom: `1px solid ${colors.neutral700}33`,
            }
          : undefined
      }
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        <span
          className="font-display font-bold text-lg cursor-pointer bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(135deg, ${colors.primary400}, ${colors.accent400})`,
          }}
          onClick={() => scrollTo("hero")}
        >
          {profileName.split(" ")[0]}.
        </span>

        <div
          className="hidden md:flex items-center gap-1 rounded-full px-2 py-1"
          style={{
            backgroundColor: `${colors.neutral800}60`,
            border: `1px solid ${colors.neutral700}33`,
          }}
        >
          {items.map((item) => (
            <button
              key={item.section}
              onClick={() => scrollTo(item.section)}
              className="relative text-xs px-3 py-1.5 rounded-full transition-all"
              style={{
                color:
                  activeSection === item.section
                    ? colors.primary400
                    : colors.neutral500,
              }}
            >
              {activeSection === item.section && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: `${colors.primary500}1A`,
                    border: `1px solid ${colors.primary500}26`,
                  }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTo("contact")}
          className="hidden md:flex items-center gap-1 text-xs px-4 py-2 rounded-xl font-semibold text-white"
          style={{ background: g.ctaGradient }}
        >
          Hire Me <ArrowUpRight className="w-3 h-3" />
        </button>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg"
          style={{ color: colors.neutral200 }}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden absolute top-16 left-0 right-0 z-40"
            style={{
              backgroundColor: `${colors.neutral900}F2`,
              backdropFilter: "blur(20px)",
              borderBottom: `1px solid ${colors.neutral700}33`,
            }}
          >
            <div className="px-4 py-4 space-y-2">
              {items.map((item, i) => (
                <motion.button
                  key={item.section}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setMobileOpen(false);
                    setTimeout(() => scrollTo(item.section), 200);
                  }}
                  className="block w-full text-left py-2.5 px-3 text-sm rounded-xl"
                  style={
                    activeSection === item.section
                      ? {
                          backgroundColor: `${colors.primary500}1A`,
                          color: colors.primary400,
                          fontWeight: 500,
                        }
                      : { color: colors.neutral500 }
                  }
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default React.memo(Navbar);