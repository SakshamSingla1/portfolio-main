import { motion } from "framer-motion";
import { Briefcase, MapPin, ChevronRight, Clock } from "lucide-react";
import { SectionHeading } from "../molecules/SectionHeading/SectionHeading";
import { useColors } from "../../utils/theme";
import type { ExperienceResponse } from "../../utils/types";

interface Props {
  experiences: ExperienceResponse[];
}

const formatDate = (d: string) => {
  const [y, m] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1]} ${y}`;
};

const getDuration = (start: string, end?: string | null) => {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y > 0 && m > 0) return `${y}y ${m}m`;
  if (y > 0) return `${y}y`;
  return `${m}m`;
};

export const ExperienceSection = ({ experiences }: Props) => {
  const colors = useColors();

  return (
    <section id="experience" className="section-container">
      <SectionHeading title="Work Experience" subtitle="My professional journey so far" />
      <div className="relative max-w-3xl mx-auto">
        {/* Timeline line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px overflow-hidden">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: `linear-gradient(to bottom, ${colors.primary500}60, ${colors.accent500}30, transparent)` }}
          />
        </div>

        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-16 md:pl-20"
            >
              {/* Timeline dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.2, type: "spring", stiffness: 200 }}
                className="absolute left-4 md:left-6 top-3"
              >
                <div
                  className="w-4 h-4 rounded-full bg-background relative"
                  style={{ border: `2px solid ${!exp.endDate ? colors.primary400 : `${colors.primary500}80`}` }}
                >
                  {!exp.endDate && (
                    <div className="absolute inset-[-4px] rounded-full animate-ping" style={{ backgroundColor: `${colors.primary500}20` }} />
                  )}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3 }}
                className="glass-card-premium p-6 group"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-display text-lg font-bold" style={{ color: colors.neutral100 }}>
                      {exp.jobTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="flex items-center gap-1 text-sm font-medium" style={{ color: `${colors.primary400}B3` }}>
                        <Briefcase className="w-3.5 h-3.5" />
                        {exp.companyName}
                      </span>
                      <ChevronRight className="w-3 h-3" style={{ color: `${colors.neutral600}33` }} />
                      <span className="flex items-center gap-1 text-xs" style={{ color: `${colors.neutral500}B3` }}>
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono" style={{ color: `${colors.neutral500}CC` }}>
                      {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-semibold"
                          style={{ backgroundColor: `${colors.primary500}12`, color: colors.primary400 }}
                        >
                          Present
                        </span>
                      )}
                    </span>
                    <p className="text-[10px] mt-1 flex items-center justify-end gap-1" style={{ color: `${colors.neutral500}80` }}>
                      <Clock className="w-2.5 h-2.5" />
                      {getDuration(exp.startDate, exp.endDate)}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-4" style={{ color: `${colors.neutral400}CC` }}>
                  <div
                    className="preview"
                    dangerouslySetInnerHTML={{ __html: exp.description || "" }}
                  />
                </p>

                {exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {exp.skills.map((s) => (
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
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
