import React, { memo, useMemo, useState } from "react";
import { useColors, gradients } from "../../utils/theme";
import { sanitizeHtml, toTitleCase } from "../../utils/helper";
import { type ProjectResponse } from "../../utils/types";
import { useIsMobile } from "../../hooks/useIsMobile";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";
import FullscreenImageViewer from "../atoms/FullScreenImagePreviewer/FullScreenImagePreviewer";
import ImageCarousel from "../molecules/ImageCarousel/ImageCarousel";

interface ProjectCardProps {
    project: ProjectResponse;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const colors = useColors();
    const g = gradients(colors);
    const isMobile = useIsMobile();

    const [preview, setPreview] = useState<string | null>(null);

    const duration = useMemo(
        () =>
            project.projectEndDate
                ? `${project.projectStartDate} – ${project.projectEndDate}`
                : `${project.projectStartDate} – Present`,
        [project.projectStartDate, project.projectEndDate]
    );

    return (
        <>
            <div className="relative rounded-3xl p-[1px]">
                <div
                    className="absolute inset-0 rounded-3xl opacity-60"
                    style={{ background: g.cardBorderGradient }}
                />
                <div
                    className={`relative rounded-3xl flex flex-col ${isMobile ? "gap-5" : "gap-6"}`}
                    style={{
                        backgroundColor: colors.neutral900,
                        boxShadow: g.hoverGlowSoft,
                    }}
                >
                    {project.projectImages?.length > 0 && (
                        <ImageCarousel
                            images={project.projectImages}
                            title={project.projectName}
                            status={toTitleCase(project.workStatus)}
                            timeline={duration}
                            skills={project.skills}
                            link={project.projectLink}
                            height={isMobile ? 220 : 280}
                            onImageClick={url => setPreview(url)}
                        />
                    )}
                    {project.projectDescription && (
                        <div className={`mx-4 mb-4 rounded-2xl ${isMobile ? "p-4" : "p-5"} text-sm`}
                            style={{
                                backgroundColor: colors.neutral800,
                                border: `1px solid ${colors.accent500}22`,
                                color: colors.neutral200,
                            }}
                        >
                            <ReadMoreText
                                text={sanitizeHtml(project.projectDescription)}
                                limit={160}
                                mobileLimit={110}
                            />
                        </div>
                    )}
                </div>
            </div>

            {preview && (
                <FullscreenImageViewer
                    open
                    imageUrl={preview}
                    alt={project.projectName}
                    onClose={() => setPreview(null)}
                />
            )}
        </>
    );
};

export default memo(ProjectCard);
