import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { request } from "../../services";
import { motion, AnimatePresence } from "framer-motion";
import { useColors } from "../../utils/theme";
import { FiSend, FiCheckCircle, FiAlertCircle, FiMessageSquare } from "react-icons/fi";

interface PublicLinkDetails {
    ownerName: string;
    requesterName?: string;
}

interface FormValues {
    name: string;
    role: string;
    company: string;
    message: string;
    linkedInUrl: string;
}

type PageState = "loading" | "form" | "success" | "error";

const MESSAGE_MAX_LENGTH = 600;

const getInitials = (name: string) =>
    name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const TestimonialSubmitPage = () => {
    const { token } = useParams<{ token: string }>();
    const colors = useColors();

    const [pageState, setPageState] = useState<PageState>("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [linkDetails, setLinkDetails] = useState<PublicLinkDetails | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState<FormValues>({
        name: "",
        role: "",
        company: "",
        message: "",
        linkedInUrl: "",
    });
    const [errors, setErrors] = useState<Partial<FormValues>>({});

    useEffect(() => {
        if (!token) {
            setErrorMessage("Invalid link.");
            setPageState("error");
            return;
        }
        request('get', `/testimonial-requests/${token}`, null)
            .then((res) => {
                if (res && res.status >= 200 && res.status < 300) {
                    setLinkDetails(res.data?.data);
                    setPageState("form");
                } else {
                    const code = res?.data?.exceptionCode;
                    if (code === "TESTIMONIAL_REQUEST_EXPIRED") {
                        setErrorMessage("This testimonial link has expired.");
                    } else if (code === "TESTIMONIAL_REQUEST_ALREADY_USED") {
                        setErrorMessage("This testimonial link has already been used.");
                    } else if (code === "TESTIMONIAL_REQUEST_NOT_FOUND") {
                        setErrorMessage("This testimonial link is invalid or does not exist.");
                    } else {
                        setErrorMessage("Something went wrong. Please try again later.");
                    }
                    setPageState("error");
                }
            })
            .catch(() => {
                setErrorMessage("Something went wrong. Please try again later.");
                setPageState("error");
            });
    }, [token]);

    const validate = (): boolean => {
        const errs: Partial<FormValues> = {};
        if (!form.name.trim()) errs.name = "Name is required.";
        if (!form.message.trim()) errs.message = "Message is required.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const res = await request('post', `/testimonial-requests/${token}/submit`, null, form);
            if (res && res.status >= 200 && res.status < 300) {
                setPageState("success");
            } else {
                setErrors({ message: "Submission failed. Please try again." });
            }
        } catch {
            setErrors({ message: "Submission failed. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "11px 14px",
        fontSize: "14px",
        border: `1.5px solid ${colors.neutral200}`,
        borderRadius: "10px",
        background: "#ffffff",
        color: colors.neutral800,
        boxSizing: "border-box",
        outline: "none",
        fontFamily: "inherit",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    };

    const labelStyle: React.CSSProperties = {
        fontSize: "13px",
        fontWeight: 600,
        color: colors.neutral700,
        display: "block",
        marginBottom: "6px",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${colors.primary100}, transparent), ${colors.neutral50}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 16px",
            }}
        >
            <style>{`
                .ts-field:focus {
                    border-color: ${colors.primary400} !important;
                    box-shadow: 0 0 0 3px ${colors.primary100};
                }
                .ts-field::placeholder { color: ${colors.neutral400}; }
                .ts-submit-btn:hover:not(:disabled) { filter: brightness(1.06); }
                .ts-submit-btn:active:not(:disabled) { transform: scale(0.98); }
                @keyframes ts-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
                .ts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
                @media (max-width: 480px) { .ts-grid { grid-template-columns: 1fr; } }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    boxShadow: `0 20px 60px -12px ${colors.neutral900}1a, 0 4px 16px rgba(0,0,0,0.06)`,
                    width: "100%",
                    maxWidth: "540px",
                    overflow: "hidden",
                }}
            >
                <div style={{ height: "5px", background: `linear-gradient(90deg, ${colors.primary500}, ${colors.primary700})` }} />

                <div style={{ padding: "34px 32px" }}>
                    {pageState === "loading" && (
                        <div>
                            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: colors.neutral100, marginBottom: "20px", animation: "ts-pulse 1.4s ease-in-out infinite" }} />
                            <div style={{ width: "60%", height: "20px", borderRadius: "6px", background: colors.neutral100, marginBottom: "10px", animation: "ts-pulse 1.4s ease-in-out infinite" }} />
                            <div style={{ width: "85%", height: "14px", borderRadius: "6px", background: colors.neutral100, marginBottom: "28px", animation: "ts-pulse 1.4s ease-in-out infinite" }} />
                            <div style={{ width: "100%", height: "44px", borderRadius: "10px", background: colors.neutral100, marginBottom: "14px", animation: "ts-pulse 1.4s ease-in-out infinite" }} />
                            <div style={{ width: "100%", height: "44px", borderRadius: "10px", background: colors.neutral100, animation: "ts-pulse 1.4s ease-in-out infinite" }} />
                        </div>
                    )}

                    {pageState === "error" && (
                        <div style={{ textAlign: "center", padding: "20px 0" }}>
                            <div style={{
                                width: "64px", height: "64px", borderRadius: "50%", background: colors.error50,
                                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
                            }}>
                                <FiAlertCircle size={30} color={colors.error500} />
                            </div>
                            <h2 style={{ fontSize: "18px", fontWeight: 700, color: colors.neutral900, marginBottom: "8px" }}>
                                Link Unavailable
                            </h2>
                            <p style={{ fontSize: "14px", color: colors.neutral500, margin: 0 }}>{errorMessage}</p>
                        </div>
                    )}

                    {pageState === "form" && linkDetails && (
                        <>
                            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "26px" }}>
                                <div style={{
                                    width: "48px", height: "48px", borderRadius: "14px", flexShrink: 0,
                                    background: `linear-gradient(135deg, ${colors.primary500}, ${colors.primary700})`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontWeight: 700, fontSize: "16px",
                                    boxShadow: `0 6px 16px -4px ${colors.primary500}80`,
                                }}>
                                    {getInitials(linkDetails.ownerName)}
                                </div>
                                <div>
                                    <h1 style={{ fontSize: "19px", fontWeight: 800, color: colors.neutral900, margin: 0, letterSpacing: "-0.01em" }}>
                                        Write a Testimonial
                                    </h1>
                                    <p style={{ fontSize: "13px", color: colors.neutral500, margin: "2px 0 0" }}>
                                        for <strong style={{ color: colors.primary600 }}>{linkDetails.ownerName}</strong>
                                    </p>
                                </div>
                            </div>

                            {linkDetails.requesterName && (
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "8px",
                                    background: colors.primary50, border: `1px solid ${colors.primary100}`,
                                    borderRadius: "10px", padding: "10px 14px", marginBottom: "22px",
                                }}>
                                    <FiMessageSquare size={14} color={colors.primary600} style={{ flexShrink: 0 }} />
                                    <p style={{ fontSize: "13px", color: colors.primary700, margin: 0 }}>
                                        Hi <strong>{linkDetails.requesterName}</strong>, thanks for taking the time — your feedback means a lot!
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="ts-grid">
                                    <div>
                                        <label style={labelStyle}>Your Name *</label>
                                        <input
                                            className="ts-field"
                                            style={{ ...inputStyle, borderColor: errors.name ? colors.error400 : colors.neutral200 }}
                                            type="text"
                                            placeholder="Jane Smith"
                                            value={form.name}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        />
                                        {errors.name && <span style={{ fontSize: "11px", color: colors.error500, marginTop: "4px", display: "block" }}>{errors.name}</span>}
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Your Role</label>
                                        <input
                                            className="ts-field"
                                            style={inputStyle}
                                            type="text"
                                            placeholder="Software Engineer"
                                            value={form.role}
                                            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="ts-grid">
                                    <div>
                                        <label style={labelStyle}>Company</label>
                                        <input
                                            className="ts-field"
                                            style={inputStyle}
                                            type="text"
                                            placeholder="Acme Inc."
                                            value={form.company}
                                            onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>LinkedIn URL</label>
                                        <input
                                            className="ts-field"
                                            style={inputStyle}
                                            type="url"
                                            placeholder="https://linkedin.com/in/..."
                                            value={form.linkedInUrl}
                                            onChange={e => setForm(f => ({ ...f, linkedInUrl: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: "22px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                        <label style={labelStyle}>Your Testimonial *</label>
                                        <span style={{ fontSize: "11px", color: form.message.length > MESSAGE_MAX_LENGTH ? colors.error500 : colors.neutral400 }}>
                                            {form.message.length}/{MESSAGE_MAX_LENGTH}
                                        </span>
                                    </div>
                                    <textarea
                                        className="ts-field"
                                        style={{ ...inputStyle, minHeight: "130px", resize: "vertical", borderColor: errors.message ? colors.error400 : colors.neutral200 }}
                                        placeholder="Share what it was like working with them…"
                                        value={form.message}
                                        maxLength={MESSAGE_MAX_LENGTH}
                                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    />
                                    {errors.message && <span style={{ fontSize: "11px", color: colors.error500, marginTop: "4px", display: "block" }}>{errors.message}</span>}
                                </div>

                                <button
                                    type="submit"
                                    className="ts-submit-btn"
                                    disabled={submitting}
                                    style={{
                                        width: "100%",
                                        padding: "13px",
                                        background: `linear-gradient(135deg, ${colors.primary600}, ${colors.primary700})`,
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "11px",
                                        fontSize: "15px",
                                        fontWeight: 700,
                                        cursor: submitting ? "not-allowed" : "pointer",
                                        opacity: submitting ? 0.7 : 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        boxShadow: `0 8px 20px -6px ${colors.primary600}80`,
                                        transition: "filter 0.15s ease, transform 0.1s ease",
                                    }}
                                >
                                    <FiSend size={16} />
                                    {submitting ? "Submitting…" : "Submit Testimonial"}
                                </button>
                            </form>
                        </>
                    )}

                    <AnimatePresence>
                        {pageState === "success" && linkDetails && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                style={{ textAlign: "center", padding: "20px 0" }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                                    style={{
                                        width: "72px", height: "72px", borderRadius: "50%", background: colors.success50,
                                        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
                                    }}
                                >
                                    <FiCheckCircle size={36} color={colors.success600} />
                                </motion.div>
                                <h2 style={{ fontSize: "20px", fontWeight: 800, color: colors.neutral900, marginBottom: "10px" }}>
                                    Thank you!
                                </h2>
                                <p style={{ fontSize: "14px", color: colors.neutral500, margin: 0, lineHeight: 1.6 }}>
                                    Your testimonial has been submitted.<br />
                                    <strong style={{ color: colors.neutral700 }}>{linkDetails.ownerName}</strong> will review it shortly.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default TestimonialSubmitPage;
