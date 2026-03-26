import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProjectResponse } from "../../utils/types"; 
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiExternalLink, FiGithub, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toTitleCase } from "../../utils/helper";
import { useColors, shadows } from "../../utils/theme";
import React from "react";

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
  const images = project.projectImages;

  const nextImage = () => setCurrentImage((c) => (c + 1) % images.length);
  const prevImage = () => setCurrentImage((c) => (c - 1 + images.length) % images.length);

  return (
    <FadeInView delay={idx * 0.15}>
      <motion.div
        whileHover={{ y: -5, boxShadow: s.cardHover }}
        className="rounded-xl overflow-hidden group backdrop-blur-md transition-all duration-500 h-full"
        style={{
          background: `${colors.neutral800}60`,
          border: `1px solid ${colors.neutral700}40`,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${colors.primary500}40`; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${colors.neutral700}40`; }}
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

            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to top, ${colors.neutral800}, transparent 60%)` }}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md"
                  style={{ background: `${colors.neutral900}CC`, color: colors.neutral100 }}
                >
                  <FiChevronLeft size={16} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md"
                  style={{ background: `${colors.neutral900}CC`, color: colors.neutral100 }}
                >
                  <FiChevronRight size={16} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        background: i === currentImage ? colors.primary500 : `${colors.neutral400}50`,
                        boxShadow: i === currentImage ? `0 0 6px ${colors.primary500}60` : "none",
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-3 right-3">
              <span
                className="text-xs font-mono px-2.5 py-1 rounded-full backdrop-blur-md"
                style={{
                  color: project.workStatus === "IN_PROGRESS" ? colors.primary400 : colors.neutral300,
                  background: project.workStatus === "IN_PROGRESS" ? `${colors.primary500}20` : `${colors.neutral700}60`,
                  border: `1px solid ${project.workStatus === "IN_PROGRESS" ? colors.primary500 : colors.neutral600}30`,
                }}
              >
                {toTitleCase(project.workStatus)}
              </span>
            </div>
          </div>
        )}

        <div className="p-5 md:p-6">
          <h3 className="text-xl font-display font-bold mb-2" style={{ color: colors.neutral50 }}>
            {project.projectName}
          </h3>
          <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: colors.neutral400 }}>
            {project.projectDescription}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1.5 text-xs font-mono rounded-md px-2 py-1"
                style={{ color: colors.neutral200, background: `${colors.neutral700}50` }}
              >
                <img src={skill.logoUrl} alt={skill.logoName} className="w-3.5 h-3.5" />
                {skill.logoName}
              </span>
            ))}
          </div>

          <div
            className="flex items-center gap-4 pt-4 border-t"
            style={{ borderColor: `${colors.neutral700}30` }}
          >
            {project.projectLink && (
              <a
                href={project.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-mono transition-colors duration-300"
                style={{ color: colors.primary400 }}
                onMouseEnter={(e) => { e.currentTarget.style.color = colors.primary300; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = colors.primary400; }}
              >
                <FiExternalLink size={14} /> Live
              </a>
            )}
            {project.githubRepositories.map((repo, i) => (
              <a
                key={i}
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-mono transition-colors duration-300"
                style={{ color: colors.neutral400 }}
                onMouseEnter={(e) => { e.currentTarget.style.color = colors.neutral100; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = colors.neutral400; }}
              >
                <FiGithub size={14} /> Code
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </FadeInView>
  );
});

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
