import React, { memo, useState } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiCalendar,
    FiGlobe,
} from "react-icons/fi";
import { useColors, gradients } from "../../../utils/theme";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface ImageCarouselProps {
    images: { url: string }[];
    title?: string;
    status?: string;
    timeline?: string;
    skills?: { logoUrl: string; logoName: string }[];
    link?: string;
    height?: number;
    onImageClick?: (url: string) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
    images,
    title,
    status,
    timeline,
    skills = [],
    link,
    height = 260,
    onImageClick,
}) => {
    const colors = useColors();
    const isMobile = useIsMobile();
    const [index, setIndex] = useState(0);
    const [openSkillDialog, setOpenSkillDialog] = useState<boolean>(false);

    if (!images?.length) return null;

    const prev = () => setIndex(i => (i === 0 ? images.length - 1 : i - 1));

    const next = () => setIndex(i => (i === images.length - 1 ? 0 : i + 1));

    const MAX_VISIBLE_SKILLS = 3;
    const visibleSkills = skills.slice(0, MAX_VISIBLE_SKILLS);
    const remainingSkills = skills.slice(MAX_VISIBLE_SKILLS);

    return (
        <div
            className="relative w-full overflow-hidden rounded-3xl"
            style={{ backgroundColor: colors.neutral900 }}
        >
            <img
                src={images[index].url}
                alt={`Preview ${index + 1}`}
                onClick={() => onImageClick?.(images[index].url)}
                className="w-full object-cover cursor-pointer transition-transform duration-700"
                loading="lazy"
                style={{
                    height: height,
                }}
            />
            <div className="absolute inset-x-0 top-0 h-24" />
            {status && (
                <div className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                        backgroundColor: `${colors.neutral900}DD`,
                        color: colors.accent400,
                    }}
                >
                    {status}
                </div>
            )}

            <div className="absolute inset-x-0 bottom-0">
                <div className="h-32" />
                <div
                    className="absolute inset-x-1 bottom-1 rounded-3xl p-4"
                    style={{
                        backgroundColor: "rgba(18,18,18,0.55)",
                        backdropFilter: "blur(2px)",
                        border: `1px solid ${colors.neutral700}`,
                    }}
                >
                    <div className="flex items-end justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            {title && (
                                <div
                                    className="font-semibold"
                                    style={{
                                        color: colors.neutral50,
                                        fontSize: isMobile ? 15 : 17,
                                    }}
                                >
                                    {title}
                                </div>
                            )}
                            {timeline && (
                                <div className="flex items-center gap-1.5 text-xs">
                                    <FiCalendar size={12} style={{ color: colors.accent400 }} />
                                    <span style={{ color: colors.neutral200 }}>
                                        {timeline}
                                    </span>
                                </div>
                            )}
                            {skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {visibleSkills.map(skill => (
                                        <div
                                            key={skill.logoName}
                                            className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                                            style={{
                                                backgroundColor: "rgba(18,18,18,0.55)",
                                                backdropFilter: "blur(2px)",
                                                color: colors.neutral200,
                                                border: `1px solid ${colors.accent500}33`,
                                            }}
                                        >
                                            <img src={skill.logoUrl} alt={skill.logoName} className="h-4 w-4" />
                                            {skill.logoName}
                                        </div>
                                    ))}

                                    {remainingSkills.length > 0 && (
                                        <button
                                            onClick={() => setOpenSkillDialog(true)}
                                            className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border"
                                            style={{
                                                backgroundColor: "rgba(18,18,18,0.55)",
                                                backdropFilter: "blur(2px)",
                                                color: colors.neutral200,
                                                border: `1px solid ${colors.accent500}33`,
                                            }}
                                        >
                                            +{remainingSkills.length} more
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        {link && (
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-semibold"
                                style={{ color: colors.accent400 }}
                            >
                                <FiGlobe size={13} />
                                Live
                            </a>
                        )}
                    </div>
                </div>
            </div>
            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2"
                        style={{
                            backgroundColor: `${colors.neutral900}CC`,
                            color: colors.neutral200,
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <FiChevronLeft size={18} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2"
                        style={{
                            backgroundColor: `${colors.neutral900}CC`,
                            color: colors.neutral200,
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <FiChevronRight size={18} />
                    </button>
                </>
            )}
            {/* Skills Dialog */}
            {openSkillDialog && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                    <div
                        className="relative rounded-4xl p-6 w-80 max-w-full"
                        style={{
                            backgroundColor: colors.neutral900,
                            border: `1px solid ${colors.neutral700}`,
                        }}
                    >
                        {/* Cross Button */}
                        <button
                            onClick={() => setOpenSkillDialog(false)}
                            className="absolute top-3 right-3 px-3.5 py-2 rounded-full hover:opacity-80"
                            style={{
                                background: gradients(colors).ctaGradient,
                                color: colors.neutral50,
                            }}
                        >
                            ✕
                        </button>

                        <h3
                            className="text-sm font-semibold mb-4"
                            style={{ color: colors.neutral50 }}
                        >
                            More Skills
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {remainingSkills.map((skill) => (
                                <div
                                    key={skill.logoName}
                                    className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                                    style={{
                                        backgroundColor: "rgba(18,18,18,0.55)",
                                        backdropFilter: "blur(2px)",
                                        color: colors.neutral200,
                                        border: `1px solid ${colors.accent500}33`,
                                    }}
                                >
                                    <img
                                        src={skill.logoUrl}
                                        alt={skill.logoName}
                                        className="h-4 w-4"
                                    />
                                    {skill.logoName}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(ImageCarousel);
