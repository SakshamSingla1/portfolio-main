import React from "react";
import { useContactUsService } from "../../services/useContactUsService";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { ContactUsRequest } from "../../utils/types";
import { HTTP_STATUS } from "../../utils/constants";
import { useDefaultColorTheme } from "../../hooks/useDefaultColorTheme";
import { useColors } from "../../utils/theme";
import ContactUsFormTemplate from "../templates/ContactUsForm.template";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string().required("Message is required"),
});

const ContactUs: React.FC = () => {
  const contactUsService = useContactUsService();
  const { profileId } = useDefaultColorTheme();
  const colors = useColors();

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
    <section
      className="relative flex justify-center px-4 py-24 transition-colors duration-300"
      style={{ backgroundColor: colors.neutral50 }}
    >
      {/* soft glow */}
      <div
        className="absolute inset-0 blur-3xl opacity-30"
        style={{
          background: `radial-gradient(circle at top, ${colors.primary500}, transparent 60%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-3xl">
        <ContactUsFormTemplate formik={formik} />
      </div>
    </section>
  );
};

export default ContactUs;
