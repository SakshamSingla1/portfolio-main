import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useColors, gradients } from "../../../utils/theme";
import type { NavItem } from "../../../utils/types";

interface Props {
  items: NavItem[];
  profileName?: string;
  logoUrl?: string;
}

const Navbar = ({ items, profileName = "Portfolio", logoUrl }: Props) => {
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

    const yOffset = -100;
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={
        scrolled
          ? {
              backgroundColor: `${colors.neutral900}CC`,
              backdropFilter: "blur(24px)",
              borderBottom: `1px solid ${colors.neutral700}33`,
            }
          : undefined
      }
    >
      <div className="max-w-350 xl:max-w-400 mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between h-16 lg:h-20 xl:h-24">
        <button
          className="font-display font-bold text-lg lg:text-xl xl:text-2xl cursor-pointer bg-clip-text text-transparent flex items-center gap-3"
          style={{
            backgroundImage: `linear-gradient(135deg, ${colors.primary400}, ${colors.accent400})`,
          }}
          onClick={() => scrollTo("hero")}
          aria-label="Scroll to top"
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-8 w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 rounded-full"
            />
          )}
          {profileName}
        </button>

        <div
          className="hidden md:flex items-center gap-2 rounded-full px-3 py-2 lg:px-4 lg:py-2.5"
          style={{
            backgroundColor: `${colors.neutral800}60`,
            border: `1px solid ${colors.neutral700}33`,
          }}
        >
          {items.map((item) => (
            <button
              key={item.section}
              onClick={() => scrollTo(item.section)}
              className="relative text-sm lg:text-base px-4 py-2 lg:px-5 lg:py-2.5 rounded-full transition-all"
              style={{
                color:
                  activeSection === item.section
                    ? colors.primary400
                    : colors.neutral400,
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
          className="hidden md:flex items-center gap-2 text-sm lg:text-base px-5 py-2.5 lg:px-6 lg:py-3 xl:px-7 xl:py-3.5 rounded-xl font-semibold text-white shadow-lg"
          style={{ background: g.ctaGradient }}
        >
          Hire Me <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 rounded-lg"
          style={{ color: colors.neutral200 }}
          aria-label={mobileOpen ? "Close mobile menu" : "Open mobile menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-16 left-0 right-0 z-40"
            style={{
              backgroundColor: `${colors.neutral900}F2`,
              backdropFilter: "blur(24px)",
              borderBottom: `1px solid ${colors.neutral700}33`,
            }}
          >
            <div className="px-5 py-5 space-y-3">
              {items.map((item, i) => (
                <motion.button
                  key={item.section}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setMobileOpen(false);
                    setTimeout(() => scrollTo(item.section), 200);
                  }}
                  className="block w-full text-left py-3 px-4 text-base rounded-xl"
                  style={
                    activeSection === item.section
                      ? {
                          backgroundColor: `${colors.primary500}1A`,
                          color: colors.primary400,
                          fontWeight: 500,
                        }
                      : { color: colors.neutral400 }
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