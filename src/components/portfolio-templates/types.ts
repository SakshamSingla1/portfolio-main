import type {
  ProfileMaster, ProfileRequest, NavItem, SocialLinkResponse, Testimonial, Achievement, Certification,
} from "../../utils/types";

/** Which sections have data to show — computed once in Index.tsx so every
 * template applies identical show/hide-by-data-presence rules by construction. */
export interface VisibleSections {
  about: boolean;
  services: boolean;
  skills: boolean;
  experience: boolean;
  projects: boolean;
  achievements: boolean;
  certifications: boolean;
  education: boolean;
  testimonials: boolean;
  languages: boolean;
  publications: boolean;
  github: boolean;
}

export interface PortfolioTemplateProps {
  profile: ProfileRequest;
  data: ProfileMaster;
  navItems: NavItem[] | null;
  visibleSections: VisibleSections;
  displayExperience: string;
  totalProjects: number;
  activeSocialLinks: SocialLinkResponse[];
  activeTestimonials: Testimonial[];
  activeAchievements: Achievement[];
  activeCertifications: Certification[];
}
