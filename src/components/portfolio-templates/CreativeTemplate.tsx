import { Suspense, lazy } from "react";
import { useColors } from "../../utils/theme";
import Navbar from "../molecules/Navbar/Navbar";
import CreativeHero from "../templates/hero/CreativeHero";
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

/** Static, low-opacity organic blob shared by the page-level backdrop —
 * fixed behind the whole page so it never has to be re-positioned per
 * section, and never animated (a prior perpetual-loop decoration caused a
 * real perf regression). */
const PageBlob = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="fixed pointer-events-none"
    style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", filter: "blur(90px)", zIndex: 0, ...style }}
  />
);

/** "Creative" shell: playful, organic, color-forward — same shared section
 * components as Classic/Modern/Minimal (only the wrapper/decoration differs,
 * per the v1 scope of varying structurally only the Hero + wrapper), with
 * a distinct blob-backed hero and generously rounded section "cards". */
const CreativeTemplate = ({
  profile, data, navItems, visibleSections, displayExperience, totalProjects,
  activeSocialLinks, activeTestimonials, activeAchievements, activeCertifications,
}: PortfolioTemplateProps) => {
  const colors = useColors();
  let bandIndex = 0;
  const nextBand = () => {
    const bands = ["transparent", `${colors.primary400}0d`, `${colors.accent400}0d`];
    const band = bands[bandIndex % bands.length];
    bandIndex += 1;
    return band;
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: colors.neutral900, color: colors.neutral100 }}>
      {/* Page-wide static decorative blobs, sitting behind all content */}
      <PageBlob style={{ width: 560, height: 560, top: "10%", left: -220, opacity: 0.14, background: `linear-gradient(135deg, ${colors.primary400}, ${colors.accent400})` }} />
      <PageBlob
        style={{
          width: 620, height: 560, bottom: "5%", right: -240, opacity: 0.12,
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          background: `linear-gradient(135deg, ${colors.accent500}, ${colors.primary400})`,
        }}
      />

      <div className="relative z-10">
        <ErrorBoundary fallback={null} key="navbar">
          <Navbar items={navItems || []} profileName={profile.fullName || ""} logoUrl={profile.logoUrl} userName={profile.userName} />
        </ErrorBoundary>

        <ErrorBoundary fallback={null} key="hero">
          <CreativeHero profile={profile} socialLinks={activeSocialLinks} skills={data.skills} />
        </ErrorBoundary>

        <main>
          <Suspense fallback={null}>
            {visibleSections.about && (
              <ErrorBoundary fallback={null} key="about">
                <div className="mb-15 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
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
                <div className="mb-15 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
                  <ServicesSection services={data.services} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.skills && (
              <ErrorBoundary fallback={null} key="skills">
                <div className="mb-15 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
                  <SkillsSection skills={data.skills} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.experience && (
              <ErrorBoundary fallback={null} key="experience">
                <div className="mb-15 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
                  <ExperienceSection experiences={data.experiences} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.projects && (
              <ErrorBoundary fallback={null} key="projects">
                <div className="mb-15 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
                  <ProjectsSection projects={data.projects} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.achievements && (
              <ErrorBoundary fallback={null} key="achievements">
                <div className="mb-15 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
                  <AchievementsSection achievements={activeAchievements} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.certifications && (
              <ErrorBoundary fallback={null} key="certifications">
                <div className="mb-15 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
                  <CertificationsSection certifications={activeCertifications} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.education && (
              <ErrorBoundary fallback={null} key="education">
                <div className="mb-15 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
                  <EducationSection educations={data.educations} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.testimonials && (
              <ErrorBoundary fallback={null} key="testimonials">
                <div className="mb-15 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
                  <TestimonialsSection testimonials={activeTestimonials} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.languages && (
              <ErrorBoundary fallback={null} key="languages">
                <div className="mb-15 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
                  <LanguagesSection languages={data.languages} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.publications && (
              <ErrorBoundary fallback={null} key="publications">
                <div className="mb-15 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
                  <PublicationsSection publications={data.publications} />
                </div>
              </ErrorBoundary>
            )}

            {visibleSections.github && data.githubStats && (
              <ErrorBoundary fallback={null} key="open-source">
                <div className="mb-15 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
                  <GitHubSection githubStats={data.githubStats} githubRepos={data.githubRepos ?? []} />
                </div>
              </ErrorBoundary>
            )}

            <ErrorBoundary fallback={null} key="contact">
              <div className="mb-16 mx-3 sm:mx-6 rounded-[2rem] overflow-hidden" style={{ background: nextBand() }}>
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

export default CreativeTemplate;
