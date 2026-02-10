import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

import { useDefaultColorTheme } from "../../hooks/useDefaultColorTheme";
import { useProfileMasterService } from "../../services/useProfileMasterService";
import { HTTP_STATUS, SocialLinkPlatform } from "../../utils/constants";
import type { ProfileMaster } from "../../utils/types";
import { useIsMobile } from "../../hooks/useIsMobile";

import Navbar from "../molecules/Navbar/Navbar";
import ProfileCard from "../templates/Profile.card";
import AboutMeCard from "../templates/AboutMe.card";
import SkillCard from "../templates/Skill.card";
import ExperienceCard from "../templates/Experience.card";
import ProjectCard from "../templates/Project.card";
import AchievementCard from "../templates/Achievement.card";
import CertificationCard from "../templates/Certification.card";
import EducationCard from "../templates/Education.card";
import TestimonialCard from "../templates/Testimonial.card";
import ContactUsFormTemplate from "../templates/ContactUsForm.template";
import Section from "../molecules/Section/Section";

import { generateNavItems } from "../../utils/helper";

const FALLBACK_SITE_URL = "http://localhost:5173/";
const FALLBACK_OG_IMAGE = `${FALLBACK_SITE_URL}/seo-preview.png`;

const Home: React.FC = () => {
  const { setDefaultTheme, setProfileId } = useDefaultColorTheme();
  const profileMasterService = useProfileMasterService();
  const isMobile = useIsMobile();

  const [profileMaster, setProfileMaster] = useState<ProfileMaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navItems = useMemo(
    () => generateNavItems(profileMaster),
    [profileMaster]
  );

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileMasterService.get();

      if (response.status === HTTP_STATUS.OK) {
        setProfileMaster(response.data.data);
      } else {
        setError("Failed to load profile data.");
      }
    } catch {
      setError("Something went wrong while loading the profile.");
    } finally {
      setLoading(false);
    }
  };


  const canonicalUrl =
    profileMaster?.socialLinks?.find(
      link => link.platform === SocialLinkPlatform.PORTFOLIO
    )?.url || FALLBACK_SITE_URL;

  const ogImage =
    profileMaster?.profile?.logoUrl?.startsWith("http")
      ? profileMaster.profile.logoUrl
      : FALLBACK_OG_IMAGE;

  const title = profileMaster?.profile?.fullName
    ? `${profileMaster.profile.fullName} | ${profileMaster.profile.title}`
    : "Portfolio";

  const description =
    profileMaster?.profile?.aboutMe?.slice(0, 160) ||
    "Professional portfolio showcasing skills, projects, experience and achievements.";


  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profileMaster) return;

    setDefaultTheme(profileMaster.colorTheme || null);
    setProfileId(profileMaster.profile?.id || null);
  }, [profileMaster, setDefaultTheme, setProfileId]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-sm text-neutral-500">
        Loading profile…
      </div>
    );
  }

  if (error || !profileMaster) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-sm text-red-500">
        {error || "Profile not found"}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>

        <meta name="description" content={description} />

        <meta
          name="keywords"
          content={[
            profileMaster.profile?.title,
            "Portfolio",
            "Developer",
            "React",
            "Java",
            "Full Stack Developer",
          ]
            .filter(Boolean)
            .join(", ")}
        />

        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href={ogImage} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div className="fixed top-0 left-0 right-0 z-50 mt-4">
        <Navbar
          profile={profileMaster.profile || null}
          navItems={navItems || []}
        />
      </div>

      <div
        className={`mx-auto max-w-6xl px-4 pt-32 pb-10 ${isMobile ? "space-y-16" : "space-y-28"
          }`}
      >
        {profileMaster.profile && (
          <Section id="hero" title="" head>
            <ProfileCard
              profile={profileMaster.profile}
              socialLinks={profileMaster.socialLinks}
            />
          </Section>
        )}

        {profileMaster.profile?.aboutMe && (
          <Section id="about-me" title="About Me">
            <AboutMeCard profile={profileMaster.profile} />
          </Section>
        )}

        {profileMaster.skills.length > 0 && (
          <Section
            id="skills"
            title="Skills"
            gridClass={`grid gap-6 ${isMobile ? "grid-cols-2" : "grid-cols-4"
              }`}
          >
            {profileMaster.skills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </Section>
        )}

        {profileMaster.experiences.length > 0 && (
          <Section id="experience" title="Experience">
            <div className={isMobile ? "space-y-6" : "space-y-8"}>
              {profileMaster.experiences.map(exp => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </Section>
        )}

        {profileMaster.projects.length > 0 && (
          <Section
            id="projects"
            title="Projects"
            gridClass={`grid gap-8 ${isMobile ? "grid-cols-1" : "grid-cols-3"
              }`}
          >
            {profileMaster.projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Section>
        )}

        {profileMaster.achievements.length > 0 && (
          <Section
            id="achievements"
            title="Achievements"
            gridClass={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-3"
              }`}
          >
            {profileMaster.achievements.map(a => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </Section>
        )}

        {profileMaster.certifications.length > 0 && (
          <Section
            id="certifications"
            title="Certifications"
            gridClass={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-3"
              }`}
          >
            {profileMaster.certifications.map(cert => (
              <CertificationCard
                key={cert.id}
                certification={cert}
              />
            ))}
          </Section>
        )}

        {profileMaster.educations.length > 0 && (
          <Section
            id="education"
            title="Education"
            gridClass={`grid gap-8 ${isMobile ? "grid-cols-1" : "grid-cols-3"
              }`}
          >
            {profileMaster.educations.map(edu => (
              <EducationCard key={edu.id} education={edu} />
            ))}
          </Section>
        )}

        {profileMaster.testimonials.length > 0 && (
          <Section
            id="testimonials"
            title="Testimonials"
            gridClass={`grid gap-8 ${isMobile ? "grid-cols-1" : "grid-cols-3"
              }`}
          >
            {profileMaster.testimonials.map(t => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </Section>
        )}

        <Section id="contact" title="Get In Touch">
          <ContactUsFormTemplate />
        </Section>
      </div>
    </>
  );
};

export default Home;
