import { useState } from "react";
import { motion } from "framer-motion";
import type { ProfileRequest } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck } from "react-icons/fi";
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
    name: Yup.string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .required("Name is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .trim()
      .test("is-valid-phone", "Invalid phone number", (value) => {
        if (!value) return true;
        return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value);
      })
      .nullable()
      .notRequired(),
    message: Yup.string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .required("Message is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          ...values,
          phone: values.phone || "",
          profileId: profile.id,
        };
        const res = await contactService.create(payload);
        if (res?.status === HTTP_STATUS.OK || res?.status === HTTP_STATUS.CREATED) {
          toast.success("Message sent successfully!");
          setSent(true);
          setTimeout(() => setSent(false), 3000);
          resetForm();
        } else {
          const errMsg = res?.data?.message || "Failed to send message. Please try again.";
          toast.error(errMsg);
        }
      } catch (err) {
        console.error("Error submitting contact form:", err);
        toast.error("Something went wrong. Please try again later.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getInputStyle = (fieldName: "name" | "email" | "phone" | "message"): React.CSSProperties => {
    const hasError = formik.touched[fieldName] && formik.errors[fieldName];
    return {
      background: `${colors.neutral700}40`,
      border: `1px solid ${hasError ? colors.error500 : colors.neutral600}40`,
      color: colors.neutral100,
    };
  };

  const inputFocusClass = "w-full rounded-lg px-4 py-2.5 text-sm placeholder:opacity-40 focus:outline-none transition-all duration-300";

  return (
    <section id="contact" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
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
                ...(profile.phone ? [{ icon: FiPhone, label: "phone", value: profile.phone, href: `tel:${profile.phone}`, color: colors.primary500 }] : []),
                { icon: FiMapPin, label: "location", value: profile.location, href: undefined, color: colors.primary500 },
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
              onSubmit={formik.handleSubmit}
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
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className={inputFocusClass}
                    style={getInputStyle("name")}
                    placeholder="Enter your name"
                    onFocus={(e) => {
                      const hasError = formik.touched.name && formik.errors.name;
                      e.currentTarget.style.borderColor = hasError ? colors.error500 : `${colors.primary500}50`;
                      e.currentTarget.style.boxShadow = hasError ? `0 0 0 2px ${colors.error500}15` : `0 0 0 2px ${colors.primary500}15`;
                    }}
                    onBlur={(e) => {
                      formik.handleBlur(e);
                      const hasError = formik.touched.name && formik.errors.name;
                      e.currentTarget.style.borderColor = hasError ? `${colors.error500}40` : `${colors.neutral600}40`;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <span className="text-xs mt-1.5 block font-mono" style={{ color: colors.error500 }}>
                      {formik.errors.name}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: colors.neutral500 }}>email</label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    className={inputFocusClass}
                    style={getInputStyle("email")}
                    placeholder="Enter your email"
                    onFocus={(e) => {
                      const hasError = formik.touched.email && formik.errors.email;
                      e.currentTarget.style.borderColor = hasError ? colors.error500 : `${colors.primary500}50`;
                      e.currentTarget.style.boxShadow = hasError ? `0 0 0 2px ${colors.error500}15` : `0 0 0 2px ${colors.primary500}15`;
                    }}
                    onBlur={(e) => {
                      formik.handleBlur(e);
                      const hasError = formik.touched.email && formik.errors.email;
                      e.currentTarget.style.borderColor = hasError ? `${colors.error500}40` : `${colors.neutral600}40`;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span className="text-xs mt-1.5 block font-mono" style={{ color: colors.error500 }}>
                      {formik.errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: colors.neutral500 }}>phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  className={inputFocusClass}
                  style={getInputStyle("phone")}
                  placeholder="Enter your phone number"
                  onFocus={(e) => {
                    const hasError = formik.touched.phone && formik.errors.phone;
                    e.currentTarget.style.borderColor = hasError ? colors.error500 : `${colors.primary500}50`;
                    e.currentTarget.style.boxShadow = hasError ? `0 0 0 2px ${colors.error500}15` : `0 0 0 2px ${colors.primary500}15`;
                  }}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    const hasError = formik.touched.phone && formik.errors.phone;
                    e.currentTarget.style.borderColor = hasError ? `${colors.error500}40` : `${colors.neutral600}40`;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <span className="text-xs mt-1.5 block font-mono" style={{ color: colors.error500 }}>
                    {formik.errors.phone}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: colors.neutral500 }}>message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  className={inputFocusClass + " resize-none"}
                  style={getInputStyle("message")}
                  placeholder="Enter your message"
                  onFocus={(e) => {
                    const hasError = formik.touched.message && formik.errors.message;
                    e.currentTarget.style.borderColor = hasError ? colors.error500 : `${colors.primary500}50`;
                    e.currentTarget.style.boxShadow = hasError ? `0 0 0 2px ${colors.error500}15` : `0 0 0 2px ${colors.primary500}15`;
                  }}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    const hasError = formik.touched.message && formik.errors.message;
                    e.currentTarget.style.borderColor = hasError ? `${colors.error500}40` : `${colors.neutral600}40`;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {formik.touched.message && formik.errors.message && (
                  <span className="text-xs mt-1.5 block font-mono" style={{ color: colors.error500 }}>
                    {formik.errors.message}
                  </span>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={formik.isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
                style={{
                  background: g.ctaGradient,
                  color: colors.neutral50,
                  boxShadow: `0 0 20px ${colors.primary500}20`,
                }}
              >
                {formik.isSubmitting ? (
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
