import { lazy, Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiStar, FiUsers, FiGitPullRequest, FiBook, FiGitBranch, FiExternalLink } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { useColors } from "../../utils/theme";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import type { GitHubStats, GithubRepoResponse } from "../../utils/types";

const GitHubCalendar = lazy(() => import("react-github-calendar"));

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f7df1e", Java: "#b07219",
  Python: "#3572A5", Go: "#00ADD8", Rust: "#dea584",
  "C++": "#f34b7d", "C#": "#178600", Ruby: "#701516",
  Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
};

interface Props {
  githubStats: GitHubStats;
  githubRepos?: GithubRepoResponse[];
}

const GitHubSection = ({ githubStats, githubRepos = [] }: Props) => {
  const colors = useColors();
  const { username, publicRepos, followers, totalStars, externalPRs } = githubStats;
  const { ref: calendarRef, inView: calendarInView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  const visibleRepos = useMemo(
    () =>
      githubRepos
        .filter(r => r.isVisible)
        .sort((a, b) => (Number(b.isPinned) - Number(a.isPinned)) || (a.sortOrder - b.sortOrder))
        .slice(0, 6),
    [githubRepos]
  );
  const repoGridColsClass =
    visibleRepos.length === 1 ? "sm:grid-cols-1" :
    visibleRepos.length === 2 ? "sm:grid-cols-2" :
    "sm:grid-cols-2 lg:grid-cols-3";
  const repoGridWidthClass = visibleRepos.length < 3 ? "max-w-4xl mx-auto" : "";

  const stats = useMemo(
    () => [
      { icon: <FiBook />, label: "Public Repos", value: publicRepos },
      { icon: <FiStar />, label: "Total Stars", value: totalStars },
      { icon: <FiGitPullRequest />, label: "PRs Merged", value: externalPRs ?? "—" },
      { icon: <FiUsers />, label: "Followers", value: followers },
    ],
    [publicRepos, totalStars, externalPRs, followers]
  );

  return (
    <section id="open-source" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="GitHub"
          subtitle={`Contributions & activity from @${username}`}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <FadeInView key={stat.label} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="rounded-xl p-5 text-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${colors.neutral800}90, ${colors.neutral900}90)`,
                  border: `1px solid ${colors.neutral700}40`,
                  boxShadow: `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 16px 32px -24px rgba(0,0,0,0.7)`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${colors.primary500}08 0%, transparent 70%)`,
                  }}
                />
                <div className="text-xl mb-2 flex justify-center" style={{ color: colors.primary400 }}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold font-mono" style={{ color: colors.neutral100 }}>
                  {stat.value}
                </div>
                <div className="text-xs mt-1" style={{ color: `${colors.neutral400}CC` }}>
                  {stat.label}
                </div>
              </motion.div>
            </FadeInView>
          ))}
        </div>

        <FadeInView delay={0.1}>
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: `linear-gradient(145deg, ${colors.neutral800}70, ${colors.neutral900}80)`,
              border: `1px solid ${colors.neutral700}40`,
              boxShadow: `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 48px -24px rgba(0,0,0,0.65)`,
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <FaGithub style={{ color: colors.primary400 }} className="text-lg" />
                <span className="text-sm font-mono" style={{ color: `${colors.neutral400}BB` }}>
                  @{username} · contribution activity
                </span>
              </div>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit @${username} on GitHub`}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors duration-200"
                style={{
                  color: colors.primary400,
                  background: `${colors.primary500}12`,
                  border: `1px solid ${colors.primary500}28`,
                }}
              >
                View Profile <FiExternalLink size={12} />
              </a>
            </div>
            <div ref={calendarRef} className="overflow-x-auto flex justify-center" style={{ minHeight: 160 }}>
              {calendarInView && (
                <Suspense fallback={null}>
                  <GitHubCalendar
                    username={username}
                    colorScheme="dark"
                    fontSize={12}
                    blockSize={13}
                    blockMargin={4}
                    theme={{
                      dark: [
                        `${colors.neutral700}50`,
                        `${colors.primary500}35`,
                        `${colors.primary500}60`,
                        `${colors.primary500}90`,
                        colors.primary400,
                      ],
                    }}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </FadeInView>
        {visibleRepos.length > 0 && (
          <FadeInView delay={0.2}>
            <div className={`mt-8 grid ${repoGridColsClass} gap-4 ${repoGridWidthClass}`}>
              {visibleRepos.map((repo, i) => {
                const langColor = repo.language ? (LANG_COLORS[repo.language] ?? colors.primary400) : colors.neutral500;
                const href = repo.url || repo.homepage || null;
                const Wrapper = href ? motion.a : motion.div;
                return (
                  <Wrapper
                    key={repo.id}
                    {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 22 }}
                    className={`rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden ${href ? "cursor-pointer" : "cursor-default"}`}
                    style={{
                      background: `linear-gradient(145deg, ${colors.neutral800}70, ${colors.neutral900}80)`,
                      border: `1px solid ${colors.neutral700}40`,
                      boxShadow: `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 16px 32px -24px rgba(0,0,0,0.7)`,
                      textDecoration: "none",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${colors.primary500}40`;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 1px 0 0 rgba(255,255,255,0.06) inset, 0 20px 40px -20px ${colors.primary500}30`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${colors.neutral700}40`;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 16px 32px -24px rgba(0,0,0,0.7)`;
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${langColor}60, transparent)` }}
                    />
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-sm truncate" style={{ color: colors.neutral100 }}>
                        {repo.name}
                      </span>
                      {href && <FiExternalLink size={11} style={{ color: colors.neutral500, flexShrink: 0 }} />}
                    </div>

                    {repo.description && (
                      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: `${colors.neutral400}CC` }}>
                        {repo.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-auto pt-1 flex-wrap">
                      {repo.language && (
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: langColor }}>
                          <span className="w-2 h-2 rounded-full inline-block" style={{ background: langColor }} />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: `${colors.neutral400}CC` }}>
                        <FiStar size={10} /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: `${colors.neutral400}CC` }}>
                        <FiGitBranch size={10} /> {repo.forks}
                      </span>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </FadeInView>
        )}
      </div>
    </section>
  );
};

export default GitHubSection;
