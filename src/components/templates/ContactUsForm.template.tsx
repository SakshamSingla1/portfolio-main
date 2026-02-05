import React from "react";
import { type ContactUsRequest } from "../../utils/types";
import TextField from "../atoms/TextField/TextField";
import Button from "../atoms/Button/Button";
import { useColors, gradients } from "../../utils/theme";
import { useFormik } from "formik";
import * as Yup from 'yup'
import { HTTP_STATUS } from "../../utils/constants";
import { useDefaultColorTheme } from "../../hooks/useDefaultColorTheme";
import { useContactUsService } from "../../services/useContactUsService";

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    message: Yup.string().required("Message is required"),
});

const ContactUsFormTemplate: React.FC = () => {
    const colors = useColors();
    const g = gradients(colors);
    const { profileId } = useDefaultColorTheme();
    const contactUsService = useContactUsService();

    const formik = useFormik<ContactUsRequest>({
        enableReinitialize: true,
        initialValues: {
            name: "",
            email: "",
            message: "",
            phone: "",
            profileId,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await contactUsService.create(values);
                if (response.status === HTTP_STATUS.OK) {
                    formik.resetForm();
                }
            } catch (error) {
                console.error(error);
            }
        },
    });

    return (
        <section className="relative py-20">
            <article className="relative group rounded-3xl p-[1px]">
                <div
                    className="absolute inset-0 rounded-3xl opacity-60"
                    style={{ background: g.cardBorderGradient }}
                />

                <div
                    className="
            relative rounded-3xl
            p-8 sm:p-12
          "
                    style={{
                        backgroundColor: colors.neutral900,
                        boxShadow: g.hoverGlowSoft,
                    }}
                >
                    <header className="mb-12">
                        <div
                            className="text-3xl font-semibold tracking-tight"
                            style={{ color: g.label }}
                        >
                            Get in touch
                        </div>

                        <div
                            className="mt-3 h-[3px] w-20 rounded-full"
                            style={{ background: g.dividerGradient }}
                        />

                        <p
                            className="mt-5 max-w-xl text-sm leading-relaxed"
                            style={{ color: colors.neutral400 }}
                        >
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
                            className="
                min-w-[180px]
                rounded-xl px-6 py-3
                text-sm font-medium
                transition-all duration-300
                hover:-translate-y-0.5
              "
                            style={{ boxShadow: g.hoverGlowMedium }}
                        />
                    </footer>
                </div>
            </article>
        </section>
    );
};

export default ContactUsFormTemplate;
