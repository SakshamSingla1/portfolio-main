import React, { memo, useMemo, useState } from "react";
import { useColors, gradients } from "../../utils/theme";
import { toTitleCase } from "../../utils/helper";
import { type ProjectResponse } from "../../utils/types";
import { useIsMobile } from "../../hooks/useIsMobile";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";
import FullscreenImageViewer from "../atoms/FullScreenImagePreviewer/FullScreenImagePreviewer";
import ImageCarousel from "../molecules/ImageCarousel/ImageCarousel";
import { FaGithub } from "react-icons/fa";

interface ProjectCardProps {
  project: ProjectResponse;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const colors = useColors();
  const g = gradients(colors);
  const isMobile = useIsMobile();
  const [preview, setPreview] = useState<string | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const durationText = useMemo(() => {
    const start = formatDate(project.projectStartDate);
    const end = project.projectEndDate
      ? formatDate(project.projectEndDate)
      : "Present";
    return `${start} – ${end}`;
  }, [project.projectStartDate, project.projectEndDate]);

  return (
    <>
      <div className="relative rounded-3xl p-[1px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div
          className="absolute inset-0 rounded-3xl opacity-60"
          style={{ background: g.cardBorderGradient }}
        />

        <div
          className={`relative rounded-3xl flex flex-col ${
            isMobile ? "gap-6" : "gap-7"
          }`}
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
              timeline={durationText}
              skills={project.skills}
              link={project.projectLink}
              height={300}
              onImageClick={(url) => setPreview(url)}
            />
          )}

          {project.githubRepositories?.length > 0 && (
            <div
              className="mx-6 rounded-2xl p-5"
              style={{
                backgroundColor: `${colors.neutral800}CC`,
                backdropFilter: "blur(8px)",
                border: `1px solid ${colors.accent500}22`,
              }}
            >
              <div
                className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight"
                style={{ color: colors.accent400 }}
              >
                <FaGithub size={18} />
                GitHub Repositories
              </div>

              <div className="flex flex-wrap gap-3">
                {project.githubRepositories.map((repo) => {
                  const repoName = repo.split("/").pop();
                  return (
                    <a
                      key={repo}
                      href={repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-transform duration-200 hover:scale-105"
                      style={{
                        backgroundColor: `${colors.neutral900}AA`,
                        color: colors.neutral200,
                        border: `1px solid ${colors.accent500}33`,
                      }}
                    >
                      <FaGithub size={14} />
                      {repoName}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {project.projectDescription && (
            <div
              className={`mx-6 mb-6 rounded-2xl ${
                isMobile ? "p-5" : "p-6"
              } text-[15px] md:text-[16px] leading-relaxed`}
              style={{
                backgroundColor: `${colors.neutral800}CC`,
                backdropFilter: "blur(8px)",
                border: `1px solid ${colors.accent500}22`,
                color: colors.neutral200,
              }}
            >
              <ReadMoreText
                text={project.projectDescription}
                limit={200}
                mobileLimit={150}
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