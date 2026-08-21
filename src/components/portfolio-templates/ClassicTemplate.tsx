import { Suspense, lazy } from "react";
import { useColors } from "../../utils/theme";
import Navbar from "../molecules/Navbar/Navbar";
import HeroSection from "../templates/HeroSection";
import Footer from "../molecules/Footer/Footer";
import ScrollToTop from "../molecules/ScrollToTop/ScrollToTop";
import MouseGlow from "../molecules/MouseGlow/MouseGlow";
import GridBackground from "../molecules/GridBackground/GridBackground";
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

// The original (and still default) portfolio layout — moved verbatim out of
// Index.tsx so it's just one of several selectable shells, with zero visual
// change for existing users (who all default to CLASSIC).
const ClassicTemplate = ({
  profile, data, navItems, visibleSections, displayExperience, totalProjects,
  activeSocialLinks, activeTestimonials, activeAchievements, activeCertifications,
}: PortfolioTemplateProps) => {
  const colors = useColors();

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: colors.neutral900, color: colors.neutral100 }}
    >
      <GridBackground />

      <div className="relative z-10">
        <MouseGlow />

        <ErrorBoundary fallback={null} key="navbar">
          <Navbar items={navItems || []} profileName={profile.fullName || ""} logoUrl={profile.logoUrl} userName={profile.userName} />
        </ErrorBoundary>

        <ErrorBoundary fallback={null} key="hero">
          <div className="mb-15">
            <HeroSection profile={profile} socialLinks={activeSocialLinks} skills={data.skills} />
          </div>
        </ErrorBoundary>

        <main className="px-4">
          <Suspense fallback={null}>
            {visibleSections.about && (
              <ErrorBoundary fallback={null} key="about">
                <div className="mb-15">
                  <AboutSection
                    profile={profile}
                    totalExp={{
                      value: displayExperience,
                      label: displayExperience === "Fresher" ? "" : "Years of Experience",
                    }}
                    totalProjects={{
                      value: `${totalProjects}+`,
                      label: "Projects Shipped",
                    }}
                  />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.services && (
              <ErrorBoundary fallback={null} key="services">
                <div className="mb-15">
                  <ServicesSection services={data.services} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.skills && (
              <ErrorBoundary fallback={null} key="skills">
                <div className="mb-15">
                  <SkillsSection skills={data.skills} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.experience && (
              <ErrorBoundary fallback={null} key="experience">
                <div className="mb-15">
                  <ExperienceSection experiences={data.experiences} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.projects && (
              <ErrorBoundary fallback={null} key="projects">
                <div className="mb-15">
                  <ProjectsSection projects={data.projects} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.achievements && (
              <ErrorBoundary fallback={null} key="achievements">
                <div className="mb-15">
                  <AchievementsSection achievements={activeAchievements} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.certifications && (
              <ErrorBoundary fallback={null} key="certifications">
                <div className="mb-15">
                  <CertificationsSection certifications={activeCertifications} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.education && (
              <ErrorBoundary fallback={null} key="education">
                <div className="mb-15">
                  <EducationSection educations={data.educations} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.testimonials && (
              <ErrorBoundary fallback={null} key="testimonials">
                <div className="mb-15">
                  <TestimonialsSection testimonials={activeTestimonials} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.languages && (
              <ErrorBoundary fallback={null} key="languages">
                <div className="mb-15">
                  <LanguagesSection languages={data.languages} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.publications && (
              <ErrorBoundary fallback={null} key="publications">
                <div className="mb-15">
                  <PublicationsSection publications={data.publications} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.github && data.githubStats && (
              <ErrorBoundary fallback={null} key="open-source">
                <div className="mb-15">
                  <GitHubSection githubStats={data.githubStats} githubRepos={data.githubRepos ?? []} />
                </div>
              </ErrorBoundary>
            )}

            <ErrorBoundary fallback={null} key="contact">
              <div className="mb-40">
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
    </div>
  );
};

export default ClassicTemplate;
