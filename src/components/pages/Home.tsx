import React, { useEffect, useState } from "react";
import { useDefaultColorTheme } from "../../hooks/useDefaultColorTheme";
import { useProfileMasterService } from "../../services/useProfileMasterService";
import { HTTP_STATUS } from "../../utils/constants";
import type { ProfileMaster } from "../../utils/types";

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
  head? : boolean;
}

const Section: React.FC<SectionProps> = ({ id, title, children, gridClass, head = false }) => {
  const colors = useColors();
  const g = gradients(colors);

  return (
    <section className="relative space-y-12 animate-fade-in" id={id}>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 blur-2xl" style={{ background: g.cardBorderGradient }} /> 
      {!head && <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold" style={{ color: colors.accent100 }}>
          {title}
        </h2>
        <div className="relative h-px flex-1 overflow-hidden" style={{ background: g.dividerGradient }} />
      </div>}
      {gridClass ? (
        <div className={`${gridClass} items-start gap-8`}>
          {children}
        </div>
      ) : (
        <div>{children}</div>
      )}
    </section>
  );
};

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
    <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-24 lg:space-y-28">
      {profileMaster.profile && (
        <Section
          id="hero"
          title=""
          head={true}>
          <ProfileCard
            profile={profileMaster.profile}
            socialLinks={profileMaster.socialLinks}
          />
        </Section>
      )}

      {profileMaster.profile?.aboutMe && (
        <Section
          id="about-me"
          title="About Me">
          <AboutMeCard profile={profileMaster.profile} />
        </Section>
      )}

      {/* Education */}
      {profileMaster.educations.length > 0 && (
        <Section
          title="Education"
          gridClass="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {profileMaster.educations.map(edu => (
            <EducationCard key={edu.id} education={edu} />
          ))}
        </Section>
      )}

      {/* Experience */}
      {profileMaster.experiences.length > 0 && (
        <Section title="Experience" gridClass="grid gap-8">
          {profileMaster.experiences.map(exp => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </Section>
      )}

      {/* Projects (High Priority) */}
      {profileMaster.projects.length > 0 && (
        <Section
          title="Projects"
          gridClass="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {profileMaster.projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Section>
      )}

      {/* Skills */}
      {profileMaster.skills.length > 0 && (
        <Section
          title="Skills"
          gridClass="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {profileMaster.skills.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </Section>
      )}

      {/* Achievements */}
      {profileMaster.achievements.length > 0 && (
        <Section
          title="Achievements"
          gridClass="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {profileMaster.achievements.map(a => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </Section>
      )}

      {/* Certifications */}
      {profileMaster.certifications.length > 0 && (
        <Section
          title="Certifications"
          gridClass="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {profileMaster.certifications.map(cert => (
            <CertificationCard key={cert.id} certification={cert} />
          ))}
        </Section>
      )}

      {/* Testimonials */}
      {profileMaster.testimonials.length > 0 && (
        <Section
          title="Testimonials"
          gridClass="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {profileMaster.testimonials.map(testimonial => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </Section>
      )}

      {/* Contact */}
      <ContactUsFormTemplate />
    </main>
  );
};

export default Home;
