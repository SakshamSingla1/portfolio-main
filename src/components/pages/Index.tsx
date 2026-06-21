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

const Index = () => {
  const colors = useColors();
  const profileService = useProfileMasterService();
  const { setDefaultTheme } = useDefaultColorTheme();

  const [data, setData] = useState<ProfileMaster | null>(() => {
    const cached = localStorage.getItem("portfolio_data");
    return cached ? JSON.parse(cached) : null;
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
        setDefaultTheme(newData?.colorTheme || "default");
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

    return {
      title: `${fullName} | ${title}`,
      description: data?.profile?.aboutMe
        ? data.profile.aboutMe.substring(0, 155) + "..."
        : `Professional portfolio of ${fullName}, a ${title} specializing in modern web technologies.`,
      keywords: `${fullName}, ${title}, ${skills}, web development, portfolio, software engineer`,
      name: fullName,
      image: data?.profile?.profileImageUrl || "/og-image.jpg",
      author: fullName,
      siteUrl: canonicalUrl
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
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:url" content={seoData.siteUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={seoData.title} />
        <meta property="twitter:description" content={seoData.description} />
        <meta property="twitter:image" content={seoData.image} />

        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        
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

        <Navbar items={navItems || []} profileName={profile.fullName || ""} logoUrl={profile.logoUrl} userName={profile.userName} />

        <div key="hero" className="mb-15">
          <HeroSection profile={profile} socialLinks={activeSocialLinks} />
        </div>

        <main className="px-4">
          <Suspense fallback={null}>
            {profile.aboutMe && (
              <div key="about" className="mb-15">
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
            )}

            {data.skills.length > 0 && (
              <div key="skills" className="mb-15">
                <SkillsSection skills={data.skills} />
              </div>
            )}

            {data.experiences.length > 0 && (
              <div key="experience" className="mb-15">
                <ExperienceSection experiences={data.experiences} />
              </div>
            )}

            {data.projects.length > 0 && (
              <div key="projects" className="mb-15">
                <ProjectsSection projects={data.projects} />
              </div>
            )}

            {activeAchievements.length > 0 && (
              <div key="achievements" className="mb-15">
                <AchievementsSection achievements={activeAchievements} />
              </div>
            )}

            {activeCertifications.length > 0 && (
              <div key="certifications" className="mb-15">
                <CertificationsSection certifications={activeCertifications} />
              </div>
            )}

            {data.educations.length > 0 && (
              <div key="education" className="mb-15">
                <EducationSection educations={data.educations} />
              </div>
            )}

            {activeTestimonials.length > 0 && (
              <div key="testimonials" className="mb-15">
                <TestimonialsSection testimonials={activeTestimonials} />
              </div>
            )}

            {data.githubStats && (
              <div key="open-source" className="mb-15">
                <GitHubSection githubStats={data.githubStats} />
              </div>
            )}

            <div key="contact" className="mb-40">
              <ContactSection profile={profile} />
            </div>
          </Suspense>
        </main>

        <Footer profile={profile} socialLinks={activeSocialLinks} />

        <ScrollToTop />
      </div>
    </div>
  );
};

export default Index;