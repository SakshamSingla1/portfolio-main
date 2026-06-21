import { motion } from "framer-motion";
import GitHubCalendar from "react-github-calendar";
import { FiStar, FiUsers, FiGitPullRequest, FiBook } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { useColors } from "../../utils/theme";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import type { GitHubStats } from "../../utils/types";

interface Props {
  githubStats: GitHubStats;
}

const GitHubSection = ({ githubStats }: Props) => {
  const colors = useColors();
  const { username, publicRepos, followers, totalStars, externalPRs } = githubStats;

  const stats = [
    { icon: <FiBook />, label: "Public Repos", value: publicRepos },
    { icon: <FiStar />, label: "Total Stars", value: totalStars },
    { icon: <FiGitPullRequest />, label: "PRs Merged", value: externalPRs ?? "—" },
    { icon: <FiUsers />, label: "Followers", value: followers },
  ];

  return (
    <section id="open-source" className="py-8">
      <SectionHeading
        title="Github"
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
                {stat.value}
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
          className="rounded-2xl p-6 md:p-8"
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
    </section>
  );
};

export default GitHubSection;
