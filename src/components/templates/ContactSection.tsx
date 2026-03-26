import { useState } from "react";
import { motion } from "framer-motion";
import type { ProfileRequest } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck } from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import React from "react";

interface ContactSectionProps {
  profile: ProfileRequest;
}

const ContactSection = ({ profile }: ContactSectionProps) => {
  const colors = useColors();
  const g = gradients(colors);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const inputStyle: React.CSSProperties = {
    background: `${colors.neutral700}40`,
    border: `1px solid ${colors.neutral600}40`,
    color: colors.neutral100,
  };

  const inputFocusClass = "w-full rounded-lg px-4 py-2.5 text-sm placeholder:opacity-40 focus:outline-none transition-all duration-300";

  return (
    <section id="contact" className="section-padding relative">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="Get In Touch" subtitle="Let's build something great together" />

        <div className="grid md:grid-cols-5 gap-8">
          <FadeInView className="md:col-span-2 space-y-6">
            <div
              className="rounded-xl p-6 space-y-5 backdrop-blur-md"
              style={{
                background: `${colors.neutral800}60`,
                border: `1px solid ${colors.neutral700}40`,
              }}
            >
              {[
                { icon: FiMail, label: "email", value: profile.email, href: `mailto:${profile.email}`, color: colors.primary500 },
                ...(profile.phone ? [{ icon: FiPhone, label: "phone", value: profile.phone, href: `tel:${profile.phone}`, color: colors.accent500 }] : []),
                { icon: FiMapPin, label: "location", value: profile.location, href: undefined, color: colors.secondary500 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${item.color}15` }}
                  >
                    <item.icon style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-mono" style={{ color: colors.neutral500 }}>{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm transition-colors duration-300"
                        style={{ color: colors.neutral200 }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = colors.primary400; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = colors.neutral200; }}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm" style={{ color: colors.neutral200 }}>{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl p-4 font-mono text-xs"
              style={{
                background: `${colors.neutral800}60`,
                border: `1px solid ${colors.neutral700}40`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${colors.error500}60` }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${colors.warning500}60` }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${colors.success500}60` }} />
              </div>
              <div style={{ color: colors.neutral500 }}>
                <span style={{ color: colors.primary400 }}>$</span> send-message --to {profile.userName}
                <br />
                <span style={{ color: `${colors.neutral500}70` }}># Fill out the form →</span>
              </div>
            </div>
          </FadeInView>

          <FadeInView delay={0.15} className="md:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-xl p-6 space-y-4 backdrop-blur-md"
              style={{
                background: `${colors.neutral800}60`,
                border: `1px solid ${colors.neutral700}40`,
              }}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: colors.neutral500 }}>name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputFocusClass}
                    style={inputStyle}
                    placeholder="John Doe"
                    onFocus={(e) => { e.currentTarget.style.borderColor = `${colors.primary500}50`; e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary500}15`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = `${colors.neutral600}40`; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: colors.neutral500 }}>email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={inputFocusClass}
                    style={inputStyle}
                    placeholder="john@example.com"
                    onFocus={(e) => { e.currentTarget.style.borderColor = `${colors.primary500}50`; e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary500}15`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = `${colors.neutral600}40`; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: colors.neutral500 }}>phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className={inputFocusClass}
                  style={inputStyle}
                  placeholder="+1 (555) 123-4567"
                  onFocus={(e) => { e.currentTarget.style.borderColor = `${colors.primary500}50`; e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary500}15`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = `${colors.neutral600}40`; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: colors.neutral500 }}>message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className={inputFocusClass + " resize-none"}
                  style={inputStyle}
                  placeholder="Tell me about your project..."
                  onFocus={(e) => { e.currentTarget.style.borderColor = `${colors.primary500}50`; e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary500}15`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = `${colors.neutral600}40`; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
                style={{
                  background: g.ctaGradient,
                  color: colors.neutral50,
                  boxShadow: `0 0 20px ${colors.primary500}20`,
                }}
              >
                {sending ? (
                  <motion.div
                    className="w-5 h-5 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: `${colors.neutral50}80`, borderTopColor: "transparent" }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                ) : sent ? (
                  <>
                    <FiCheck size={16} /> Message Sent!
                  </>
                ) : (
                  <>
                    <FiSend size={16} /> Send Message
                  </>
                )}
              </motion.button>
            </form>
          </FadeInView>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ContactSection);
