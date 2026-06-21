import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GitHubCalendar from "react-github-calendar";
import { FiStar, FiGitBranch, FiUsers, FiCode, FiExternalLink, FiGitPullRequest, FiBook } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { useColors } from "../../utils/theme";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { SocialLinkPlatform } from "../../utils/constants";
import type { SocialLinkResponse } from "../../utils/types";

interface GitHubUser {
  public_repos: number;
  followers: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
}

interface Props {
  socialLinks: SocialLinkResponse[];
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Ruby: "#701516",
  PHP: "#4F5D95",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Dart: "#00B4AB",
};

const GitHubSection = ({ socialLinks }: Props) => {
  const colors = useColors();
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [externalPRs, setExternalPRs] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const githubLink = socialLinks.find((l) => l.platform === SocialLinkPlatform.GITHUB);
  const username = githubLink?.url
    ? githubLink.url
        .replace(/^https?:\/\/(www\.)?github\.com\/?/, "")
        .replace(/\/+$/, "")
        .split("/")[0]
    : null;

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const [userRes, reposRes, prsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6&type=owner`),
          fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr+is:merged+-user:${username}&per_page=1`),
        ]);

        const [userData, reposData, prsData] = await Promise.all([
          userRes.json(),
          reposRes.json(),
          prsRes.json(),
        ]);

        setUser(userData);
        const owned: GitHubRepo[] = Array.isArray(reposData) ? reposData.filter((r) => !r.fork) : [];
        setRepos(owned);
        setTotalStars(owned.reduce((sum, r) => sum + (r.stargazers_count || 0), 0));
        setExternalPRs(typeof prsData?.total_count === "number" ? prsData.total_count : null);
      } catch {
        // silently fail — section simply won't show stats
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [username]);

  if (!username) return null;

  const stats = [
    { icon: <FiBook />, label: "Public Repos", value: user?.public_repos },
    { icon: <FiStar />, label: "Total Stars", value: totalStars },
    { icon: <FiGitPullRequest />, label: "PRs Merged", value: externalPRs },
    { icon: <FiUsers />, label: "Followers", value: user?.followers },
  ];

  return (
    <section id="open-source" className="py-8">
      <SectionHeading
        title="Open Source"
        subtitle={`Contributions & activity from @${username}`}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, i) => (
          <FadeInView key={stat.label} delay={i * 0.07}>
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-xl p-5 text-center relative overflow-hidden"
              style={{
                background: `${colors.neutral800}80`,
                border: `1px solid ${colors.neutral700}40`,
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
                {loading ? (
                  <span className="inline-block w-10 h-6 rounded animate-pulse" style={{ background: `${colors.neutral700}60` }} />
                ) : (
                  stat.value ?? "—"
                )}
              </div>
              <div className="text-xs mt-1" style={{ color: `${colors.neutral400}CC` }}>
                {stat.label}
              </div>
            </motion.div>
          </FadeInView>
        ))}
      </div>

      {/* Contribution calendar */}
      <FadeInView delay={0.1}>
        <div
          className="rounded-2xl p-6 md:p-8 mb-12"
          style={{
            background: `${colors.neutral800}60`,
            border: `1px solid ${colors.neutral700}40`,
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <FaGithub style={{ color: colors.primary400 }} className="text-lg" />
            <span className="text-sm font-mono" style={{ color: `${colors.neutral400}BB` }}>
              @{username} · contribution activity
            </span>
          </div>
          <div className="overflow-x-auto">
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
          </div>
        </div>
      </FadeInView>

      {/* Top repos */}
      {repos.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-sm font-mono uppercase"
              style={{ color: `${colors.primary400}90`, letterSpacing: "0.3em" }}
            >
              // top_repositories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo, i) => (
              <FadeInView key={repo.id} delay={i * 0.06}>
                <motion.a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4 }}
                  className="flex flex-col rounded-xl p-5 h-full group"
                  style={{
                    background: `${colors.neutral800}70`,
                    border: `1px solid ${colors.neutral700}30`,
                    textDecoration: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = `${colors.primary500}50`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = `${colors.neutral700}30`)
                  }
                >
                  {/* Repo name */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FiCode
                        className="shrink-0"
                        style={{ color: colors.primary400 }}
                      />
                      <span
                        className="font-semibold text-sm truncate"
                        style={{ color: colors.primary400 }}
                      >
                        {repo.name}
                      </span>
                    </div>
                    <FiExternalLink
                      className="shrink-0 opacity-0 group-hover:opacity-60 transition-opacity"
                      style={{ color: colors.neutral400 }}
                    />
                  </div>

                  {/* Description */}
                  <p
                    className="text-xs mb-4 leading-relaxed flex-1"
                    style={{
                      color: `${colors.neutral400}CC`,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {repo.description || "No description provided."}
                  </p>

                  {/* Meta: language · stars · forks */}
                  <div className="flex items-center gap-4 mt-auto flex-wrap">
                    {repo.language && (
                      <span
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: `${colors.neutral400}BB` }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            background: LANG_COLORS[repo.language] || colors.accent500,
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span
                      className="flex items-center gap-1 text-xs"
                      style={{ color: `${colors.neutral400}BB` }}
                    >
                      <FiStar className="text-[11px]" />
                      {repo.stargazers_count}
                    </span>
                    <span
                      className="flex items-center gap-1 text-xs"
                      style={{ color: `${colors.neutral400}BB` }}
                    >
                      <FiGitBranch className="text-[11px]" />
                      {repo.forks_count}
                    </span>
                  </div>
                </motion.a>
              </FadeInView>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default GitHubSection;
