import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signupUser } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Signup</h1>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              const data = await signupUser(
                values.username,
                values.email,
                values.password,
                values.confirmPassword
              );
              login(data?.data, data?.token);
              navigate("/board");
            } catch (err: any) {
              setFieldError(
                "general",
                err.response?.data?.message || "Signup failed"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>

              <p className="text-sm mt-3">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
