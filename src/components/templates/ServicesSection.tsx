import React from "react";
import { motion } from "framer-motion";
import DOMPurify from 'dompurify';
import type { ServiceResponse } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import {
  TbBriefcase, TbClock, TbCurrencyDollar, TbCode, TbServer, TbCompass, TbPalette,
  TbDatabase, TbShieldCheck, TbCloud, TbDeviceMobile, TbLayoutGrid, TbTerminal2,
  TbBolt, TbTool, TbSettings, TbWorld, TbCamera, TbVideo, TbPencil, TbChartBar,
  TbRocket, TbUsers, TbHeadset, TbLock, TbSearch, TbMail, TbBrandGithub,
} from "react-icons/tb";
import { useColors, shadows } from "../../utils/theme";
import { getOptimizedImageUrl, onImageError } from "../../utils/helper";

interface ServicesSectionProps {
  services: ServiceResponse[];
}

const SERVICE_ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  code: TbCode, development: TbCode, web: TbCode,
  server: TbServer, backend: TbServer, api: TbServer,
  compass: TbCompass, consulting: TbCompass, strategy: TbCompass,
  design: TbPalette, ui: TbPalette, ux: TbPalette, palette: TbPalette,
  database: TbDatabase, data: TbDatabase,
  security: TbShieldCheck, shield: TbShieldCheck,
  cloud: TbCloud, devops: TbCloud, infrastructure: TbCloud,
  mobile: TbDeviceMobile, app: TbDeviceMobile,
  frontend: TbLayoutGrid, layout: TbLayoutGrid,
  terminal: TbTerminal2, cli: TbTerminal2,
  performance: TbBolt, optimization: TbBolt, zap: TbBolt,
  tool: TbTool, tools: TbTool, maintenance: TbTool,
  settings: TbSettings, automation: TbSettings,
  globe: TbWorld, seo: TbWorld, marketing: TbWorld,
  camera: TbCamera, photography: TbCamera,
  video: TbVideo, motion: TbVideo,
  content: TbPencil, writing: TbPencil, pencil: TbPencil,
  analytics: TbChartBar, chart: TbChartBar,
  rocket: TbRocket, launch: TbRocket, deployment: TbRocket,
  team: TbUsers, mentoring: TbUsers, users: TbUsers,
  support: TbHeadset, headset: TbHeadset,
  auth: TbLock, lock: TbLock,
  search: TbSearch,
  email: TbMail, mail: TbMail,
  github: TbBrandGithub,
};

const EMOJI_RE = /\p{Extended_Pictographic}/u;

const resolveServiceIcon = (icon: string | undefined): React.ReactNode => {
  if (!icon) return null;
  const trimmed = icon.trim();
  if (EMOJI_RE.test(trimmed)) return <span>{trimmed}</span>;
  const Icon = SERVICE_ICON_MAP[trimmed.toLowerCase()];
  return Icon ? <Icon size={20} /> : null;
};

const ServicesSection = ({ services }: ServicesSectionProps) => {
  const colors = useColors();
  const s = shadows(colors);

  const gridColsClass =
    services.length === 1 ? "sm:grid-cols-1" :
    services.length === 2 ? "sm:grid-cols-2" :
    "sm:grid-cols-2 lg:grid-cols-3";
  const gridWidthClass = services.length < 3 ? "max-w-4xl mx-auto" : "";

  return (
    <section id="services" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Services" subtitle="What I can do for you" />

        <div className={`grid ${gridColsClass} gap-6 ${gridWidthClass}`}>
          {services.map((service, idx) => (
            <FadeInView key={service.id} delay={idx * 0.08}>
              <motion.div
                whileHover={{ y: -6, boxShadow: s.card }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="rounded-xl overflow-hidden flex flex-col transition-all duration-300"
                style={{
                  // No backdrop-blur: unpaginated grid, one card per service —
                  // a more opaque gradient keeps the look without the per-card,
                  // per-scroll-frame resample cost.
                  background: `linear-gradient(145deg, ${colors.neutral800}F0, ${colors.neutral900}FA)`,
                  border: `1px solid ${colors.neutral700}40`,
                  boxShadow: `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.7)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${colors.primary500}40`;
                  e.currentTarget.style.boxShadow = `0 1px 0 0 rgba(255,255,255,0.06) inset, 0 20px 40px ${colors.primary500}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${colors.neutral700}40`;
                  e.currentTarget.style.boxShadow = `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.7)`;
                }}
              >
                {service.bannerUrl && (
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={getOptimizedImageUrl(service.bannerUrl, { width: 600 })}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      onError={onImageError}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${colors.neutral900}d0, transparent 60%)`,
                      }}
                    />
                  </div>
                )}

                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-lg"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary500}20, ${colors.primary700}15)`,
                        border: `1px solid ${colors.primary500}25`,
                        color: colors.primary400,
                      }}
                    >
                      {resolveServiceIcon(service.icon) ?? <TbBriefcase size={20} />}
                    </div>
                    <div>
                      <h3 className="font-display font-bold leading-tight" style={{ color: colors.neutral50 }}>
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {service.description && (
                    <p
                      className="text-sm leading-relaxed flex-1 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mb-1"
                      style={{ color: colors.neutral300 }}
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.description ?? '') }}
                    />
                  )}

                  {(service.priceRange || service.deliveryTime) && (
                    <div
                      className="flex flex-wrap gap-2 pt-3"
                      style={{ borderTop: `1px solid ${colors.neutral700}30` }}
                    >
                      {service.priceRange && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium"
                          style={{
                            background: `${colors.success500}15`,
                            border: `1px solid ${colors.success500}30`,
                            color: colors.success400,
                          }}
                        >
                          <TbCurrencyDollar size={12} />
                          {service.priceRange}
                        </span>
                      )}
                      {service.deliveryTime && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium"
                          style={{
                            background: `${colors.warning500}15`,
                            border: `1px solid ${colors.warning500}30`,
                            color: colors.warning400,
                          }}
                        >
                          <TbClock size={12} />
                          {service.deliveryTime}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ServicesSection);
