import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "../context/app/AuthContext";
import AppRoutes from "./AppRoutes";
import AdminRoutes from "./AdminRoutes";
import SignIn from "../pages/common/AuthPages/SignIn";
import Signup from "../pages/common/AuthPages/SignUp";
import NotFound from "../pages/admin/OtherPage/NotFound";
import { useAuthStore } from "../store/authStore";

export default function RootRoutes() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/signin" />} /> */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="*" element={<NotFound />} /> */}

        {user?.role === "0" ? (
          <Route path="/*" element={<AdminRoutes />} />
        ) : user?.role === "1" ? (
          <Route path="/*" element={<AppRoutes />} />
        ) : (
          <Route path="*" element={<Navigate to="/signin" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
