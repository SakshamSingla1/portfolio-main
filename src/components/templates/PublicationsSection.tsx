import { FiFileText, FiMic, FiVideo, FiHeadphones, FiExternalLink, FiUsers } from "react-icons/fi";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { useColors } from "../../utils/theme";
import type { PublicationResponse } from "../../utils/types";

interface PublicationsSectionProps {
    publications: PublicationResponse[];
}

const TYPE_LABELS: Record<string, string> = {
    PAPER:   "Research Papers",
    ARTICLE: "Articles",
    TALK:    "Talks",
    VIDEO:   "Videos",
    PODCAST: "Podcasts",
};

const TYPE_ORDER = ["PAPER", "ARTICLE", "TALK", "VIDEO", "PODCAST"];

const getTypeIcon = (type: string) => {
    switch (type) {
        case "TALK":    return <FiMic size={18} />;
        case "VIDEO":   return <FiVideo size={18} />;
        case "PODCAST": return <FiHeadphones size={18} />;
        default:        return <FiFileText size={18} />;
    }
};

const PublicationsSection = ({ publications }: PublicationsSectionProps) => {
    const colors = useColors();

    const grouped = TYPE_ORDER.reduce<Record<string, PublicationResponse[]>>((acc, type) => {
        const items = publications.filter((p) => p.type === type);
        if (items.length > 0) acc[type] = items;
        return acc;
    }, {});

    if (Object.keys(grouped).length === 0) return null;

    return (
        <section id="publications" className="section-padding relative">
            <div className="max-w-7xl mx-auto">
                <SectionHeading title="Publications & Talks" subtitle="Research, articles, talks, and other contributions" />

                <div className="space-y-10 max-w-4xl mx-auto">
                    {Object.entries(grouped).map(([type, items]) => (
                        <div key={type}>
                            <div
                                className="flex items-center gap-2 mb-4"
                                style={{ color: colors.primary400 }}
                            >
                                {getTypeIcon(type)}
                                <h3 className="text-base font-semibold uppercase tracking-wider">
                                    {TYPE_LABELS[type] ?? type}
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {items.map((pub, idx) => (
                                    <FadeInView key={pub.id} delay={idx * 0.08}>
                                        <div
                                            className="rounded-xl p-5 backdrop-blur-md transition-all duration-300"
                                            style={{
                                                background: `${colors.neutral900}80`,
                                                border: `1px solid ${colors.neutral700}40`,
                                            }}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    {pub.url ? (
                                                        <a
                                                            href={pub.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-semibold text-base hover:underline flex items-center gap-1 flex-wrap"
                                                            style={{ color: colors.neutral100 }}
                                                        >
                                                            {pub.title}
                                                            <FiExternalLink size={13} style={{ color: colors.primary400, flexShrink: 0 }} />
                                                        </a>
                                                    ) : (
                                                        <span className="font-semibold text-base" style={{ color: colors.neutral100 }}>
                                                            {pub.title}
                                                        </span>
                                                    )}

                                                    {(pub.publisher || pub.publishedDate) && (
                                                        <p className="text-sm mt-1" style={{ color: colors.neutral400 }}>
                                                            {pub.publisher && <span>{pub.publisher}</span>}
                                                            {pub.publisher && pub.publishedDate && <span> · </span>}
                                                            {pub.publishedDate && <span>{pub.publishedDate}</span>}
                                                        </p>
                                                    )}

                                                    {pub.coAuthors && (
                                                        <p className="text-sm mt-1 flex items-center gap-1" style={{ color: colors.neutral500 }}>
                                                            <FiUsers size={13} />
                                                            {pub.coAuthors}
                                                        </p>
                                                    )}

                                                    {pub.description && (
                                                        <p className="text-sm mt-2 leading-relaxed" style={{ color: colors.neutral300 }}>
                                                            {pub.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </FadeInView>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PublicationsSection;
