import React, { memo, useMemo, useState } from "react";
import {
    FiFolder,
    FiCalendar,
    FiExternalLink,
    FiChevronDown,
    FiTool,
} from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { sanitizeHtml, toTitleCase } from "../../utils/helper";
import { type ProjectResponse } from "../../utils/types";

interface ProjectCardProps {
    project: ProjectResponse;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const colors = useColors();
    const g = gradients(colors);
    const [open, setOpen] = useState(false);

    const duration = useMemo(
        () => `${project.projectStartDate} – ${project.projectEndDate}`,
        [project.projectStartDate, project.projectEndDate]
    );

    return (
        <article className="relative group rounded-3xl p-[1px]">
            <div className="absolute inset-0 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ background: g.cardBorderGradient }} />

            <div className="relative rounded-3xl p-7 flex flex-col gap-6 transition-all duration-500 group-hover:-translate-y-1"
                style={{ backgroundColor: colors.neutral900, boxShadow: g.hoverGlowSoft }}>

                <header className="flex gap-5">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
                        style={{ background: g.iconGradient }}>
                        <FiFolder size={24} />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold" style={{ color: colors.neutral50 }}>
                            {project.projectName}
                        </h2>
                        <span className="text-sm" style={{ color: colors.neutral400 }}>
                            {toTitleCase(project.workStatus)}
                        </span>
                    </div>
                </header>

                <div className="h-px w-full" style={{ background: g.dividerGradient }} />

                <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <FiCalendar size={14} style={{ color: colors.accent400 }} />
                        <span style={{ color: colors.neutral200 }}>{duration}</span>
                    </div>

                    {project.skills.length > 0 && (
                        <div className="flex items-center gap-2">
                            <FiTool size={14} style={{ color: colors.accent400 }} />
                            <div className="flex flex-wrap items-center gap-2">
                                {project.skills.map(skill => (
                                    <span
                                        key={skill.logoName}
                                        className=" flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                                        style={{
                                            backgroundColor: colors.neutral800,
                                            color: colors.neutral200,
                                            border: `1px solid ${colors.accent500}33`,
                                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
                                        }}
                                    >
                                        <img
                                            src={skill.logoUrl}
                                            alt={skill.logoName}
                                            className="h-4 w-4 object-contain"
                                        />
                                        {skill.logoName}
                                    </span>
                                ))}
                            </div>

                        </div>
                    )}
                </div>

                {project.projectDescription && (
                    <section className="flex flex-col gap-3">
                        <button onClick={() => setOpen(v => !v)} className="flex justify-between">
                            <span className="text-xs uppercase tracking-widest font-semibold"
                                style={{ color: colors.accent400 }}>
                                Project Overview
                            </span>
                            <FiChevronDown
                                className={`transition-transform duration-500 ${open ? "rotate-180" : ""}`}
                                style={{ color: colors.accent400 }}
                            />
                        </button>

                        <div className="overflow-hidden transition-all duration-500"
                            style={{ maxHeight: open ? "360px" : "0", opacity: open ? 1 : 0 }}>
                            <div className="mt-2 p-5 rounded-2xl text-sm"
                                style={{
                                    backgroundColor: colors.neutral800,
                                    border: `1px solid ${colors.accent500}33`,
                                    color: colors.neutral200,
                                    boxShadow: g.hoverGlowInset,
                                }}>
                                {sanitizeHtml(project.projectDescription)}
                            </div>
                        </div>
                    </section>
                )}

                {project.projectLink && (
                    <a href={project.projectLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: colors.accent400 }}>
                        <FiExternalLink /> View Project
                    </a>
                )}
            </div>
        </article>
    );
};

export default memo(ProjectCard);
