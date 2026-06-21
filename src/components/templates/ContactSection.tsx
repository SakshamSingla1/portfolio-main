import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProfileRequest } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck, FiClock, FiMessageSquare } from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContactUsService } from "../../services/useContactUsService";
import { HTTP_STATUS } from "../../utils/constants";
import { toast } from "sonner";

interface ContactSectionProps {
  profile: ProfileRequest;
}

const ContactSection = ({ profile }: ContactSectionProps) => {
  const colors = useColors();
  const g = gradients(colors);
  const contactService = useContactUsService();
  const [sent, setSent] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().min(2).max(50).required("Name is required"),
    email: Yup.string().trim().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .trim()
      .test("is-valid-phone", "Invalid phone number", (v) => {
        if (!v) return true;
        return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(v);
      })
      .nullable()
      .notRequired(),
    message: Yup.string().trim().min(10, "Min 10 characters").required("Message is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "", message: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await contactService.create({ ...values, phone: values.phone || "", profileId: profile.id });
        if (res?.status === HTTP_STATUS.OK || res?.status === HTTP_STATUS.CREATED) {
          toast.success("Message sent!");
          setSent(true);
          setTimeout(() => setSent(false), 4000);
          resetForm();
        } else {
          toast.error(res?.data?.message || "Failed to send. Please try again.");
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const hasErr = (f: "name" | "email" | "phone" | "message") =>
    !!(formik.touched[f] && formik.errors[f]);

  const inputStyle = (f: "name" | "email" | "phone" | "message"): React.CSSProperties => ({
    background: `${colors.neutral800}60`,
    border: `1px solid ${hasErr(f) ? colors.error500 : colors.neutral700}40`,
    color: colors.neutral100,
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 14,
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

  const contactItems = [
    { icon: FiMail, label: "Email", value: profile.email, href: `mailto:${profile.email}`, color: colors.primary500 },
    ...(profile.phone ? [{ icon: FiPhone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}`, color: colors.success500 }] : []),
    { icon: FiMapPin, label: "Location", value: profile.location, href: undefined, color: colors.accent500 },
  ];

  const nextSteps = [
    { icon: FiMessageSquare, text: "I'll read your message carefully", color: colors.primary500 },
    { icon: FiClock, text: "Typically respond within 24 hours", color: colors.success500 },
    { icon: FiCheck, text: "We'll schedule a call if it's a fit", color: colors.accent500 },
  ];

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: "absolute", top: "15%", right: "-8%", width: 600, height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.primary500}05 0%, transparent 70%)`,
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "-5%", width: 400, height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent500}04 0%, transparent 70%)`,
          filter: "blur(50px)",
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading title="Get In Touch" subtitle="Let's build something great together" />

        <div className="grid lg:grid-cols-5 gap-8 xl:gap-12">

          {/* ── Left panel ── */}
          <FadeInView className="lg:col-span-2 flex flex-col gap-5">

            {/* Contact info card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${colors.neutral800}60, ${colors.neutral900}80)`,
                border: `1px solid ${colors.neutral700}35`,
              }}
            >
              {/* Card header strip */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{
                  background: `linear-gradient(90deg, ${colors.primary500}10, ${colors.accent500}08)`,
                  borderBottom: `1px solid ${colors.neutral700}30`,
                }}
              >
                <span className="font-mono text-xs tracking-widest uppercase" style={{ color: colors.primary400 }}>
                  Contact Info
                </span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: `${colors.error500}60` }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: `${colors.warning500}60` }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: `${colors.success500}60` }} />
                </div>
              </div>

              <div className="p-6 space-y-4">
                {contactItems.map((item, idx) => (
                  <React.Fragment key={item.label}>
                    <motion.div
                      className="flex items-center gap-4 group"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: `${item.color}12`,
                          border: `1px solid ${item.color}25`,
                          boxShadow: `0 4px 14px ${item.color}12`,
                        }}
                      >
                        <item.icon size={18} style={{ color: item.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-mono tracking-widest uppercase mb-0.5" style={{ color: colors.neutral500 }}>
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm font-medium truncate block transition-colors duration-200"
                            style={{ color: colors.neutral200 }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = item.color; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = colors.neutral200; }}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium truncate" style={{ color: colors.neutral200 }}>
                            {item.value}
                          </p>
                        )}
                      </div>
                    </motion.div>
                    {idx < contactItems.length - 1 && (
                      <div style={{ height: 1, background: `${colors.neutral700}25` }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* What happens next card */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: `${colors.neutral800}50`,
                border: `1px solid ${colors.neutral700}30`,
              }}
            >
              <p className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: colors.neutral500 }}>
                What happens next?
              </p>
              <div className="space-y-3.5">
                {nextSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${step.color}12`, border: `1px solid ${step.color}20` }}
                    >
                      <step.icon size={13} style={{ color: step.color }} />
                    </div>
                    <span className="text-sm" style={{ color: colors.neutral400 }}>{step.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Terminal card */}
            <div
              className="rounded-xl p-4 font-mono text-xs"
              style={{ background: `${colors.neutral900}90`, border: `1px solid ${colors.neutral700}35` }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${colors.error500}60` }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${colors.warning500}60` }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${colors.success500}60` }} />
                <span className="ml-2 text-[10px]" style={{ color: colors.neutral600 }}>contact.sh</span>
              </div>
              <div style={{ color: colors.neutral500 }}>
                <span style={{ color: colors.primary400 }}>$</span>{" "}
                <span style={{ color: colors.neutral300 }}>reach-out</span>{" "}
                <span style={{ color: colors.accent400 }}>--to</span>{" "}
                <span style={{ color: colors.success400 }}>{profile.userName}</span>
                <br />
                <span style={{ color: `${colors.neutral500}70` }}># Response time: &lt; 24h</span>
                <br />
                <motion.span
                  style={{ display: "inline-block", width: 8, height: 14, verticalAlign: "middle", background: colors.primary400, marginTop: 4 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            </div>
          </FadeInView>

          {/* ── Form ── */}
          <FadeInView delay={0.15} className="lg:col-span-3">
            <form
              onSubmit={formik.handleSubmit}
              className="rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${colors.neutral800}60, ${colors.neutral900}80)`,
                border: `1px solid ${colors.neutral700}35`,
              }}
            >
              {/* Form header */}
              <div
                style={{
                  height: 3,
                  background: `linear-gradient(90deg, ${colors.primary500}, ${colors.accent500})`,
                  boxShadow: `0 0 16px ${colors.primary500}30`,
                }}
              />

              <div className="p-6 md:p-8 space-y-5">
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1" style={{ color: colors.neutral100 }}>
                    Send a message
                  </h3>
                  <p className="text-sm" style={{ color: colors.neutral500 }}>
                    Have a project in mind or just want to say hello?
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-mono mb-2 tracking-wider" style={{ color: colors.neutral500 }}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle" style={{ background: colors.primary500 }} />
                      NAME <span style={{ color: colors.error500 }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      placeholder="Your full name"
                      className="placeholder:opacity-30 transition-all duration-200"
                      style={inputStyle("name")}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = hasErr("name") ? colors.error500 : `${colors.primary500}60`;
                        e.currentTarget.style.boxShadow = hasErr("name") ? `0 0 0 3px ${colors.error500}12` : `0 0 0 3px ${colors.primary500}12`;
                      }}
                      onBlur={(e) => {
                        formik.handleBlur(e);
                        e.currentTarget.style.borderColor = hasErr("name") ? `${colors.error500}40` : `${colors.neutral700}40`;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    {hasErr("name") && (
                      <p className="text-[11px] mt-1.5 font-mono" style={{ color: colors.error400 }}>{formik.errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-mono mb-2 tracking-wider" style={{ color: colors.neutral500 }}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle" style={{ background: colors.primary500 }} />
                      EMAIL <span style={{ color: colors.error500 }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      placeholder="you@example.com"
                      className="placeholder:opacity-30 transition-all duration-200"
                      style={inputStyle("email")}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = hasErr("email") ? colors.error500 : `${colors.primary500}60`;
                        e.currentTarget.style.boxShadow = hasErr("email") ? `0 0 0 3px ${colors.error500}12` : `0 0 0 3px ${colors.primary500}12`;
                      }}
                      onBlur={(e) => {
                        formik.handleBlur(e);
                        e.currentTarget.style.borderColor = hasErr("email") ? `${colors.error500}40` : `${colors.neutral700}40`;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    {hasErr("email") && (
                      <p className="text-[11px] mt-1.5 font-mono" style={{ color: colors.error400 }}>{formik.errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-mono mb-2 tracking-wider" style={{ color: colors.neutral500 }}>
                    PHONE <span className="text-[10px] opacity-50">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="placeholder:opacity-30 transition-all duration-200"
                    style={inputStyle("phone")}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = `${colors.primary500}60`;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary500}12`;
                    }}
                    onBlur={(e) => {
                      formik.handleBlur(e);
                      e.currentTarget.style.borderColor = `${colors.neutral700}40`;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {hasErr("phone") && (
                    <p className="text-[11px] mt-1.5 font-mono" style={{ color: colors.error400 }}>{formik.errors.phone}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-mono mb-2 tracking-wider" style={{ color: colors.neutral500 }}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle" style={{ background: colors.primary500 }} />
                    MESSAGE <span style={{ color: colors.error500 }}>*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    placeholder="Tell me about your project, idea, or opportunity…"
                    className="placeholder:opacity-30 resize-none transition-all duration-200"
                    style={inputStyle("message")}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = hasErr("message") ? colors.error500 : `${colors.primary500}60`;
                      e.currentTarget.style.boxShadow = hasErr("message") ? `0 0 0 3px ${colors.error500}12` : `0 0 0 3px ${colors.primary500}12`;
                    }}
                    onBlur={(e) => {
                      formik.handleBlur(e);
                      e.currentTarget.style.borderColor = hasErr("message") ? `${colors.error500}40` : `${colors.neutral700}40`;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {hasErr("message") && (
                    <p className="text-[11px] mt-1.5 font-mono" style={{ color: colors.error400 }}>{formik.errors.message}</p>
                  )}
                  {/* Character count */}
                  <p className="text-[10px] font-mono mt-1 text-right" style={{ color: colors.neutral600 }}>
                    {formik.values.message.length} chars
                  </p>
                </div>

                {/* Success message */}
                <AnimatePresence>
                  {sent && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
                      style={{
                        background: `${colors.success500}10`,
                        border: `1px solid ${colors.success500}30`,
                        color: colors.success400,
                      }}
                    >
                      <FiCheck size={16} />
                      Your message was received — I'll be in touch soon!
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={formik.isSubmitting}
                  whileHover={{ scale: 1.02, boxShadow: `0 0 36px ${colors.primary500}35` }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2.5 font-semibold py-3.5 rounded-xl text-white relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: sent ? `${colors.success500}` : g.ctaGradient,
                    boxShadow: `0 0 24px ${colors.primary500}22`,
                    transition: "background 0.4s ease, box-shadow 0.3s ease",
                  }}
                >
                  {/* Shimmer */}
                  {!formik.isSubmitting && !sent && (
                    <motion.div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "55%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                        skewX: "-20deg",
                        pointerEvents: "none",
                      }}
                      animate={{ left: ["-100%", "200%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                    />
                  )}
                  {formik.isSubmitting ? (
                    <motion.div
                      className="w-5 h-5 rounded-full border-2 border-t-transparent"
                      style={{ borderColor: "rgba(255,255,255,0.5)", borderTopColor: "transparent" }}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                    />
                  ) : sent ? (
                    <><FiCheck size={16} /> Message Sent!</>
                  ) : (
                    <><FiSend size={16} /> Send Message</>
                  )}
                </motion.button>
              </div>
            </form>
          </FadeInView>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ContactSection);
