import React, { useEffect, useState } from "react";
import { useDefaultColorTheme } from "../../hooks/useDefaultColorTheme";
import { useProfileMasterService } from "../../services/useProfileMasterService";
import { HTTP_STATUS } from "../../utils/constants";
import type { ProfileMaster } from "../../utils/types";

import Navbar from "../molecules/Navbar/Navbar";

import ProfileCard from "../templates/Profile.card";
import EducationCard from "../templates/Education.card";
import ExperienceCard from "../templates/Experience.card";
import ProjectCard from "../templates/Project.card";
import SkillCard from "../templates/Skill.card";
import AchievementCard from "../templates/Achievement.card";
import CertificationCard from "../templates/Certification.card";
import TestimonialCard from "../templates/Testimonial.card";
import AboutMeCard from "../templates/AboutMe.card";
import ContactUsFormTemplate from "../templates/ContactUsForm.template";

import { useColors, gradients } from "../../utils/theme";

/* -------------------------------------------------------------------------- */
/*                                  Section                                   */
/* -------------------------------------------------------------------------- */

interface SectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
  gridClass?: string;
  head?: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  children,
  gridClass,
  head = false,
}) => {
  const colors = useColors();
  const g = gradients(colors);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id={id} className={`relative space-y-6 scroll-mt-32`}>
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-20 blur-2xl"
        style={{ background: g.cardBorderGradient }}
      />

      {/* Header */}
      {!head && (
        <div className={`flex flex-col ${isMobile ? 'items-center' : 'items-start'} justify-start`}>
          <h2
            className="text-2xl font-semibold"
            style={{ color: colors.accent100 }}
          >
            {title}
          </h2>
          <div
            className="mt-3 h-[3px] w-20 rounded-full"
            style={{ background: g.dividerGradient }}
          />

        </div>
      )}

      {/* Content */}
      {gridClass ? (
        <div className={`${gridClass} items-start gap-8`}>{children}</div>
      ) : (
        <div>{children}</div>
      )}
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   Home                                     */
/* -------------------------------------------------------------------------- */

const Home: React.FC = () => {
  const { setDefaultTheme, setProfileId } = useDefaultColorTheme();
  const profileMasterService = useProfileMasterService();

  const [profileMaster, setProfileMaster] = useState<ProfileMaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex min-h-[70vh] items-center justify-center text-sm text-neutral-500">
        Loading profile…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!profileMaster) return null;

  return (
    <>
      {/* ================= FLOATING NAVBAR (OUTSIDE FLOW) ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 mt-4">
        <div className="pointer-events-auto">
          <Navbar profile={profileMaster.profile || null} />
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 pt-32 space-y-20 sm:space-y-24 lg:space-y-28">
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
            <div className="mx-auto max-w-3xl">
              <AboutMeCard profile={profileMaster.profile} />
            </div>
          </Section>
        )}

        {/* SKILLS */}
        {profileMaster.skills.length > 0 && (
          <Section
            id="skills"
            title="Skills"
            gridClass="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {profileMaster.skills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </Section>
        )}

        {/* EXPERIENCE */}
        {profileMaster.experiences.length > 0 && (
          <Section id="experience" title="Experience">
            <div className="space-y-8">
              {profileMaster.experiences.map(exp => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </Section>
        )}

        {/* PROJECTS */}
        {profileMaster.projects.length > 0 && (
          <Section
            id="projects"
            title="Projects"
            gridClass="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {profileMaster.projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Section>
        )}

        {/* EDUCATION */}
        {profileMaster.educations.length > 0 && (
          <Section
            id="education"
            title="Education"
            gridClass="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {profileMaster.educations.map(edu => (
              <EducationCard key={edu.id} education={edu} />
            ))}
          </Section>
        )}

        {/* ACHIEVEMENTS */}
        {profileMaster.achievements.length > 0 && (
          <Section
            id="achievements"
            title="Achievements"
            gridClass="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {profileMaster.achievements.map(a => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </Section>
        )}

        {/* CERTIFICATIONS */}
        {profileMaster.certifications.length > 0 && (
          <Section
            id="certifications"
            title="Certifications"
            gridClass="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {profileMaster.certifications.map(cert => (
              <CertificationCard key={cert.id} certification={cert} />
            ))}
          </Section>
        )}

        {/* TESTIMONIALS */}
        {profileMaster.testimonials.length > 0 && (
          <Section
            id="testimonials"
            title="Testimonials"
            gridClass="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {profileMaster.testimonials.map(t => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </Section>
        )}

        <Section
          id="contact"
          title="Get In Touch"
        >
          <ContactUsFormTemplate />
        </Section>
      </main>
    </>
  );
};

export default Home;
