import { Suspense, lazy } from "react";
import { useColors } from "../../utils/theme";
import Navbar from "../molecules/Navbar/Navbar";
import ElegantHero from "../templates/hero/ElegantHero";
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

/** "Elegant" shell: quiet-luxury variant on Minimal — a single continuous
 * calm surface (no background bands/washes), even more generous vertical
 * rhythm than Minimal's py-14, and a thin accent-tinted hairline (echoing
 * the hero's signature rule) instead of Minimal's plain neutral divider. */
const ElegantTemplate = ({
  profile, data, navItems, visibleSections, displayExperience, totalProjects,
  activeSocialLinks, activeTestimonials, activeAchievements, activeCertifications,
}: PortfolioTemplateProps) => {
  const colors = useColors();
  const divider = (
    <div className="flex justify-center">
      <div style={{ height: 1, width: 120, background: colors.accent400, opacity: 0.35 }} />
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: colors.neutral900, color: colors.neutral100 }}>
      <ErrorBoundary fallback={null} key="navbar">
        <Navbar items={navItems || []} profileName={profile.fullName || ""} logoUrl={profile.logoUrl} userName={profile.userName} />
      </ErrorBoundary>

      <ErrorBoundary fallback={null} key="hero">
        <ElegantHero profile={profile} socialLinks={activeSocialLinks} />
      </ErrorBoundary>

      <main className="px-4">
        <Suspense fallback={null}>
          {visibleSections.about && (
            <ErrorBoundary fallback={null} key="about">
              <div className="py-20">
                <AboutSection
                  profile={profile}
                  totalExp={{ value: displayExperience, label: displayExperience === "Fresher" ? "" : "Years of Experience" }}
                  totalProjects={{ value: `${totalProjects}+`, label: "Projects Shipped" }}
                />
              </div>
              {divider}
            </ErrorBoundary>
          )}

          {visibleSections.services && (
            <ErrorBoundary fallback={null} key="services">
              <div className="py-20"><ServicesSection services={data.services} /></div>
              {divider}
            </ErrorBoundary>
          )}

          {visibleSections.skills && (
            <ErrorBoundary fallback={null} key="skills">
              <div className="py-20"><SkillsSection skills={data.skills} /></div>
              {divider}
            </ErrorBoundary>
          )}

          {visibleSections.experience && (
            <ErrorBoundary fallback={null} key="experience">
              <div className="py-20"><ExperienceSection experiences={data.experiences} /></div>
              {divider}
            </ErrorBoundary>
          )}

          {visibleSections.projects && (
            <ErrorBoundary fallback={null} key="projects">
              <div className="py-20"><ProjectsSection projects={data.projects} /></div>
              {divider}
            </ErrorBoundary>
          )}

          {visibleSections.achievements && (
            <ErrorBoundary fallback={null} key="achievements">
              <div className="py-20"><AchievementsSection achievements={activeAchievements} /></div>
              {divider}
            </ErrorBoundary>
          )}

          {visibleSections.certifications && (
            <ErrorBoundary fallback={null} key="certifications">
              <div className="py-20"><CertificationsSection certifications={activeCertifications} /></div>
              {divider}
            </ErrorBoundary>
          )}

          {visibleSections.education && (
            <ErrorBoundary fallback={null} key="education">
              <div className="py-20"><EducationSection educations={data.educations} /></div>
              {divider}
            </ErrorBoundary>
          )}

          {visibleSections.testimonials && (
            <ErrorBoundary fallback={null} key="testimonials">
              <div className="py-20"><TestimonialsSection testimonials={activeTestimonials} /></div>
              {divider}
            </ErrorBoundary>
          )}

          {visibleSections.languages && (
            <ErrorBoundary fallback={null} key="languages">
              <div className="py-20"><LanguagesSection languages={data.languages} /></div>
              {divider}
            </ErrorBoundary>
          )}

          {visibleSections.publications && (
            <ErrorBoundary fallback={null} key="publications">
              <div className="py-20"><PublicationsSection publications={data.publications} /></div>
              {divider}
            </ErrorBoundary>
          )}

          {visibleSections.github && data.githubStats && (
            <ErrorBoundary fallback={null} key="open-source">
              <div className="py-20"><GitHubSection githubStats={data.githubStats} githubRepos={data.githubRepos ?? []} /></div>
              {divider}
            </ErrorBoundary>
          )}

          <ErrorBoundary fallback={null} key="contact">
            <div className="py-24 mb-16"><ContactSection profile={profile} /></div>
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

export default ElegantTemplate;
