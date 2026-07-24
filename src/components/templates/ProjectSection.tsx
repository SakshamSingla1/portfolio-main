import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import type { ProjectResponse } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiExternalLink, FiGithub, FiChevronLeft, FiChevronRight, FiCalendar, FiMaximize2, FiX, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useColors } from "../../utils/theme";
import React from "react";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";
import { formatDate, toTitleCase, getOptimizedImageUrl } from "../../utils/helper";
import type { Colors } from "../../utils/theme";

interface ProjectsSectionProps {
  projects: ProjectResponse[];
}

const ProjectCard = React.memo(({ project, idx, colors }: {
  project: ProjectResponse;
  idx: number;
  colors: Colors;
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const images = project.projectImages;
  const skills = project.skills || [];
  const displaySkills = skills.slice(0, 2);
  const moreSkills = skills.slice(2);

  // Mouse-tracking tilt + cursor-following spotlight. Percent-based (0-1) so the tilt
  // direction and glow position both derive from the same pointer reading.
  const mouseXPercent = useMotionValue(0.5);
  const mouseYPercent = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseYPercent, [0, 1], [5, -5]), { stiffness: 250, damping: 25 });
  const rotateY = useSpring(useTransform(mouseXPercent, [0, 1], [-5, 5]), { stiffness: 250, damping: 25 });
  const glowX = useTransform(mouseXPercent, (v) => `${v * 100}%`);
  const glowY = useTransform(mouseYPercent, (v) => `${v * 100}%`);
  const spotlightBackground = useMotionTemplate`radial-gradient(600px circle at ${glowX} ${glowY}, ${colors.primary500}18, transparent 65%)`;

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseXPercent.set((e.clientX - rect.left) / rect.width);
    mouseYPercent.set((e.clientY - rect.top) / rect.height);
  };

  const resetCardTilt = () => {
    mouseXPercent.set(0.5);
    mouseYPercent.set(0.5);
  };

  const statusColor = project.workStatus === "COMPLETED" ? "#10B981" : "#F59E0B";
  const duration = `${formatDate(project.projectStartDate)} — ${formatDate(project.projectEndDate)}`;

  const nextImage = () =>
    setCurrentImage((c) => (c + 1) % images.length);

  const prevImage = () =>
    setCurrentImage((c) => (c - 1 + images.length) % images.length);

  return (
    <FadeInView delay={idx * 0.15}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={resetCardTilt}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        className={`glass-card overflow-hidden group flex flex-col ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
      >
        <div className="card-glow w-72 h-72 -top-20 -left-20" />
        <motion.div
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: spotlightBackground }}
        />

        {images.length > 0 && (
          <div className="relative h-48 sm:h-[260px] lg:h-auto lg:min-h-[320px] lg:w-[44%] overflow-hidden shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                className="relative w-full h-full group/img overflow-hidden"
                onClick={() => {
                  setPreviewIndex(currentImage);
                  setIsPreviewOpen(true);
                }}
              >
                  <motion.img
                    src={getOptimizedImageUrl(images[currentImage].url, { width: 1000 })}
                    alt={project.projectName}
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{
                      opacity: 1
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full object-cover origin-center"
                    loading="lazy"
                  />

                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"
                >
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transform translate-z-20">
                    <FiMaximize2 className="text-white w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />

            <div className="absolute top-4 left-4 z-20">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border backdrop-blur-md"
                style={{
                  background: `${statusColor}20`,
                  borderColor: `${statusColor}40`,
                  color: statusColor,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: statusColor }} />
                {toTitleCase(project.workStatus)}
              </div>
            </div>

            <div className="absolute top-4 right-4 z-20">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border backdrop-blur-md"
                style={{
                  background: `${colors.neutral900}60`,
                  borderColor: `${colors.neutral700}40`,
                  color: colors.neutral100
                }}>
                <FiCalendar size={12} className="text-primary-400" />
                {duration}
              </div>
            </div>

            {skills.length > 0 && (
              <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-1.5 max-w-[70%] items-center">
                {displaySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono border backdrop-blur-md transition-all duration-300"
                    style={{
                      background: `${colors.neutral900}80`,
                      borderColor: `${colors.neutral700}40`,
                      color: colors.neutral200,
                    }}
                  >
                    <img src={skill.logoUrl} alt={skill.logoName} className="w-3 h-3 object-contain" />
                    {skill.logoName}
                  </div>
                ))}
                {moreSkills.length > 0 && (
                  <div className="relative flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMoreSkills(!showMoreSkills);
                      }}
                      onMouseEnter={() => setShowMoreSkills(true)}
                      onMouseLeave={() => setShowMoreSkills(false)}
                      className="px-2 py-0.5 rounded-full text-[9px] font-mono border backdrop-blur-md transition-all duration-300"
                      aria-label="View technical stack"
                      style={{
                        background: showMoreSkills ? `${colors.primary500}40` : `${colors.primary500}20`,
                        borderColor: showMoreSkills ? colors.primary500 : `${colors.primary500}40`,
                        color: showMoreSkills ? colors.neutral50 : colors.primary300
                      }}>
                      +{moreSkills.length}
                    </button>
                  </div>
                )}
              </div>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 z-20">
                {images.map((_, i) => (
                  <motion.button
                    key={i}
                    layout
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage(i);
                    }}
                    aria-label={`Go to image ${i + 1}`}
                    className="h-2.5 rounded-full"
                    animate={{
                      width: i === currentImage ? 24 : 10,
                      backgroundColor: i === currentImage ? colors.primary500 : "rgba(255, 255, 255, 0.4)"
                    }}
                    whileHover={{
                      backgroundColor: i === currentImage ? colors.primary500 : "rgba(255, 255, 255, 0.7)"
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                ))}
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
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
                  aria-label="Next image"
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

        <div className="p-6 md:p-8 lg:flex-1 flex flex-col justify-between relative z-10 overflow-hidden">
          <div className="relative h-full">
            <span
              className="absolute -top-2 right-0 font-display font-black leading-none select-none pointer-events-none"
              style={{ fontSize: "4.5rem", color: `${colors.primary500}0d` }}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>

            <h3
              className="relative text-2xl font-bold mb-3 transition-all duration-300 bg-clip-text group-hover:text-transparent w-fit text-(--title-color)"
              style={{
                "--title-color": colors.neutral50,
                backgroundImage: `linear-gradient(135deg, ${colors.primary300}, ${colors.accent400})`,
              } as React.CSSProperties}
            >
              {project.projectName}
            </h3>

            <ReadMoreText
              text={project.projectDescription || ""}
              limit={150}
              mobileLimit={80}
              className="text-sm leading-relaxed border-l-2 pl-4 mb-6"
            />

            <AnimatePresence>
              {showMoreSkills && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute inset-0 z-20 backdrop-blur-3xl p-4 rounded-xl flex flex-col border"
                  style={{
                    background: `${colors.neutral900}f0`,
                    borderColor: `${colors.primary500}30`
                  }}
                >
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-400">Tech Stack</span>
                    <button
                      onClick={() => setShowMoreSkills(false)}
                      aria-label="Close tech stack view"
                      className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 overflow-y-auto no-scrollbar pr-1">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300"
                        style={{
                          background: `${colors.neutral800}80`,
                          borderColor: `${colors.neutral700}40`,
                          color: colors.neutral200,
                        }}
                      >
                        <img src={skill.logoUrl} alt={skill.logoName} className="w-4 h-4 object-contain" />
                        <span className="text-[10px] font-medium">{skill.logoName}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: `${colors.neutral700}30` }}>
            <div className="flex flex-wrap items-center gap-3">
              {project.projectLink && (
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-bold tracking-tight rounded-full px-3.5 py-2 border transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    color: colors.primary300,
                    background: `${colors.primary500}12`,
                    borderColor: `${colors.primary500}30`,
                  }}
                >
                  <FiExternalLink size={15} />
                  <span>Live Demo</span>
                </a>
              )}

              {project.githubRepositories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="p-2 rounded-full" style={{ background: `${colors.neutral700}30` }}>
                    <FiGithub size={15} style={{ color: colors.neutral400 }} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.githubRepositories.map((repo, i) => (
                      <a
                        key={i}
                        href={repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono px-2.5 py-1.5 rounded-full border transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                          background: `${colors.neutral700}30`,
                          borderColor: `${colors.neutral700}50`,
                          color: colors.neutral300,
                        }}
                      >
                        {repo.split("/").pop()}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-md"
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsPreviewOpen(false);
              if (e.key === "ArrowLeft") setPreviewIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
              if (e.key === "ArrowRight") setPreviewIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
            }}
            tabIndex={0}
          >
            <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-[110] bg-gradient-to-b from-black/50 to-transparent">
              <div className="flex flex-col">
                <h4 className="text-white font-bold text-lg">{project.projectName}</h4>
                <p className="text-white/50 text-xs font-mono">Image {previewIndex + 1} of {images.length}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.open(images[previewIndex].url, '_blank')}
                  className="p-2.5 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all border border-white/5"
                  title="Open original"
                  aria-label="Open original image in new tab"
                >
                  <FiExternalLink size={20} />
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
                  aria-label="Close image preview"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-[110] p-4 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all border border-white/5 backdrop-blur-md"
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
                  }}
                >
                  <FiArrowLeft size={28} />
                </button>
                <button
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] p-4 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all border border-white/5 backdrop-blur-md"
                  aria-label="Next image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
                  }}
                >
                  <FiArrowRight size={28} />
                </button>
              </>
            )}

            <div
              className="relative w-full h-full flex items-center justify-center p-4 md:p-20 overflow-hidden"
              onClick={() => setIsPreviewOpen(false)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={previewIndex}
                  src={getOptimizedImageUrl(images[previewIndex].url, { width: 1600 })}
                  alt="Project Preview"
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 1.1, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] select-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[110] flex gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl max-w-[90vw] overflow-x-auto no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewIndex(i);
                    }}
                    aria-label={`View image ${i + 1}`}
                    className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${i === previewIndex ? "border-primary-500 scale-110 shadow-lg shadow-primary-500/20" : "border-transparent opacity-50 hover:opacity-100"}`}
                  >
                    <img src={getOptimizedImageUrl(img.url, { width: 200, height: 150 })} className="w-full h-full object-cover" alt={`Thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </FadeInView>
  );
});

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const colors = useColors();

  return (
    <section id="projects" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Projects" subtitle="Things I've built and shipped" />

        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              idx={idx}
              colors={colors}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ProjectsSection);