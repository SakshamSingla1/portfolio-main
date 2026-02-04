import React from "react";
import { type FormikProps } from "formik";
import { type ContactUsRequest } from "../../utils/types";
import TextField from "../atoms/TextField/TextField";
import Button from "../atoms/Button/Button";
import { useColors } from "../../utils/theme";

export interface ContactUsFormTemplateProps {
    formik: FormikProps<ContactUsRequest>;
}

const ContactUsFormTemplate: React.FC<ContactUsFormTemplateProps> = ({
    formik,
}) => {
    const colors = useColors();

    return (
        <section className="relative mx-auto px-4 py-16">
            <div className="rounded-3xl border p-8 shadow-sm sm:p-12" style={{ backgroundColor: colors.neutral50, borderColor: colors.primary100 }}>
                <header className="mb-12">
                    <h2 className="text-3xl font-semibold" style={{ color: colors.neutral900 }}>
                        Get in touch
                    </h2>
                    <div className="mt-3 h-[4px] w-20 rounded-full" style={{ background: `linear-gradient( 90deg, ${colors.primary200},${colors.primary500})` }} />
                    <p className="mt-5 max-w-xl text-sm leading-relaxed" style={{ color: colors.neutral700 }} >
                        Have a question, an opportunity, or a project in mind?
                        Fill out the form below and I’ll get back to you as soon as possible.
                    </p>
                </header>
                <div className="grid grid-cols-1 gap-8">
                    <TextField
                        label="Full name"
                        placeholder="Your full name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name ? formik.errors.name : ""}
                    />
                    <TextField
                        label="Email address"
                        placeholder="your@email.com"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email ? formik.errors.email : ""}
                    />
                    <TextField
                        label="Phone number"
                        placeholder="+91 98765 43210"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone ? formik.errors.phone : ""}
                    />
                    <TextField
                        label="Message"
                        placeholder="Briefly describe how I can help you"
                        name="message"
                        multiline
                        rows={4}
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.message && Boolean(formik.errors.message)}
                        helperText={formik.touched.message ? formik.errors.message : ""}
                    />
                </div>
                <footer className="mt-14 flex justify-end">
                    <Button
                        label={formik.isSubmitting ? "Sending…" : "Send message"}
                        variant="primaryContained"
                        onClick={() => formik.handleSubmit()}
                        disabled={formik.isSubmitting}
                        className="min-w-[180px] rounded-xl px-6 py-3 text-sm font-medium transition-all duration-200 hover:shadow-md active:translate-y-[1px]"
                    />
                </footer>
            </div>
        </section>
    );
};

export default ContactUsFormTemplate;
