import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signupUserAPI, verifySignupOtpAPI } from "../../../api/auth.api";
import UseToast from "../../../hooks/useToast";
import { useAuthStore } from "../../../store/authStore";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useState } from "react";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Confirm Password is required"),
  recaptcha: Yup.string().required("Please complete the reCAPTCHA"),
});

export default function Signup() {
  const navigate = useNavigate();
  const recaptchaRef = useRef<any>(null);
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [userMail, setUserMail] = useState<string>("");

  const { login } = useAuthStore();

  const { mutateAsync: mutateSignup, isPending } = useMutation({
    mutationFn: ({
      username,
      email,
      password,
      confirmPassword,
      recaptcha,
    }: {
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
      recaptcha: string;
    }) => signupUserAPI(username, email, password, confirmPassword, recaptcha),
    onSuccess: (data: any) => {
      if (data?.data?.requiresOtp) {
        setStep("otp");
        setUserMail(data?.data?.email);
      }
      // login(data.data, data.token);
      // if (data?.data?.role == "1") {
      //   navigate("/board");
      // } else {
      //   navigate("/signin");
      // }
    },
    onError: (error: any) => {
      console.error(error);
      UseToast(error?.message || "Failed to signup, Please Try Again", "error");
      recaptchaRef.current?.reset();
    },
  });

  const { mutateAsync: mutateOtp } = useMutation({
    mutationFn: (payload: { userMail: string; otp: string }) =>
      verifySignupOtpAPI(payload.userMail, payload.otp),
    onSuccess: (data: any) => {
      login(data.data, data.token);
      navigate(data.data.role == "0" ? "/dashboard" : "/board");
    },
    onError: (error: any) => {
      UseToast(error?.message, "error");
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        {step === "signup" ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Signup</h1>

            <Formik
              initialValues={{
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                recaptcha: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setFieldError }) => {
                try {
                  await mutateSignup(values);
                } catch (err: any) {
                  setFieldError(
                    "general",
                    err?.response?.data?.message || "Signup failed"
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                  <div className="mb-3">
                    <Field
                      type="text"
                      name="username"
                      placeholder="Username"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="username"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-3">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-3">
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-3">
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={(token) => setFieldValue("recaptcha", token)}
                      onExpired={() => setFieldValue("recaptcha", "")}
                    />
                    <ErrorMessage
                      name="recaptcha"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isPending}
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {isSubmitting ? "Signing up..." : "Sign Up"}
                  </button>

                  <p className="text-sm mt-3">
                    Already have an account?{" "}
                    <Link
                      to="/signin"
                      className="text-blue-600 hover:underline"
                    >
                      Login
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Enter OTP</h1>
            <Formik
              initialValues={{ otp: "" }}
              validationSchema={Yup.object({
                otp: Yup.string()
                  .length(6, "OTP must be 6 digits")
                  .required("Required"),
              })}
              onSubmit={(values) => mutateOtp({ userMail, otp: values.otp })}
            >
              <Form>
                <Field
                  name="otp"
                  placeholder="Enter OTP"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="otp"
                  component="p"
                  className="text-red-500"
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white mt-3 p-2 rounded"
                >
                  Verify OTP
                </button>
              </Form>
            </Formik>
          </>
        )}
      </div>
    </div>
  );
}
