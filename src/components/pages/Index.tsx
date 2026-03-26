import { useEffect, useMemo, useState } from "react";
import { generateNavItems } from "../../utils/helper";
import { Status } from "../../utils/types";
import type { ProfileMaster } from "../../utils/types";
import { useColors } from "../../utils/theme";

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

const Index = () => {
  const colors = useColors();
  const profileService = useProfileMasterService();

  const [data, setData] = useState<ProfileMaster | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileService.get();

      if (res?.status === HTTP_STATUS.OK) {
        setData(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const navItems = useMemo(() => generateNavItems(data), [data]);

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
            Loading your portfolio...
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
    <div key="hero" className="mb-10">
      <HeroSection profile={profile} socialLinks={activeSocialLinks} />
    </div>
  );

  if (profile.aboutMe) {
    sections.push(
      <div key="about" className="mb-10">
        <AboutSection profile={profile} />
      </div>
    );
  }

  if (data.skills.length > 0) {
    sections.push(
      <div key="skills" className="mb-10">
        <SkillsSection skills={data.skills} />
      </div>
    );
  }

  if (data.experiences.length > 0) {
    sections.push(
      <div key="experience" className="mb-10">
        <ExperienceSection experiences={data.experiences} />
      </div>
    );
  }

  if (data.projects.length > 0) {
    sections.push(
      <div key="projects" className="mb-10">
        <ProjectsSection projects={data.projects} />
      </div>
    );
  }

  if (activeAchievements.length > 0) {
    sections.push(
      <div key="achievements" className="mb-10">
        <AchievementsSection achievements={activeAchievements} />
      </div>
    );
  }

  if (activeCertifications.length > 0) {
    sections.push(
      <div key="certifications" className="mb-10">
        <CertificationsSection certifications={activeCertifications} />
      </div>
    );
  }

  if (data.educations.length > 0) {
    sections.push(
      <div key="education" className="mb-10">
        <EducationSection educations={data.educations} />
      </div>
    );
  }

  if (activeTestimonials.length > 0) {
    sections.push(
      <div key="testimonials" className="mb-10">
        <TestimonialsSection testimonials={activeTestimonials} />
      </div>
    );
  }

  sections.push(
    <div key="contact" className="mb-10">
      <ContactSection profile={profile} />
    </div>
  );

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: colors.neutral900, color: colors.neutral100 }}
    >
      <GridBackground />
      <ScrollProgress />

      <div className="relative z-10">
        <MouseGlow />

        <Navbar items={navItems || []} profileName={profile.fullName || ""} />

        <main className="px-4 md:px-8 lg:px-16 xl:px-24">
          {sections}
        </main>

        <Footer profile={profile} socialLinks={activeSocialLinks} />

        <ScrollToTop />
      </div>
    </div>
  );
};

export default Index;