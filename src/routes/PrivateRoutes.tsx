import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PrivateRoutes = () => {
  const { token } = useAuthStore();

  const isValidToken = (accessToken: any) => {
    if (!accessToken) return false;
    return true;
  };
  return isValidToken(token) ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoutes;
