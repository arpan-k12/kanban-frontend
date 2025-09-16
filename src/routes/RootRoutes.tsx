import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AdminRoutes from "./AdminRoutes";
import SignIn from "../pages/common/AuthPages/SignIn";
import Signup from "../pages/common/AuthPages/SignUp";
import { useAuthStore } from "../store/authStore";
import PublicLayout from "../layout/public/PublicLayout";
import PublicProductPage from "../pages/public/PublicProductPage";
import ProductDetailPage from "../pages/public/ProductDetailPage";

export default function RootRoutes() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicProductPage />} />
          <Route path="/product/detail/:id" element={<ProductDetailPage />} />
        </Route>

        {/* Auth routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
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
