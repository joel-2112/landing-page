import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmOtp = ({ email, onSuccess }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true); // State for dialog visibility

  const navigate = useNavigate();

  const initialValues = {
    otp: "",
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^[0-9]+$/, "OTP must be only digits")
      .length(6, "OTP must be exactly 6 digits")
      .required("OTP is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(""); 

    try {
      const response = await axios.post("https://api.teamworksc.com/api/v1/users/verify-reset-otp", {
        email,
        otp: values.otp,
      });
      if (response.data.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/login");
        }
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  if (!isDialogOpen) {
    return null; // Don't render anything if the dialog is closed
  }

  return (
    <div
      className="flex flex-col bg-white w-full max-w-sm mx-auto rounded-lg "
      onClick={() => setError("")}
    >
       <button
        // onClick={handleOtpDialog}
        className="absolute font-bold left-12 text-orange-500  top-10 border-none bg-transparent  cursor-pointer text-xl text-red-400 "
      >
        Verify OTP
      </button> 
 
      <motion.div
        className="mb-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="p-4 shadow-lg rounded-xl">
          <p className="text-center text-gray-600 mb-4 mt-2 italic text-sm">
            Please enter the 6-digit OTP sent to your email
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Enter OTP
                  </label>
                  <div className="mt-2">
                    <Field name="otp">
                      {({ field, form }) => (
                        <input
                          {...field}
                          id="otp"
                          type="text"
                          maxLength="6"
                          className="block text-black w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-400 focus:border-orange-400 text-left tracking-widest"
                        />
                      )}
                    </Field>
                    {error && <div className="text-red-700 text-sm">{error}</div>}
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex w-full justify-center rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm transition-colors duration-200 ${
                      isSubmitting
                        ? "bg-orange-300 cursor-not-allowed"
                        : "bg-orange-400 hover:bg-orange-500 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                    }`}
                  >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmOtp;
