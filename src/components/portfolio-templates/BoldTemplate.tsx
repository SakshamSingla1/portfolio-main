import { Suspense, lazy } from "react";
import { useColors } from "../../utils/theme";
import Navbar from "../molecules/Navbar/Navbar";
import BoldHero from "../templates/hero/BoldHero";
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

/** "Bold" shell: editorial split-screen hero plus a punchy, high-contrast
 * alternating section treatment — same shared section components as
 * Classic/Modern/Minimal (only the wrapper/spacing/backgrounds and Hero
 * differ). Where Modern washes alternating bands with a subtle
 * `${colors.neutral800}60` tint, Bold alternates full-strength solid
 * accent/primary poster panels against the page's base dark neutral, so
 * sections read as distinct printed panels rather than a soft gradient. */
const BoldTemplate = ({
  profile, data, navItems, visibleSections, displayExperience, totalProjects,
  activeSocialLinks, activeTestimonials, activeAchievements, activeCertifications,
}: PortfolioTemplateProps) => {
  const colors = useColors();
  let bandIndex = 0;
  const nextBand = () => {
    const band = bandIndex % 2 === 0 ? colors.neutral900 : `${colors.primary900}E6`;
    bandIndex += 1;
    return band;
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: colors.neutral900, color: colors.neutral100 }}>
      <ErrorBoundary fallback={null} key="navbar">
        <Navbar items={navItems || []} profileName={profile.fullName || ""} logoUrl={profile.logoUrl} userName={profile.userName} />
      </ErrorBoundary>

      <ErrorBoundary fallback={null} key="hero">
        <BoldHero profile={profile} socialLinks={activeSocialLinks} />
      </ErrorBoundary>

      <main>
        <Suspense fallback={null}>
          {visibleSections.about && (
            <ErrorBoundary fallback={null} key="about">
              <div className="mb-15" style={{ background: nextBand() }}>
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
                <ServicesSection services={data.services} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.skills && (
            <ErrorBoundary fallback={null} key="skills">
              <div className="mb-15" style={{ background: nextBand() }}>
                <SkillsSection skills={data.skills} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.experience && (
            <ErrorBoundary fallback={null} key="experience">
              <div className="mb-15" style={{ background: nextBand() }}>
                <ExperienceSection experiences={data.experiences} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.projects && (
            <ErrorBoundary fallback={null} key="projects">
              <div className="mb-15" style={{ background: nextBand() }}>
                <ProjectsSection projects={data.projects} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.achievements && (
            <ErrorBoundary fallback={null} key="achievements">
              <div className="mb-15" style={{ background: nextBand() }}>
                <AchievementsSection achievements={activeAchievements} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.certifications && (
            <ErrorBoundary fallback={null} key="certifications">
              <div className="mb-15" style={{ background: nextBand() }}>
                <CertificationsSection certifications={activeCertifications} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.education && (
            <ErrorBoundary fallback={null} key="education">
              <div className="mb-15" style={{ background: nextBand() }}>
                <EducationSection educations={data.educations} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.testimonials && (
            <ErrorBoundary fallback={null} key="testimonials">
              <div className="mb-15" style={{ background: nextBand() }}>
                <TestimonialsSection testimonials={activeTestimonials} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.languages && (
            <ErrorBoundary fallback={null} key="languages">
              <div className="mb-15" style={{ background: nextBand() }}>
                <LanguagesSection languages={data.languages} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.publications && (
            <ErrorBoundary fallback={null} key="publications">
              <div className="mb-15" style={{ background: nextBand() }}>
                <PublicationsSection publications={data.publications} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.github && data.githubStats && (
            <ErrorBoundary fallback={null} key="open-source">
              <div className="mb-15" style={{ background: nextBand() }}>
                <GitHubSection githubStats={data.githubStats} githubRepos={data.githubRepos ?? []} />
              </div>
            </ErrorBoundary>
          )}

          <ErrorBoundary fallback={null} key="contact">
            <div className="mb-16" style={{ background: nextBand() }}>
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

export default BoldTemplate;
