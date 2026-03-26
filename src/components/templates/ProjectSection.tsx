import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProjectResponse } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiExternalLink, FiGithub, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useColors, shadows } from "../../utils/theme";
import React from "react";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";

interface ProjectsSectionProps {
  projects: ProjectResponse[];
}

const ProjectCard = React.memo(({ project, idx, colors, s }: {
  project: ProjectResponse;
  idx: number;
  colors: any;
  s: any;
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showRepos, setShowRepos] = useState(false);
  const repoRef = useRef<HTMLDivElement | null>(null);

  const images = project.projectImages;

  const nextImage = () =>
    setCurrentImage((c) => (c + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((c) => (c - 1 + images.length) % images.length);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (repoRef.current && !repoRef.current.contains(e.target as Node)) {
        setShowRepos(false);
      }
    };

    if (showRepos) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showRepos]);

  return (
    <FadeInView delay={idx * 0.15}>
      <motion.div
        whileHover={{ y: -5, boxShadow: s.cardHover }}
        className="rounded-xl overflow-hidden group backdrop-blur-md transition-all duration-500 h-full"
        style={{
          background: `${colors.neutral800}60`,
          border: `1px solid ${colors.neutral700}40`,
        }}
      >
        {images.length > 0 && (
          <div className="relative h-48 md:h-56 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={images[currentImage].url}
                alt={project.projectName}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                  style={{
                    background: `${colors.neutral900}CC`,
                    color: colors.neutral100,
                  }}
                >
                  <FiChevronLeft size={16} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                  style={{
                    background: `${colors.neutral900}CC`,
                    color: colors.neutral100,
                  }}
                >
                  <FiChevronRight size={16} />
                </button>
              </>
            )}
          </div>
        )}

        <div className="p-5 md:p-6">
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: colors.neutral50 }}
          >
            {project.projectName}
          </h3>

          <ReadMoreText
            text={project.projectDescription || ""}
            limit={200}
            mobileLimit={100}
            className="text-sm leading-relaxed border-l-4 pl-4 mb-4"
          />

          <div
            className="flex items-center gap-4 pt-4 border-t"
            style={{ borderColor: `${colors.neutral700}30` }}
          >
            {project.projectLink && (
              <a
                href={project.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-mono"
                style={{ color: colors.primary400 }}
              >
                <FiExternalLink size={14} /> Live
              </a>
            )}

            <div className="relative" ref={repoRef}>
              {project.githubRepositories.length === 1 ? (
                <a
                  href={project.githubRepositories[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-mono"
                  style={{ color: colors.neutral400 }}
                >
                  <FiGithub size={14} /> Code
                </a>
              ) : project.githubRepositories.length > 1 ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRepos((p) => !p);
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-mono"
                    style={{ color: colors.neutral400 }}
                  >
                    <FiGithub size={14} /> Code
                  </button>

                  <AnimatePresence>
                    {showRepos && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 5 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute left-0 top-full mt-2 w-44 rounded-lg z-50"
                        style={{
                          background: `${colors.neutral900}EE`,
                          border: `1px solid ${colors.neutral700}40`,
                        }}
                      >
                        {project.githubRepositories.map((repo, i) => (
                          <a
                            key={i}
                            href={repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-3 py-2 text-xs font-mono hover:bg-white/5"
                            style={{ color: colors.neutral200 }}
                          >
                            Repo {i + 1}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </FadeInView>
  );
}
);

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const colors = useColors();
  const s = shadows(colors);

  return (
    <section
      id="projects"
      className="section-padding relative"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Projects" subtitle="Things I've built and shipped" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx} colors={colors} s={s} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ProjectsSection);
