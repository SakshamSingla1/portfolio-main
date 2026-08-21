import { Suspense, lazy } from "react";
import { useColors } from "../../utils/theme";
import Navbar from "../molecules/Navbar/Navbar";
import ModernHero from "../templates/hero/ModernHero";
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

/** "Modern" shell: bold gradient hero, wider vertical rhythm, and a subtle
 * alternating section background wash — same shared section components as
 * Classic (only the wrapper/spacing/backgrounds differ, per the v1 scope of
 * varying structurally only the Hero). */
const ModernTemplate = ({
  profile, data, navItems, visibleSections, displayExperience, totalProjects,
  activeSocialLinks, activeTestimonials, activeAchievements, activeCertifications,
}: PortfolioTemplateProps) => {
  const colors = useColors();
  let bandIndex = 0;
  const nextBand = () => {
    const band = bandIndex % 2 === 0 ? "transparent" : `${colors.neutral800}60`;
    bandIndex += 1;
    return band;
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: colors.neutral900, color: colors.neutral100 }}>
      <ErrorBoundary fallback={null} key="navbar">
        <Navbar items={navItems || []} profileName={profile.fullName || ""} logoUrl={profile.logoUrl} userName={profile.userName} />
      </ErrorBoundary>

      <ErrorBoundary fallback={null} key="hero">
        <ModernHero profile={profile} socialLinks={activeSocialLinks} skills={data.skills} />
      </ErrorBoundary>

      <main>
        <Suspense fallback={null}>
          {visibleSections.about && (
            <ErrorBoundary fallback={null} key="about">
              <div className="px-4 py-20" style={{ background: nextBand() }}>
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
              <div className="px-4 py-20" style={{ background: nextBand() }}>
                <ServicesSection services={data.services} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.skills && (
            <ErrorBoundary fallback={null} key="skills">
              <div className="px-4 py-20" style={{ background: nextBand() }}>
                <SkillsSection skills={data.skills} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.experience && (
            <ErrorBoundary fallback={null} key="experience">
              <div className="px-4 py-20" style={{ background: nextBand() }}>
                <ExperienceSection experiences={data.experiences} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.projects && (
            <ErrorBoundary fallback={null} key="projects">
              <div className="px-4 py-20" style={{ background: nextBand() }}>
                <ProjectsSection projects={data.projects} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.achievements && (
            <ErrorBoundary fallback={null} key="achievements">
              <div className="px-4 py-20" style={{ background: nextBand() }}>
                <AchievementsSection achievements={activeAchievements} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.certifications && (
            <ErrorBoundary fallback={null} key="certifications">
              <div className="px-4 py-20" style={{ background: nextBand() }}>
                <CertificationsSection certifications={activeCertifications} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.education && (
            <ErrorBoundary fallback={null} key="education">
              <div className="px-4 py-20" style={{ background: nextBand() }}>
                <EducationSection educations={data.educations} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.testimonials && (
            <ErrorBoundary fallback={null} key="testimonials">
              <div className="px-4 py-20" style={{ background: nextBand() }}>
                <TestimonialsSection testimonials={activeTestimonials} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.languages && (
            <ErrorBoundary fallback={null} key="languages">
              <div className="px-4 py-20" style={{ background: nextBand() }}>
                <LanguagesSection languages={data.languages} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.publications && (
            <ErrorBoundary fallback={null} key="publications">
              <div className="px-4 py-20" style={{ background: nextBand() }}>
                <PublicationsSection publications={data.publications} />
              </div>
            </ErrorBoundary>
          )}

          {visibleSections.github && data.githubStats && (
            <ErrorBoundary fallback={null} key="open-source">
              <div className="px-4 py-20" style={{ background: nextBand() }}>
                <GitHubSection githubStats={data.githubStats} githubRepos={data.githubRepos ?? []} />
              </div>
            </ErrorBoundary>
          )}

          <ErrorBoundary fallback={null} key="contact">
            <div className="px-4 py-24 mb-16" style={{ background: nextBand() }}>
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

export default ModernTemplate;
