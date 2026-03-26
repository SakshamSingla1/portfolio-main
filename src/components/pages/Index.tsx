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
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full animate-spin"
            style={{
              border: `2px solid ${colors.primary500}`,
              borderTopColor: "transparent",
            }}
          />
          <p className="font-mono text-sm" style={{ color: colors.neutral500 }}>
            Loading...
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
        <div className="text-center">
          <h1
            className="text-6xl font-display font-bold mb-3"
            style={{ color: colors.primary500 }}
          >
            404
          </h1>
          <p className="font-mono" style={{ color: colors.neutral500 }}>
            Profile not found
          </p>
        </div>
      </div>
    );
  }

  const profile = data.profile;

  const activeSocialLinks = data.socialLinks.filter(
    (l) => l.status === Status.ACTIVE
  );
  const activeTestimonials = data.testimonials.filter(
    (t) => t.status === Status.ACTIVE
  );
  const activeAchievements = data.achievements.filter(
    (a) => a.status === Status.ACTIVE
  );
  const activeCertifications = data.certifications.filter(
    (c) => c.status === Status.ACTIVE
  );

  const sections: React.ReactNode[] = [];

  sections.push(
    <HeroSection key="hero" profile={profile} socialLinks={activeSocialLinks} />
  );

  if (profile.aboutMe) {
    sections.push(<AboutSection key="about" profile={profile} />);
  }

  if (data.skills.length > 0) {
    sections.push(<SkillsSection key="skills" skills={data.skills} />);
  }

  if (data.experiences.length > 0) {
    sections.push(
      <ExperienceSection key="experience" experiences={data.experiences} />
    );
  }

  if (data.projects.length > 0) {
    sections.push(
      <ProjectsSection key="projects" projects={data.projects} />
    );
  }

  if (activeAchievements.length > 0) {
    sections.push(
      <AchievementsSection
        key="achievements"
        achievements={activeAchievements}
      />
    );
  }

  if (activeCertifications.length > 0) {
    sections.push(
      <CertificationsSection
        key="certifications"
        certifications={activeCertifications}
      />
    );
  }

  if (data.educations.length > 0) {
    sections.push(
      <EducationSection key="education" educations={data.educations} />
    );
  }

  if (activeTestimonials.length > 0) {
    sections.push(
      <TestimonialsSection
        key="testimonials"
        testimonials={activeTestimonials}
      />
    );
  }

  sections.push(<ContactSection key="contact" profile={profile} />);

  return (
    <div
      className="min-h-screen relative"
      style={{ background: colors.neutral900, color: colors.neutral100 }}
    >
      <GridBackground />
      <ScrollProgress />

      <div className="relative z-10">
        <MouseGlow />
        <Navbar items={navItems || []} profileName={profile.fullName || ""} />
        <main>{sections}</main>
        <Footer profile={profile} socialLinks={activeSocialLinks} />
        <ScrollToTop />
      </div>
    </div>
  );
};

export default Index;