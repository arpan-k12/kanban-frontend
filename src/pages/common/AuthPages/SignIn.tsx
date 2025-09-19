import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import { loginUserAPI } from "../../../api/auth.api";
import { useAuthStore } from "../../../store/authStore";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useState } from "react";
import { verifySigninOtpAPI } from "../../../api/auth.api";
import { RECAPTCHA_SITE_KEY } from "../../../config/dotenv.config";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  recaptcha: Yup.string().required("Please complete the reCAPTCHA"),
});

export default function SignIn() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const recaptchaRef = useRef<any>(null);
  const [step, setStep] = useState<"login" | "otp">("login");
  const [userId, setUserId] = useState<string>("");

  const { mutateAsync: mutateLogin } = useMutation({
    mutationFn: (payload: {
      email: string;
      password: string;
      recaptcha: string;
    }) => loginUserAPI(payload.email, payload.password, payload.recaptcha),
    onSuccess: (data: any) => {
      if (data?.data?.requiresOtp) {
        setStep("otp");
        setUserId(data?.data?.userId);
      }
    },
    onError: (error: any) => {
      UseToast(error?.message || "Login failed", "error");
      recaptchaRef.current?.reset();
    },
  });

  const { mutateAsync: mutateOtp } = useMutation({
    mutationFn: (payload: { userId: string; otp: string }) =>
      verifySigninOtpAPI(payload.userId, payload.otp),
    onSuccess: (data: any) => {
      login(data.data, data.token);
      navigate(data.data.role == "0" ? "/dashboard" : "/board");
    },
    onError: (error: any) => {
      // UseToast(error.message, "error");
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        {step === "login" ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            <Formik
              initialValues={{
                email: "joi@gmail.com",
                password: "test123",
                recaptcha: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => mutateLogin(values)}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form>
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
                    disabled={isSubmitting || !values.recaptcha}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </button>

                  <p className="text-sm mt-3">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-blue-600 hover:underline"
                    >
                      Signup
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
              onSubmit={(values) => mutateOtp({ userId, otp: values.otp })}
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
