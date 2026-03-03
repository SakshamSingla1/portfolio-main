import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useColors, gradients } from "../../../utils/theme";
import type { ProfileRequest } from "../../../utils/types";

export interface NavItem {
  label: string;
  section: string;
}

export interface NavbarProps {
  profile: ProfileRequest | null;
  navItems: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ profile, navItems }) => {
  const colors = useColors();
  const g = gradients(colors);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get("section") ?? "hero";

  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const navigateToSection = (section: string) => {
    setSearchParams({ section });
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map(item => document.getElementById(item.section))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setSearchParams({ section: entry.target.id }, { replace: true });
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [navItems, setSearchParams]);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div
        className="w-full max-w-7xl rounded-3xl p-px transition-all"
        style={{
          backgroundImage: g.cardBorderGradient,
          boxShadow: isScrolled ? g.hoverGlowSoft : "none",
        }}
      >
        <div className="flex items-center justify-between rounded-3xl px-8 py-6" style={{ backgroundColor: `${colors.neutral900}CC`, backdropFilter: "blur(14px)"}}>
          <button onClick={() => navigateToSection("hero")} className="group flex items-center gap-3">
            {profile?.logoUrl && (
              <img src={profile.logoUrl} alt="Profile Logo" className="h-10 w-10 rounded-full object-cover"/>
            )}
            <span className="text-base font-semibold tracking-wide" style={{ color: colors.neutral50 }}>{profile?.fullName || "Profile"}</span>
          </button>

          <ul className="hidden md:flex items-center gap-6 text-base">
            {navItems.map(item => {
              const isActive = activeSection === item.section;
              return (
                <li key={item.section} className="relative">
                  <button onClick={() => navigateToSection(item.section)} className="relative px-1 py-1 transition-colors" style={{ color: isActive ? colors.accent400 : colors.neutral300 }}>
                    {item.label}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full" style={{ background: isActive ? g.dividerGradient : "transparent", opacity: isActive ? 1 : 0 }} />
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden text-xl"
            style={{ color: colors.neutral200 }}
          >
            ☰
          </button>
        </div>

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
              {navItems.map(item => {
                const isActive = activeSection === item.section;
                return (
                  <li key={item.section}>
                    <button
                      onClick={() => {
                        navigateToSection(item.section);
                        setOpen(false);
                      }}
                      className="block w-full text-left rounded-lg px-3 py-2"
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
                    </button>
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
