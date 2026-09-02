import { useEffect, useMemo, useRef, useState } from "react";
import { generateNavItems, getOptimizedImageUrl } from "../../utils/helper";
import { Status } from "../../utils/types";
import type { ProfileMaster } from "../../utils/types";
import { useColors } from "../../utils/theme";
import { useDefaultColorTheme } from "../../hooks/useDefaultColorTheme";

import useProfileMasterService from "../../services/useProfileMasterService";
import { trackPortfolioView } from "../../services/useTrackingService";
import { HTTP_STATUS } from "../../utils/constants";
import { Helmet } from "react-helmet-async";
import { Suspense, lazy } from "react";
import type { VisibleSections } from "../portfolio-templates/types";

const ClassicTemplate = lazy(() => import("../portfolio-templates/ClassicTemplate"));
const ModernTemplate = lazy(() => import("../portfolio-templates/ModernTemplate"));
const MinimalTemplate = lazy(() => import("../portfolio-templates/MinimalTemplate"));
const BoldTemplate = lazy(() => import("../portfolio-templates/BoldTemplate"));
const TerminalTemplate = lazy(() => import("../portfolio-templates/TerminalTemplate"));
const ElegantTemplate = lazy(() => import("../portfolio-templates/ElegantTemplate"));
const CreativeTemplate = lazy(() => import("../portfolio-templates/CreativeTemplate"));

const TEMPLATE_MAP = {
  CLASSIC: ClassicTemplate,
  MODERN: ModernTemplate,
  MINIMAL: MinimalTemplate,
  BOLD: BoldTemplate,
  TERMINAL: TerminalTemplate,
  ELEGANT: ElegantTemplate,
  CREATIVE: CreativeTemplate,
} as const;

const PROFILE_CACHE_KEY = "portfolio_data";
const PROFILE_CACHE_TIMESTAMP_KEY = "portfolio_data_fetched_at";
// Cached profile data younger than this is considered fresh enough to skip
// the network round trip entirely; older/missing data still triggers a fetch.
const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000;

