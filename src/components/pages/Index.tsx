import { useEffect, useMemo, useState } from "react";
import { generateNavItems } from "../../utils/helper";
import { Status } from "../../utils/types";
import type { ProfileMaster } from "../../utils/types";
import { useColors } from "../../utils/theme";
import { useDefaultColorTheme } from "../../hooks/useDefaultColorTheme";

import Navbar from "../molecules/Navbar/Navbar";
import HeroSection from "../templates/HeroSection";
import AboutSection from "../templates/AboutSection";
import SkillsSection from "../templates/SkillSection";
import ExperienceSection from "../templates/ExperienceSection";
import ProjectsSection from "../templates/ProjectSection";
import AchievementsSection from "../templates/AchievementSection";
import CertificationsSection from "../templates/CertificationSection";
import EducationSection from "../templates/EducationSection";
import TestimonialsSection from "../templates/TestimonialSection";
import ContactSection from "../templates/ContactSection";
import Footer from "../molecules/Footer/Footer";
import ScrollToTop from "../molecules/ScrollToTop/ScrollToTop";
import MouseGlow from "../molecules/MouseGlow/MouseGlow";

import GridBackground from "../molecules/GridBackground/GridBackground";
import ScrollProgress from "../molecules/ScrollProgress/ScrollProgress";
import useProfileMasterService from "../../services/useProfileMasterService";
import { HTTP_STATUS } from "../../utils/constants";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const colors = useColors();
  const profileService = useProfileMasterService();
  const { setDefaultTheme } = useDefaultColorTheme();

  const [data, setData] = useState<ProfileMaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileService.get();

      if (res?.status === HTTP_STATUS.OK) {
        setData(res.data.data);
        setDefaultTheme(res.data.data?.colorTheme || "default");
      }
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

  const navItems = useMemo(() => generateNavItems(data), [data]);

  const seoData = useMemo(() => ({
    title: data?.profile?.fullName
      ? `${data.profile.fullName} - ${data.profile.title || "Full Stack Developer"}`
      : "Portfolio - Full Stack Developer",
    description: data?.profile?.aboutMe
      ? data.profile.aboutMe.substring(0, 160) + "..."
      : "Full Stack Developer specializing in React, TypeScript, and modern web technologies.",
    name: data?.profile?.fullName || "Your Name",
    image: data?.profile?.profileImageUrl || "/og-image.jpg",
    author: data?.profile?.fullName || "Your Name"
  }), [data]);

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

  const sections: React.ReactNode[] = [];

  sections.push(
    <div key="hero" className="mb-15">
      <HeroSection profile={profile} socialLinks={activeSocialLinks} />
    </div>
  );

  if (profile.aboutMe) {
    sections.push(
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
    );
  }

  if (data.skills.length > 0) {
    sections.push(
      <div key="skills" className="mb-15">
        <SkillsSection skills={data.skills} />
      </div>
    );
  }

  if (data.experiences.length > 0) {
    sections.push(
      <div key="experience" className="mb-15">
        <ExperienceSection experiences={data.experiences} />
      </div>
    );
  }

  if (data.projects.length > 0) {
    sections.push(
      <div key="projects" className="mb-15">
        <ProjectsSection projects={data.projects} />
      </div>
    );
  }

  if (activeAchievements.length > 0) {
    sections.push(
      <div key="achievements" className="mb-15">
        <AchievementsSection achievements={activeAchievements} />
      </div>
    );
  }

  if (activeCertifications.length > 0) {
    sections.push(
      <div key="certifications" className="mb-15">
        <CertificationsSection certifications={activeCertifications} />
      </div>
    );
  }

  if (data.educations.length > 0) {
    sections.push(
      <div key="education" className="mb-15">
        <EducationSection educations={data.educations} />
      </div>
    );
  }

  if (activeTestimonials.length > 0) {
    sections.push(
      <div key="testimonials" className="mb-15">
        <TestimonialsSection testimonials={activeTestimonials} />
      </div>
    );
  }

  sections.push(
    <div key="contact" className="mb-40">
      <ContactSection profile={profile} />
    </div>
  );

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: colors.neutral900, color: colors.neutral100 }}
    >
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content="full stack developer, react, typescript, web development, portfolio" />
        <meta name="author" content={seoData.author} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={seoData.title} />
        <meta property="twitter:description" content={seoData.description} />
        <meta property="twitter:image" content={seoData.image} />

        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      </Helmet>
      <GridBackground />
      <ScrollProgress />

      <div className="relative z-10">
        <MouseGlow />

        <Navbar items={navItems || []} profileName={profile.fullName || ""} logoUrl={profile.logoUrl} />

        {sections.filter((section: any) => section.key === "hero")}
        <main className="px-4">
          {sections.filter((section: any) => section.key !== "hero")}
        </main>

        <Footer profile={profile} socialLinks={activeSocialLinks} />

        <ScrollToTop />
      </div>
    </div>
  );
};

export default Index;