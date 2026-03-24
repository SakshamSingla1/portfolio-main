import { useEffect, useState, useMemo } from "react";

import { GridBackground } from "../molecules/GridBackground/GridBackground";
import { ScrollProgress } from "../molecules/ScrollProgress/ScrollProgress";
import { MouseGlow } from "../molecules/MouseGlow/MouseGlow";
import { Navbar } from "../molecules/Navbar/Navbar";
import { HeroSection } from "../templates/HeroSection";
import { AboutSection } from "../templates/AboutSection";
import { SkillsSection } from "../templates/SkillSection";
import { ExperienceSection } from "../templates/ExperienceSection";
import { ProjectsSection } from "../templates/ProjectSection";
import { EducationSection } from "../templates/EducationSection";
import { TestimonialsSection } from "../templates/TestimonialSection";
import {
  AchievementsSection,
  CertificationsSection,
} from "../templates/AchievementSection";
import { ContactSection } from "../templates/ContactSection";
import { Footer } from "../molecules/Footer/Footer";

import { useProfileMasterService } from "../../services/useProfileMasterService";
import { HTTP_STATUS } from "../../utils/constants";
import type { ProfileMaster, NavItem } from "../../utils/types";

const generateNavItems = (data: ProfileMaster | null): NavItem[] => {
  if (!data) return [];

  const items: NavItem[] = [{ label: "Home", section: "hero" }];

  if (data.profile?.aboutMe) items.push({ label: "About", section: "about-me" });
  if (data.skills?.length) items.push({ label: "Skills", section: "skills" });
  if (data.experiences?.length) items.push({ label: "Experience", section: "experience" });
  if (data.projects?.length) items.push({ label: "Projects", section: "projects" });
  if (data.achievements?.length) items.push({ label: "Achievements", section: "achievements" });
  if (data.certifications?.length) items.push({ label: "Certifications", section: "certifications" });
  if (data.educations?.length) items.push({ label: "Education", section: "education" });
  if (data.testimonials?.length) items.push({ label: "Testimonials", section: "testimonials" });

  items.push({ label: "Contact", section: "contact" });

  return items;
};

const Index = () => {
  const profileService = useProfileMasterService();

  const [data, setData] = useState<ProfileMaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileService.get();

      if (res?.status === HTTP_STATUS.OK) {
        setData(res.data.data);
      } else {
        setError("Failed to load profile");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const navItems = useMemo(() => generateNavItems(data), [data]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">
        Loading portfolio...
      </div>
    );
  }

  // ================= ERROR =================
  if (error || !data || !data.profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500 text-sm">
        {error || "No data found"}
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-background relative noise-overlay">
      <ScrollProgress />
      <MouseGlow />
      <GridBackground />

      <div className="relative z-10">
        <Navbar items={navItems} profileName={data.profile.fullName} />

        <HeroSection profile={data.profile} socialLinks={data.socialLinks} />

        {data.profile.aboutMe && <AboutSection profile={data.profile} />}
        <div className="section-divider" />

        {data.skills?.length > 0 && <SkillsSection skills={data.skills} />}
        <div className="section-divider" />

        {data.experiences?.length > 0 && <ExperienceSection experiences={data.experiences} />}
        <div className="section-divider" />

        {data.projects?.length > 0 && <ProjectsSection projects={data.projects} />}
        <div className="section-divider" />

        {data.achievements?.length > 0 && (
          <AchievementsSection achievements={data.achievements} />
        )}
        {data.certifications?.length > 0 && (
          <CertificationsSection certifications={data.certifications} />
        )}
        <div className="section-divider" />

        {data.educations?.length > 0 && <EducationSection educations={data.educations} />}
        <div className="section-divider" />

        {data.testimonials?.length > 0 && (
          <TestimonialsSection testimonials={data.testimonials} />
        )}
        <div className="section-divider" />

        <ContactSection profile={data.profile} />

        <Footer profile={data.profile} socialLinks={data.socialLinks} />
      </div>
    </div>
  );
};

export default Index;