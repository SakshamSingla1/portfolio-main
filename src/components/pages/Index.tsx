import { useEffect, useMemo, useState } from "react";
import { generateNavItems, getOptimizedImageUrl } from "../../utils/helper";
import { Status } from "../../utils/types";
import type { ProfileMaster } from "../../utils/types";
import { useColors } from "../../utils/theme";
import { useDefaultColorTheme } from "../../hooks/useDefaultColorTheme";

import Navbar from "../molecules/Navbar/Navbar";
import HeroSection from "../templates/HeroSection";
import Footer from "../molecules/Footer/Footer";
import ScrollToTop from "../molecules/ScrollToTop/ScrollToTop";
import MouseGlow from "../molecules/MouseGlow/MouseGlow";
import GridBackground from "../molecules/GridBackground/GridBackground";
import ScrollProgress from "../molecules/ScrollProgress/ScrollProgress";
import useProfileMasterService from "../../services/useProfileMasterService";
import { trackPortfolioView } from "../../services/useTrackingService";
import { HTTP_STATUS } from "../../utils/constants";
import { Helmet } from "react-helmet-async";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "../atoms/ErrorBoundary/ErrorBoundary";

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

const Index = () => {
  const colors = useColors();
  const profileService = useProfileMasterService();
  const { setDefaultTheme } = useDefaultColorTheme();

  const [data, setData] = useState<ProfileMaster | null>(() => {
    try {
      const cached = localStorage.getItem("portfolio_data");
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      // bust stale cache if shape is missing new fields
      if (!("githubStats" in parsed) || !("languages" in parsed) || !("services" in parsed) || !("githubRepos" in parsed) || !("publications" in parsed)) {
        localStorage.removeItem("portfolio_data");
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!data);
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const fetchProfile = async () => {
    try {
      // If we don't have data, we show the loading state
      if (!data) setLoading(true);
      
      const res = await profileService.get();

      if (res?.status === HTTP_STATUS.OK) {
        const newData = res.data.data;
        setData(newData);
        localStorage.setItem("portfolio_data", JSON.stringify(newData));
        setDefaultTheme(newData?.colorTheme ?? null);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalExperience = useMemo(() => {
    if (!data?.experiences?.length) return "0";
    const totalMonths = data.experiences.reduce((acc, exp) => {
      if (!exp.startDate) return acc;
      const start = new Date(exp.startDate);
      const isCurrent = !exp.endDate || exp.employmentStatus === "CURRENT";
      const end = isCurrent ? new Date() : new Date(exp.endDate || "");
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      return acc + Math.max(months, 0);
    }, 0);
    return (totalMonths / 12).toFixed(1);
  }, [data?.experiences]);

  const displayExperience = useMemo(() => {
    return Number(totalExperience) < 1 ? "Fresher" : `${totalExperience}+ Years`;
  }, [totalExperience]);

  const totalProjects = data?.projects?.length || 0;

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    setCanonicalUrl(window.location.href);
  }, []);

  // Fire view tracking once per session after profile data is available
  useEffect(() => {
    if (data?.profile?.id) {
      trackPortfolioView(data.profile.id);
    }
  }, [data?.profile?.id]);

  const navItems = useMemo(() => generateNavItems(data), [data]);

  const seoData = useMemo(() => {
    const fullName = data?.profile?.fullName || "Portfolio";
    const title = data?.profile?.title || "Full Stack Developer";
    const skills = data?.skills?.map(s => s.logoName).slice(0, 10).join(", ");
    const meta = data?.seoMeta;

    const defaultTitle = `${fullName} | ${title}`;
    const defaultDescription = data?.profile?.aboutMe
      ? data.profile.aboutMe.substring(0, 155) + "..."
      : `Professional portfolio of ${fullName}, a ${title} specializing in modern web technologies.`;
    const defaultKeywords = `${fullName}, ${title}, ${skills}, web development, portfolio, software engineer`;

    const resolvedTitle = meta?.title || defaultTitle;
    const resolvedDescription = meta?.description || defaultDescription;
    const resolvedImage = meta?.ogImageUrl || data?.profile?.profileImageUrl || "/og-image.jpg";
    const resolvedCanonical = meta?.canonicalUrl || canonicalUrl;
    const robots = `${meta?.indexable !== false ? "index" : "noindex"}, ${meta?.followLinks !== false ? "follow" : "nofollow"}`;

    return {
      title: resolvedTitle,
      description: resolvedDescription,
      keywords: meta?.keywords?.join(", ") || defaultKeywords,
      ogTitle: meta?.ogTitle || resolvedTitle,
      ogDescription: meta?.ogDescription || resolvedDescription,
      image: resolvedImage,
      author: fullName,
      siteUrl: resolvedCanonical,
      robots,
    };
  }, [data, canonicalUrl]);

  const jsonLd = useMemo(() => {
    if (!data?.profile) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": data.profile.fullName,
      "jobTitle": data.profile.title,
      "url": canonicalUrl,
      "image": data.profile.profileImageUrl,
      "sameAs": data.socialLinks.map(l => l.url),
      "description": data.profile.aboutMe,
      "knowsAbout": data.skills.map(s => s.logoName)
    };
  }, [data, canonicalUrl]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.neutral900 }}
      >
        <div className="flex flex-col items-center gap-6">
          <div
            className="w-12 h-12 rounded-full animate-spin"
            style={{
              border: `3px solid ${colors.primary500}`,
              borderTopColor: "transparent",
            }}
          />
          <p className="font-mono text-sm tracking-wider animate-pulse" style={{ color: colors.neutral500 }}>
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (!data?.profile) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.neutral900 }}
      >
        <div className="text-center space-y-3">
          <h1 className="text-7xl font-bold" style={{ color: colors.primary500 }}>
            404
          </h1>
          <p className="text-sm tracking-wide" style={{ color: colors.neutral500 }}>
            Profile not found
          </p>
        </div>
      </div>
    );
  }

  const profile = data.profile;

  const activeSocialLinks = data.socialLinks.filter((l) => l.status === Status.ACTIVE);
  const activeTestimonials = data.testimonials.filter((t) => t.status === Status.ACTIVE);
  const activeAchievements = data.achievements.filter((a) => a.status === Status.ACTIVE);
  const activeCertifications = data.certifications.filter((c) => c.status === Status.ACTIVE);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: colors.neutral900, color: colors.neutral100 }}
    >
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="author" content={seoData.author} />
        <meta name="robots" content={seoData.robots} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:url" content={seoData.siteUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.ogTitle} />
        <meta name="twitter:description" content={seoData.ogDescription} />
        <meta name="twitter:image" content={seoData.image} />

        {seoData.siteUrl && <link rel="canonical" href={seoData.siteUrl} />}
        
        {profile.logoUrl && (
          <>
            <link rel="icon" href={profile.logoUrl} />
            <link rel="apple-touch-icon" href={profile.logoUrl} />
          </>
        )}

        {data?.profile?.profileImageUrl && (
          <link
            rel="preload"
            as="image"
            href={getOptimizedImageUrl(data.profile.profileImageUrl, { width: 800 })}
            fetchPriority="high"
          />
        )}

        {jsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </script>
        )}
      </Helmet>
      <GridBackground />
      <ScrollProgress />

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
            {profile.aboutMe && (
              <ErrorBoundary fallback={null} key="about">
                <div className="mb-15">
                  <AboutSection
                    profile={profile}
                    skills={data.skills}
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

            {data.services && data.services.length > 0 && (
              <ErrorBoundary fallback={null} key="services">
                <div className="mb-15">
                  <ServicesSection services={data.services} />
                </div>
              </ErrorBoundary>
            )}

            {data.skills.length > 0 && (
              <ErrorBoundary fallback={null} key="skills">
                <div className="mb-15">
                  <SkillsSection skills={data.skills} />
                </div>
              </ErrorBoundary>
            )}

            {data.experiences.length > 0 && (
              <ErrorBoundary fallback={null} key="experience">
                <div className="mb-15">
                  <ExperienceSection experiences={data.experiences} />
                </div>
              </ErrorBoundary>
            )}

            {data.projects.length > 0 && (
              <ErrorBoundary fallback={null} key="projects">
                <div className="mb-15">
                  <ProjectsSection projects={data.projects} />
                </div>
              </ErrorBoundary>
            )}

            {activeAchievements.length > 0 && (
              <ErrorBoundary fallback={null} key="achievements">
                <div className="mb-15">
                  <AchievementsSection achievements={activeAchievements} />
                </div>
              </ErrorBoundary>
            )}

            {activeCertifications.length > 0 && (
              <ErrorBoundary fallback={null} key="certifications">
                <div className="mb-15">
                  <CertificationsSection certifications={activeCertifications} />
                </div>
              </ErrorBoundary>
            )}

            {data.educations.length > 0 && (
              <ErrorBoundary fallback={null} key="education">
                <div className="mb-15">
                  <EducationSection educations={data.educations} />
                </div>
              </ErrorBoundary>
            )}

            {activeTestimonials.length > 0 && (
              <ErrorBoundary fallback={null} key="testimonials">
                <div className="mb-15">
                  <TestimonialsSection testimonials={activeTestimonials} />
                </div>
              </ErrorBoundary>
            )}

            {data.languages && data.languages.length > 0 && (
              <ErrorBoundary fallback={null} key="languages">
                <div className="mb-15">
                  <LanguagesSection languages={data.languages} />
                </div>
              </ErrorBoundary>
            )}

            {data.publications && data.publications.length > 0 && (
              <ErrorBoundary fallback={null} key="publications">
                <div className="mb-15">
                  <PublicationsSection publications={data.publications} />
                </div>
              </ErrorBoundary>
            )}

            {data.githubStats && (
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

export default Index;