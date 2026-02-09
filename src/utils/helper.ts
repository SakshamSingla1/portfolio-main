import { DEGREE_OPTIONS } from "./constants";
import type { ColorTheme, NavItem, ProfileMaster } from "./types";

export const replaceUrlParams = (url: string, params: Record<string, any>) => {
  let result = url;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, value);
  }
  return result;
};

export const getColor = (theme: ColorTheme | null,colorName: string) => {
    if(!theme?.palette?.colorGroups) return "";
    for( const group of theme.palette.colorGroups){
        for(const shade of group.colorShades){
            if(shade.colorName === colorName) return shade.colorCode;
        }
    }
    return "";
}

export const sanitizeHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
}

export const toTitleCase = (value?: string | null) => {
  if (!value) return "—";

  return value
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getEducationLabel = (degree: string) => {
    return DEGREE_OPTIONS.find(option => option.value === degree)?.label || degree;
}

export const generateNavItems = (data: ProfileMaster | null): NavItem[] | null => {
  const items: NavItem[] = [{ label: "Home", href: "#hero" }];
  if (data?.profile?.aboutMe) items.push({ label: "About", href: "#about-me" });
  if (data?.skills?.length) items.push({ label: "Skills", href: "#skills" });
  if (data?.experiences?.length)
    items.push({ label: "Experience", href: "#experience" });
  if (data?.projects?.length)
    items.push({ label: "Projects", href: "#projects" });
  if (data?.achievements?.length)
    items.push({ label: "Achievements", href: "#achievements" });
  if (data?.certifications?.length)
    items.push({ label: "Certifications", href: "#certifications" });
  if (data?.educations?.length)
    items.push({ label: "Education", href: "#education" });
  if (data?.testimonials?.length)
    items.push({ label: "Testimonials", href: "#testimonials" });
  items.push({ label: "Contact", href: "#contact" });
  return items;
}