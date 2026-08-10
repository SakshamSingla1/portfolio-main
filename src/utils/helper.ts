import type { SyntheticEvent } from "react";
import { DEGREE_OPTIONS } from "./constants";
import type { ColorTheme, NavItem, ProfileMaster } from "./types";

export const replaceUrlParams = (url: string, params: Record<string, string | number>) => {
  let result = url;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, String(value));
  }
  return result;
};

export const getColor = (theme: ColorTheme | null, colorName: string) => {
  if (!theme?.palette?.colorGroups) return "";
  for (const group of theme.palette.colorGroups) {
    for (const shade of group.colorShades) {
      if (shade.colorName === colorName) return shade.colorCode;
    }
  }
  return "";
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
  const items: NavItem[] = [{ label: "Home", section: "hero" }];
  if (data?.profile?.aboutMe) items.push({ label: "About", section: "about-me" });
  if (data?.skills?.length) items.push({ label: "Skills", section: "skills" });
  if (data?.experiences?.length)
    items.push({ label: "Experience", section: "experience" });
  if (data?.projects?.length)
    items.push({ label: "Projects", section: "projects" });
  if (data?.services?.some(s => s.isActive))
    items.push({ label: "Services", section: "services" });
  if (data?.achievements?.some(a => a.status === "ACTIVE"))
    items.push({ label: "Achievements", section: "achievements" });
  if (data?.certifications?.some(c => c.status === "ACTIVE"))
    items.push({ label: "Certifications", section: "certifications" });
  if (data?.publications?.length)
    items.push({ label: "Publications", section: "publications" });
  if (data?.educations?.length)
    items.push({ label: "Education", section: "education" });
  if (data?.languages?.length)
    items.push({ label: "Languages", section: "languages" });
  if (data?.testimonials?.some(t => t.status === "ACTIVE"))
    items.push({ label: "Testimonials", section: "testimonials" });
  if (data?.githubStats)
    items.push({ label: "GitHub", section: "open-source" });
  items.push({ label: "Contact", section: "contact" });
  return items;
};

export const normalizePercentage = (grade?: string): string => {
  if (!grade) return "";
  const parts = grade.trim().split(/\s+/);
  const value = parts[0];
  const label = parts[1]?.toLowerCase();
  if (label?.toLowerCase() === "percentage" && !isNaN(Number(value))) {
    return `${value}%`;
  }
  return grade.trim();
};

export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "Present";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const getOptimizedImageUrl = (
  url: string | null | undefined,
  options: { width?: number; height?: number; quality?: string } = {}
): string => {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }

  const parts = url.split("/image/upload/");
  if (parts.length !== 2) return url;

  const transformations: string[] = ["f_auto"];
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.width || options.height) {
    transformations.push(options.width && options.height ? "c_fill" : "c_limit");
  }
  if (options.quality) {
    transformations.push(`q_${options.quality}`);
  } else {
    transformations.push("q_auto");
  }

  const transformStr = transformations.join(",");
  return `${parts[0]}/image/upload/${transformStr}/${parts[1]}`;
};

/** Hides a broken/dead image instead of leaving the browser's broken-image glyph on screen. */
export const onImageError = (e: SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.visibility = "hidden";
};
