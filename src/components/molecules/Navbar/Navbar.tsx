import React, { useEffect, useState } from "react";
import { useColors, gradients } from "../../../utils/theme";
import type { ProfileRequest } from "../../../utils/types";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about-me" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Achievements", href: "#achievements" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export interface NavbarProps {
  profile: ProfileRequest | null;
}

const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const colors = useColors();
  const g = gradients(colors);

  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#hero");

  /* -------------------------------- Scroll Shadow ------------------------------- */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* -------------------------- Active Section Detection -------------------------- */
  useEffect(() => {
    const sections = NAV_ITEMS.map(item =>
      document.querySelector(item.href)
    ).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div
        className="w-full max-w-6xl rounded-2xl p-[1px] transition-all"
        style={{
          backgroundImage: g.cardBorderGradient,
          boxShadow: isScrolled ? g.hoverGlowSoft : "none",
        }}
      >
        {/* Glass container */}
        <div
          className="flex items-center justify-between rounded-2xl px-6 py-3"
          style={{
            backgroundColor: `${colors.neutral900}CC`,
            backdropFilter: "blur(14px)",
          }}
        >
          {/* Brand */}
          <a
            href="#hero"
            className="group flex items-center gap-3"
            onClick={() => setActive("#hero")}
          >
            {profile?.logoUrl && (
              <img
                src={profile.logoUrl}
                alt="Profile Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <span
              className="text-sm font-semibold tracking-wide transition-colors"
              style={{ color: colors.neutral50 }}
            >
              {profile?.fullName || "Profile"}
            </span>
          </a>
          <ul className="hidden md:flex items-center gap-6 text-sm">
            {NAV_ITEMS.map(item => { const isActive = active === item.href;
              return (
                <li key={item.href} className="relative">
                  <a
                    href={item.href}
                    onClick={() => setActive(item.href)}
                    className="relative px-1 py-1 transition-colors"
                    style={{ color: isActive ? colors.accent400 : colors.neutral300 }}
                  >
                    {item.label}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full"
                      style={{ background: isActive ? g.dividerGradient : "transparent", opacity: isActive ? 1 : 0 }}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden text-lg"
            style={{ color: colors.neutral200 }}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div
            className="md:hidden mt-2 rounded-2xl p-4"
            style={{
              backgroundColor: `${colors.neutral900}EE`,
              backdropFilter: "blur(14px)",
              border: `1px solid ${colors.neutral800}`,
            }}
          >
            <ul className="flex flex-col gap-4 text-sm">
              {NAV_ITEMS.map(item => {
                const isActive = active === item.href;

                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => {
                        setActive(item.href);
                        setOpen(false);
                      }}
                      className="block rounded-lg px-3 py-2"
                      style={{
                        backgroundColor: isActive
                          ? `${colors.accent500}22`
                          : "transparent",
                        color: isActive
                          ? colors.accent400
                          : colors.neutral300,
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
