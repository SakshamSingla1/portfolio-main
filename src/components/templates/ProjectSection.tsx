import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Github, Calendar, ArrowUpRight, Lightbulb, Target, TrendingUp } from "lucide-react";
import { SectionHeading } from "../molecules/SectionHeading/SectionHeading";
import { FadeInView } from "../molecules/FadeInView/FadeInView";
import { useColors, gradients } from "../../utils/theme";
import type { ProjectResponse } from "../../utils/types";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";

interface Props {
  projects: ProjectResponse[];
}

const ImageCarousel = ({ images }: { images: { url: string }[] }) => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const colors = useColors();

  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next, images.length]);

  if (images.length === 0) return null;

  return (
    <div
      className="relative group aspect-video overflow-hidden rounded-xl"
      style={{ backgroundColor: `${colors.neutral800}80` }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current].url}
          alt={`Project image ${current + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />

      <div
        className="absolute top-3 right-3 px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-mono"
        style={{ backgroundColor: `${colors.neutral900}B3`, color: colors.neutral300, border: `1px solid ${colors.neutral700}33` }}
      >
        {current + 1}/{images.length}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ backgroundColor: `${colors.neutral900}B3`, color: colors.neutral200, border: `1px solid ${colors.neutral700}33` }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ backgroundColor: `${colors.neutral900}B3`, color: colors.neutral200, border: `1px solid ${colors.neutral700}33` }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className="h-1 rounded-full transition-all duration-400"
                style={{
                  backgroundColor: idx === current ? colors.primary400 : `${colors.neutral200}33`,
                  width: idx === current ? "1.5rem" : "0.375rem",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const formatDate = (d: string) => {
  if (!d) return "Present";  // Handle null/undefined
  
  const [y, m] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1]} ${y}`;
};

export const ProjectsSection = ({ projects }: Props) => {
  const colors = useColors();
  const g = gradients(colors);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="projects" className="section-container">
      <SectionHeading title="Featured Projects" subtitle="A showcase of my recent work and side projects" />
      <div className="space-y-8">
        {projects.map((project, i) => (
          <FadeInView key={project.id} delay={i * 0.12}>
            <motion.div
              layout
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card-premium overflow-hidden group"
            >
              <div className={`grid md:grid-cols-2 gap-0 ${i % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                <div className={`p-4 ${i % 2 === 1 ? 'md:col-start-2' : ''}`}>
                  <ImageCarousel images={project.projectImages} />
                </div>
                <div className={`p-6 md:p-8 flex flex-col justify-between ${i % 2 === 1 ? 'md:col-start-1' : ''}`}>
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: project.workStatus === "COMPLETED" ? `${colors.success500}10` : `${colors.warning500}10`,
                          color: project.workStatus === "COMPLETED" ? colors.success400 : colors.warning400,
                          border: `1px solid ${project.workStatus === "COMPLETED" ? colors.success500 : colors.warning500}20`,
                        }}
                      >
                        {project.workStatus === "COMPLETED" ? "✓ Completed" : "◎ In Progress"}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-mono" style={{ color: `${colors.neutral500}B3` }}>
                        <Calendar className="w-3 h-3" />
                        {formatDate(project.projectStartDate)} — {formatDate(project.projectEndDate)}
                      </span>
                    </div>

                    <h3 className="font-display text-xl md:text-2xl font-bold mb-3" style={{ color: colors.neutral100 }}>
                      {project.projectName}
                    </h3>
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: `${colors.neutral400}CC` }}>
                      <ReadMoreText text={project.projectDescription || ""} limit={100} mobileLimit={50} />
                    </p>

                    {/* Case study toggle */}
                    <motion.button
                      onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                      className="text-xs font-medium mb-4 flex items-center gap-1.5 transition-colors"
                      style={{ color: colors.primary400 }}
                      whileHover={{ x: 2 }}
                    >
                      {expandedId === project.id ? "Hide details" : "View case study"}
                      <motion.span animate={{ rotate: expandedId === project.id ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ArrowUpRight className="w-3 h-3" />
                      </motion.span>
                    </motion.button>

                    <AnimatePresence>
                      {expandedId === project.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-3 gap-2 mb-5">
                            {[
                              { icon: Target, label: "Problem", desc: "Complex monitoring needs", color: colors.error400 },
                              { icon: Lightbulb, label: "Solution", desc: "Real-time dashboard", color: colors.primary400 },
                              { icon: TrendingUp, label: "Impact", desc: "60% faster insights", color: colors.success400 },
                            ].map((item) => (
                              <div
                                key={item.label}
                                className="p-3 rounded-xl text-center"
                                style={{ backgroundColor: `${item.color}08`, border: `1px solid ${item.color}15` }}
                              >
                                <item.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: item.color }} />
                                <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: item.color }}>{item.label}</p>
                                <p className="text-[10px]" style={{ color: `${colors.neutral400}CC` }}>{item.desc}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.skills.map((s) => (
                        <motion.span
                          key={s.id}
                          whileHover={{ scale: 1.05 }}
                          className="text-[11px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 cursor-default"
                          style={{
                            backgroundColor: `${colors.primary500}0A`,
                            color: `${colors.primary400}CC`,
                            border: `1px solid ${colors.primary500}15`,
                          }}
                        >
                          <img src={s.logoUrl} alt={s.logoName} className="w-3 h-3" />
                          {s.logoName}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5">
                    {project.projectLink && (
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        href={project.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-white transition-all"
                        style={{ background: g.ctaGradient }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </motion.a>
                    )}
                    {project.githubRepositories?.[0] && (
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        href={project.githubRepositories[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold transition-all"
                        style={{
                          border: `1px solid ${colors.primary500}33`,
                          color: colors.primary400,
                          backgroundColor: `${colors.primary500}08`,
                        }}
                      >
                        <Github className="w-3.5 h-3.5" /> Source
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </FadeInView>
        ))}
      </div>
    </section>
  );
};