const Index = () => {
  const colors = useColors();
  const profileService = useProfileMasterService();
  const { setDefaultTheme } = useDefaultColorTheme();

  const [data, setData] = useState<ProfileMaster | null>(() => {
    try {
      const cached = localStorage.getItem(PROFILE_CACHE_KEY);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      // bust stale cache if shape is missing new fields
      if (!("githubStats" in parsed) || !("languages" in parsed) || !("services" in parsed) || !("githubRepos" in parsed) || !("publications" in parsed) || !("templateKey" in parsed)) {
        localStorage.removeItem(PROFILE_CACHE_KEY);
        localStorage.removeItem(PROFILE_CACHE_TIMESTAMP_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!data);
  const [canonicalUrl, setCanonicalUrl] = useState("");

  // Mirrors `data` without being a reactive dependency of the mount-time
  // fetch effect below: that effect must run exactly once on mount and
  // itself calls setData, so depending on `data` directly would re-trigger
  // it every time the fetch completes. Reading the current value through a
  // ref (updated on every render) keeps the freshness check accurate while
  // keeping the effect's own dependency array free of the value it mutates.
  const dataRef = useRef(data);
  dataRef.current = data;

  const totalExperience = useMemo(() => {
    if (!data?.experiences?.length) return "0";
    const totalMonths = data.experiences.reduce((acc, exp) => {
      if (!exp.startDate) return acc;
      const start = new Date(exp.startDate);
      const isCurrent = !exp.endDate || exp.employmentStatus === "CURRENT";
      const end = isCurrent ? new Date() : new Date(exp.endDate || "");
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      return acc + Math.max(months, 0);
    }, 0);
    return (totalMonths / 12).toFixed(1);
  }, [data?.experiences]);

  const displayExperience = useMemo(() => {
    return Number(totalExperience) < 1 ? "Fresher" : `${totalExperience}+ Years`;
  }, [totalExperience]);

  const totalProjects = data?.projects?.length || 0;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (dataRef.current) {
          // Cached data already rendered (stale-while-revalidate) — only skip
          // the network call itself when that cache is still within the TTL.
          const fetchedAt = Number(localStorage.getItem(PROFILE_CACHE_TIMESTAMP_KEY));
          const isFresh = Number.isFinite(fetchedAt) && fetchedAt > 0 && Date.now() - fetchedAt < PROFILE_CACHE_TTL_MS;
          if (isFresh) return;
        } else {
          setLoading(true);
        }

        const res = await profileService.get();

        if (res?.status === HTTP_STATUS.OK) {
          const newData = res.data.data;
          setData(newData);
          localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(newData));
          localStorage.setItem(PROFILE_CACHE_TIMESTAMP_KEY, String(Date.now()));
          setDefaultTheme(newData?.colorTheme ?? null);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // Intentionally mount-once in practice: `dataRef` is read instead of
    // `data` so this effect's own `setData` call doesn't retrigger it, and
    // `profileService` / `setDefaultTheme` are referentially stable
    // (memoized service hook / useState setter), so this still only runs
    // once on mount despite the non-empty dependency array.
  }, [profileService, setDefaultTheme]);

  useEffect(() => {
    setCanonicalUrl(window.location.href);
  }, []);

  // Fire view tracking once per session after profile data is available
  useEffect(() => {
    if (data?.profile?.id) {
      trackPortfolioView(data.profile.id);
    }
  }, [data?.profile?.id]);

  const navItems = useMemo(() => generateNavItems(data), [data]);

  const seoData = useMemo(() => {
    const fullName = data?.profile?.fullName || "Portfolio";
    const title = data?.profile?.title || "Full Stack Developer";
    const skills = data?.skills?.map(s => s.logoName).slice(0, 10).join(", ");
    const meta = data?.seoMeta;

    const defaultTitle = `${fullName} | ${title}`;
    const defaultDescription = data?.profile?.aboutMe
      ? data.profile.aboutMe.substring(0, 155) + "..."
      : `Professional portfolio of ${fullName}, a ${title} specializing in modern web technologies.`;
    const defaultKeywords = `${fullName}, ${title}, ${skills}, web development, portfolio, software engineer`;

    const resolvedTitle = meta?.title || defaultTitle;
    const resolvedDescription = meta?.description || defaultDescription;
    const resolvedImage = meta?.ogImageUrl || data?.profile?.profileImageUrl || "/og-image.jpg";
    const resolvedCanonical = meta?.canonicalUrl || canonicalUrl;
    const robots = `${meta?.indexable !== false ? "index" : "noindex"}, ${meta?.followLinks !== false ? "follow" : "nofollow"}`;

    return {
      title: resolvedTitle,
      description: resolvedDescription,
      keywords: meta?.keywords?.join(", ") || defaultKeywords,
      ogTitle: meta?.ogTitle || resolvedTitle,
      ogDescription: meta?.ogDescription || resolvedDescription,
      image: resolvedImage,
      author: fullName,
      siteUrl: resolvedCanonical,
      robots,
    };
  }, [data, canonicalUrl]);

  const jsonLd = useMemo(() => {
    if (!data?.profile) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": data.profile.fullName,
      "jobTitle": data.profile.title,
      "url": canonicalUrl,
      "image": data.profile.profileImageUrl,
      "sameAs": data.socialLinks.map(l => l.url),
      "description": data.profile.aboutMe,
      "knowsAbout": data.skills.map(s => s.logoName)
    };
  }, [data, canonicalUrl]);

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
            Loading portfolio...
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

  // Computed once so every template applies identical show/hide-by-data-presence
  // rules by construction, rather than each template re-deriving this itself.
  const visibleSections: VisibleSections = {
    about: !!profile.aboutMe,
    services: (data.services?.length ?? 0) > 0,
    skills: data.skills.length > 0,
    experience: data.experiences.length > 0,
    projects: data.projects.length > 0,
    achievements: activeAchievements.length > 0,
    certifications: activeCertifications.length > 0,
    education: data.educations.length > 0,
    testimonials: activeTestimonials.length > 0,
    languages: (data.languages?.length ?? 0) > 0,
    publications: (data.publications?.length ?? 0) > 0,
    github: !!data.githubStats,
  };

  const TemplateComponent = TEMPLATE_MAP[(data.templateKey as keyof typeof TEMPLATE_MAP) ?? "CLASSIC"] ?? ClassicTemplate;

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="author" content={seoData.author} />
        <meta name="robots" content={seoData.robots} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:url" content={seoData.siteUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.ogTitle} />
        <meta name="twitter:description" content={seoData.ogDescription} />
        <meta name="twitter:image" content={seoData.image} />

        {seoData.siteUrl && <link rel="canonical" href={seoData.siteUrl} />}

        {profile.logoUrl && (
          <>
            <link rel="icon" href={profile.logoUrl} />
            <link rel="apple-touch-icon" href={profile.logoUrl} />
          </>
        )}

        {data?.profile?.profileImageUrl && (
          <link
            rel="preload"
            as="image"
            href={getOptimizedImageUrl(data.profile.profileImageUrl, { width: 800 })}
            fetchPriority="high"
          />
        )}

        {jsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </script>
        )}
      </Helmet>

      <Suspense fallback={null}>
        <TemplateComponent
          profile={profile}
          data={data}
          navItems={navItems}
          visibleSections={visibleSections}
          displayExperience={displayExperience}
          totalProjects={totalProjects}
          activeSocialLinks={activeSocialLinks}
          activeTestimonials={activeTestimonials}
          activeAchievements={activeAchievements}
          activeCertifications={activeCertifications}
        />
      </Suspense>
    </>
  );
};

export default Index;