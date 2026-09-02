import { Suspense, lazy, type ReactNode } from "react";
import { useColors } from "../../utils/theme";
import Navbar from "../molecules/Navbar/Navbar";
import TerminalHero from "../templates/hero/TerminalHero";
import Footer from "../molecules/Footer/Footer";
import ScrollToTop from "../molecules/ScrollToTop/ScrollToTop";
import { ErrorBoundary } from "../atoms/ErrorBoundary/ErrorBoundary";
import type { PortfolioTemplateProps } from "./types";

const AboutSection = lazy(() => import("../templates/AboutSection"));
const SkillsSection = lazy(() => import("../templates/SkillSection"));
const ExperienceSection = lazy(() => import("../templates/ExperienceSection"));
const ProjectsSection = lazy(() => import("../templates/ProjectSection"));
const AchievementsSection = lazy(() => import("../templates/AchievementSection"));
const CertificationsSection = lazy(() => import("../templates/CertificationSection"));
const EducationSection = lazy(() => import("../templates/EducationSection"));
const TestimonialsSection = lazy(() => import("../templates/TestimonialSection"));
const ContactSection = lazy(() => import("../templates/ContactSection"));
const GitHubSection = lazy(() => import("../templates/GitHubSection"));
const LanguagesSection = lazy(() => import("../templates/LanguagesSection"));
const ServicesSection = lazy(() => import("../templates/ServicesSection"));
const PublicationsSection = lazy(() => import("../templates/PublicationsSection"));

/** A code-comment style label rendered above each section — e.g. `// Experience` —
 * in addition to (not replacing) the heading the section itself renders. */
const CodeComment = ({ children, colors }: { children: ReactNode; colors: ReturnType<typeof useColors> }) => (
  <div className="section-container pt-10">
    <span className="font-mono text-xs sm:text-sm select-none" style={{ color: `${colors.neutral500}90` }}>
      {children}
    </span>
  </div>
);

/** "Terminal" shell: a developer/IDE-themed template — same shared section
 * components and order as Classic/Modern/Minimal (only the wrapper/hero
 * differ), with a code-comment style label above each section and a subtle
 * static dot-grid/scanline texture over the whole page for a CRT/terminal feel. */
const TerminalTemplate = ({
  profile, data, navItems, visibleSections, displayExperience, totalProjects,
  activeSocialLinks, activeTestimonials, activeAchievements, activeCertifications,
}: PortfolioTemplateProps) => {
  const colors = useColors();
  let bandIndex = 0;
  const nextBand = () => {
    const band = bandIndex % 2 === 0 ? "transparent" : `${colors.neutral800}40`;
    bandIndex += 1;
    return band;
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: colors.neutral900,
        color: colors.neutral100,
        backgroundImage:
          `repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px),` +
          `radial-gradient(${colors.neutral700}30 1px, transparent 1px)`,
        backgroundSize: "auto, 22px 22px",
      }}
    >
      <ErrorBoundary fallback={null} key="navbar">
        <Navbar items={navItems || []} profileName={profile.fullName || ""} logoUrl={profile.logoUrl} userName={profile.userName} />
      </ErrorBoundary>

      <ErrorBoundary fallback={null} key="hero">
        <TerminalHero profile={profile} socialLinks={activeSocialLinks} skills={data.skills} />
      </ErrorBoundary>

      <main>
        <Suspense fallback={null}>
          {visibleSections.about && (
            <ErrorBoundary fallback={null} key="about">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CodeComment colors={colors}>{"// About"}</CodeComment>
                <AboutSection
                  profile={profile}
                  totalExp={{ value: displayExperience, label: displayExperience === "Fresher" ? "" : "Years of Experience" }}
                  totalProjects={{ value: `${totalProjects}+`, label: "Projects Shipped" }}
                />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.services && (
            <ErrorBoundary fallback={null} key="services">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CodeComment colors={colors}>{"// Services"}</CodeComment>
                <ServicesSection services={data.services} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.skills && (
            <ErrorBoundary fallback={null} key="skills">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CodeComment colors={colors}>{"/* Skills */"}</CodeComment>
                <SkillsSection skills={data.skills} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.experience && (
            <ErrorBoundary fallback={null} key="experience">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CodeComment colors={colors}>{"// Experience"}</CodeComment>
                <ExperienceSection experiences={data.experiences} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.projects && (
            <ErrorBoundary fallback={null} key="projects">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CodeComment colors={colors}>{"/* Projects */"}</CodeComment>
                <ProjectsSection projects={data.projects} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.achievements && (
            <ErrorBoundary fallback={null} key="achievements">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CodeComment colors={colors}>{"// Achievements"}</CodeComment>
                <AchievementsSection achievements={activeAchievements} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.certifications && (
            <ErrorBoundary fallback={null} key="certifications">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CodeComment colors={colors}>{"/* Certifications */"}</CodeComment>
                <CertificationsSection certifications={activeCertifications} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.education && (
            <ErrorBoundary fallback={null} key="education">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CodeComment colors={colors}>{"// Education"}</CodeComment>
                <EducationSection educations={data.educations} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.testimonials && (
            <ErrorBoundary fallback={null} key="testimonials">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CodeComment colors={colors}>{"/* Testimonials */"}</CodeComment>
                <TestimonialsSection testimonials={activeTestimonials} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.languages && (
            <ErrorBoundary fallback={null} key="languages">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CodeComment colors={colors}>{"// Languages"}</CodeComment>
                <LanguagesSection languages={data.languages} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.publications && (
            <ErrorBoundary fallback={null} key="publications">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CodeComment colors={colors}>{"/* Publications */"}</CodeComment>
                <PublicationsSection publications={data.publications} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.github && data.githubStats && (
            <ErrorBoundary fallback={null} key="open-source">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CodeComment colors={colors}>{"// Open Source"}</CodeComment>
                <GitHubSection githubStats={data.githubStats} githubRepos={data.githubRepos ?? []} />
              </div>
            </ErrorBoundary>
          )}

          <ErrorBoundary fallback={null} key="contact">
            <div className="mb-16" style={{ background: nextBand() }}>
              <CodeComment colors={colors}>{"/* Contact */"}</CodeComment>
              <ContactSection profile={profile} />
            </div>
          </ErrorBoundary>
        </Suspense>
      </main>

      <ErrorBoundary fallback={null} key="footer">
        <Footer profile={profile} socialLinks={activeSocialLinks} />
      </ErrorBoundary>

      <ScrollToTop />
    </div>
  );
};

export default TerminalTemplate;
