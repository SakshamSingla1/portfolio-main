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
import Slider from "../molecules/Slider/Slider";

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-10 w-40 rounded-xl bg-neutral-800" />
          <div className="h-3 w-60 rounded bg-neutral-800" />
        </div>
      </div>
    );
  }

  if (error || !profileMaster) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500 text-sm">
        {error || "Profile not found"}
      </div>
    );
  }

  const canonicalUrl =
    profileMaster.socialLinks?.find(
      link => link.platform === SocialLinkPlatform.PORTFOLIO
    )?.url || FALLBACK_SITE_URL;

  const ogImage =
    profileMaster.profile?.logoUrl?.startsWith("http")
      ? profileMaster.profile.logoUrl
      : FALLBACK_OG_IMAGE;

  const title = profileMaster.profile?.fullName
    ? `${profileMaster.profile.fullName} | ${profileMaster.profile.title}`
    : "Portfolio";

  const description =
    profileMaster.profile?.aboutMe?.slice(0, 160) ||
    "Professional portfolio showcasing skills, projects, experience and achievements.";

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

      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />

      <div
        className={`mx-auto max-w-7xl px-4 pt-36 pb-16 ${isMobile ? "space-y-20" : "space-y-32"
          }`}
      >
        {/* HERO */}
        {profileMaster.profile && (
          <Section id="hero" title="" head>
            <ProfileCard
              profile={profileMaster.profile}
              socialLinks={profileMaster.socialLinks}
            />
          </Section>
        )}

        {/* ABOUT */}
        {profileMaster.profile?.aboutMe && (
          <Section id="about-me" title="About Me">
            <AboutMeCard profile={profileMaster.profile} />
          </Section>
        )}
        {/* SKILLS (Premium Mobile Marquee Slider) */}
{profileMaster.skills?.length > 0 && (
  <Section id="skills" title="Skills">
    {isMobile && profileMaster.skills.length > 2 ? (
      <div
        style={{
          overflow: "hidden",
          width: "100%",
        }}
      >
        <style>
          {`
            @keyframes scrollSkills {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}
        </style>

        <div
          style={{
            display: "flex",
            gap: "20px",                  // ✅ 2px gap
            width: "max-content",
            animation: "scrollSkills 12s linear infinite",
          }}
        >
          {[...profileMaster.skills, ...profileMaster.skills].map(
            (skill, index) => (
              <div
                key={`${skill.id}-${index}`}
                style={{
                  width: "160px",       // ✅ Fixed width
                  minWidth: "160px",    // ✅ Prevent resize
                  flexShrink: 0,        // ✅ Important
                }}
              >
                <SkillCard skill={skill} />
              </div>
            )
          )}
        </div>
      </div>
    ) : (
      // Desktop OR <=2 skills
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2, 1fr)"
            : "repeat(4, 1fr)",
          gap: "20px",
          justifyItems: "center",
        }}
      >
        {profileMaster.skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    )}
  </Section>
)}

        {/* EXPERIENCE (converted to slider) */}
        {profileMaster.experiences?.length > 0 && (
          <Section id="experience" title="Experience">
            <Slider
              items={profileMaster.experiences}
              desktopCards={1}
              renderItem={(exp) => (
                <ExperienceCard experience={exp} />
              )}
            />
          </Section>
        )}

        {/* PROJECTS */}
        {profileMaster.projects?.length > 0 && (
          <Section id="projects" title="Projects">
            <Slider
              items={profileMaster.projects}
              desktopCards={2}
              renderItem={(project) => (
                <ProjectCard project={project} />
              )}
            />
          </Section>
        )}

        {/* ACHIEVEMENTS */}
        {profileMaster.achievements?.length > 0 && (
          <Section id="achievements" title="Achievements">
            <Slider
              items={profileMaster.achievements}
              desktopCards={2}
              renderItem={(a) => (
                <AchievementCard achievement={a} />
              )}
            />
          </Section>
        )}

        {/* CERTIFICATIONS */}
        {profileMaster.certifications?.length > 0 && (
          <Section id="certifications" title="Certifications">
            <Slider
              items={profileMaster.certifications}
              desktopCards={2}
              renderItem={(cert) => (
                <CertificationCard certification={cert} />
              )}
            />
          </Section>
        )}

        {/* EDUCATION */}
        {profileMaster.educations?.length > 0 && (
          <Section id="education" title="Education">
            <Slider
              items={profileMaster.educations}
              desktopCards={2}
              renderItem={(edu) => (
                <EducationCard education={edu} />
              )}
            />
          </Section>
        )}

        {/* TESTIMONIALS */}
        {profileMaster.testimonials?.length > 0 && (
          <Section id="testimonials" title="Testimonials">
            <Slider
              items={profileMaster.testimonials}
              desktopCards={2}
              renderItem={(t) => (
                <TestimonialCard testimonial={t} />
              )}
            />
          </Section>
        )}

        {/* CONTACT */}
        <Section id="contact" title="Get In Touch">
          <ContactUsFormTemplate />
        </Section>
      </div>
    </>
  );
};

export default Home;