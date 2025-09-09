import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import { loginUserAPI } from "../../../api/auth.api";
import { useAuthStore } from "../../../store/authStore";

export default function SignIn() {
  const { login } = useAuthStore();

  // const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const { mutateAsync: mutateLogin, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUserAPI(email, password),
    onSuccess: (data: any) => {
      login(data.data, data.token);
      if (data?.data?.role == "0") {
        navigate("/dashboard");
      } else if (data?.data?.role == "1") {
        navigate("/board");
      } else {
        navigate("/signin");
      }
    },
    onError: (error: any) => {
      console.error(error);
      UseToast(error?.message || "Failed to Login, Please Try Again", "error");
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <Formik
          initialValues={{ email: "joi@gmail.com", password: "test123" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              await mutateLogin(values);
            } catch (err: any) {
              setFieldError(
                "general",
                err?.response?.data?.message || "Login failed"
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
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

              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-sm mt-3">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Signup
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
