import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { request } from "../../services";
import { motion } from "framer-motion";
import { useColors } from "../../utils/theme";
import { FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

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
        padding: "10px 14px",
        fontSize: "14px",
        border: `1px solid ${colors.neutral200}`,
        borderRadius: "8px",
        background: colors.neutral50,
        color: colors.neutral800,
        boxSizing: "border-box",
        outline: "none",
        fontFamily: "inherit",
    };

    const labelStyle: React.CSSProperties = {
        fontSize: "13px",
        fontWeight: 500,
        color: colors.neutral600,
        display: "block",
        marginBottom: "6px",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: colors.neutral50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 16px",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    background: colors.neutral50,
                    borderRadius: "16px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
                    padding: "36px 32px",
                    width: "100%",
                    maxWidth: "520px",
                }}
            >
                {pageState === "loading" && (
                    <div style={{ textAlign: "center", color: colors.neutral400, padding: "40px 0" }}>
                        Loading…
                    </div>
                )}

                {pageState === "error" && (
                    <div style={{ textAlign: "center", padding: "32px 0" }}>
                        <FiAlertCircle size={40} color={colors.error500} style={{ marginBottom: "16px" }} />
                        <h2 style={{ fontSize: "18px", fontWeight: 700, color: colors.neutral900, marginBottom: "8px" }}>
                            Link Unavailable
                        </h2>
                        <p style={{ fontSize: "14px", color: colors.neutral500 }}>{errorMessage}</p>
                    </div>
                )}

                {pageState === "form" && linkDetails && (
                    <>
                        <div style={{ marginBottom: "28px" }}>
                            <h1 style={{ fontSize: "20px", fontWeight: 700, color: colors.neutral900, margin: "0 0 6px" }}>
                                Write a Testimonial
                            </h1>
                            <p style={{ fontSize: "14px", color: colors.neutral500, margin: 0 }}>
                                Share your experience with{" "}
                                <strong style={{ color: colors.primary600 }}>{linkDetails.ownerName}</strong>.
                                {linkDetails.requesterName && (
                                    <> Hi <strong>{linkDetails.requesterName}</strong>, we'd love to hear from you!</>
                                )}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                                <div>
                                    <label style={labelStyle}>Your Name *</label>
                                    <input
                                        style={inputStyle}
                                        type="text"
                                        placeholder="Jane Smith"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    />
                                    {errors.name && <span style={{ fontSize: "11px", color: colors.error500 }}>{errors.name}</span>}
                                </div>
                                <div>
                                    <label style={labelStyle}>Your Role</label>
                                    <input
                                        style={inputStyle}
                                        type="text"
                                        placeholder="Software Engineer"
                                        value={form.role}
                                        onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                                <div>
                                    <label style={labelStyle}>Company</label>
                                    <input
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
                                        style={inputStyle}
                                        type="url"
                                        placeholder="https://linkedin.com/in/..."
                                        value={form.linkedInUrl}
                                        onChange={e => setForm(f => ({ ...f, linkedInUrl: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: "22px" }}>
                                <label style={labelStyle}>Your Testimonial *</label>
                                <textarea
                                    style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
                                    placeholder="Share what it was like working with them…"
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                />
                                {errors.message && <span style={{ fontSize: "11px", color: colors.error500 }}>{errors.message}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    background: colors.primary600,
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "9px",
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    cursor: submitting ? "not-allowed" : "pointer",
                                    opacity: submitting ? 0.7 : 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                }}
                            >
                                <FiSend size={16} />
                                {submitting ? "Submitting…" : "Submit Testimonial"}
                            </button>
                        </form>
                    </>
                )}

                {pageState === "success" && linkDetails && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        style={{ textAlign: "center", padding: "32px 0" }}
                    >
                        <FiCheckCircle size={48} color={colors.success600} style={{ marginBottom: "18px" }} />
                        <h2 style={{ fontSize: "20px", fontWeight: 700, color: colors.neutral900, marginBottom: "10px" }}>
                            Thank you!
                        </h2>
                        <p style={{ fontSize: "14px", color: colors.neutral500 }}>
                            Your testimonial has been submitted. {linkDetails.ownerName} will review it shortly.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default TestimonialSubmitPage;
