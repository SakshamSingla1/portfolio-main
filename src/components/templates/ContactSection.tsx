import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, ArrowUpRight, CheckCircle, MessageSquare, Loader2 } from "lucide-react";
import { SectionHeading } from "../molecules/SectionHeading/SectionHeading";
import { useColors, gradients } from "../../utils/theme";
import type { ProfileRequest } from "../../utils/types";

interface Props {
  profile: ProfileRequest;
}

export const ContactSection = ({ profile }: Props) => {
  const colors = useColors();
  const g = gradients(colors);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => { setStatus("idle"); setForm({ name: "", email: "", message: "" }); }, 2500);
    }, 1500);
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` },
    { icon: MapPin, label: "Location", value: profile.location },
  ];

  return (
    <section id="contact" className="section-container relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-80 h-80 blur-[180px] rounded-full" style={{ backgroundColor: `${colors.primary500}08` }} />
        <div className="absolute top-1/4 right-1/4 w-60 h-60 blur-[150px] rounded-full" style={{ backgroundColor: `${colors.accent500}06` }} />
      </div>

      <SectionHeading title="Let's Connect" subtitle="Have a project in mind? I'd love to hear about it." />

      <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:col-span-2 space-y-3"
        >
          {contactInfo.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ x: 3 }}
              className="glass-card-premium p-4 flex items-center gap-4"
            >
              <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: `${colors.primary500}0A`, color: colors.primary400 }}>
                <c.icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[11px] mb-0.5 uppercase tracking-wider font-medium" style={{ color: `${colors.neutral500}B3` }}>{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: colors.neutral200 }}>
                    {c.value} <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </a>
                ) : (
                  <p className="text-sm font-medium" style={{ color: colors.neutral200 }}>{c.value}</p>
                )}
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="glass-card-premium p-5 mt-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4" style={{ color: colors.primary400 }} />
              <p className="text-sm font-medium" style={{ color: colors.neutral300 }}>Prefer a quick chat?</p>
            </div>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: `${colors.neutral500}B3` }}>
              Feel free to reach out directly via email for faster responses.
            </p>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 text-xs px-5 py-2.5 rounded-xl font-semibold text-white"
              style={{ background: g.ctaGradient }}
            >
              <Mail className="w-3.5 h-3.5" /> Send Email
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="md:col-span-3 glass-card-premium p-6 md:p-8 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Your Name", type: "text" },
              { key: "email", label: "Your Email", type: "email" },
            ].map((field) => (
              <div key={field.key} className="floating-label-group">
                <input
                  type={field.type}
                  placeholder=" "
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="input-styled"
                  required
                  disabled={status !== "idle"}
                />
                <label>{field.label}</label>
              </div>
            ))}
          </div>
          <div className="floating-label-group">
            <textarea
              placeholder=" "
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="input-styled resize-none"
              required
              disabled={status !== "idle"}
            />
            <label>Your Message</label>
          </div>

          <motion.button
            type="submit"
            disabled={status !== "idle"}
            whileHover={status === "idle" ? { scale: 1.01 } : undefined}
            whileTap={status === "idle" ? { scale: 0.99 } : undefined}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-60 transition-all overflow-hidden relative"
            style={{ background: status === "sent" ? colors.success500 : g.ctaGradient }}
          >
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.span key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </motion.span>
              )}
              {status === "sending" && (
                <motion.span key="sending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </motion.span>
              )}
              {status === "sent" && (
                <motion.span key="sent" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Message Sent!
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};