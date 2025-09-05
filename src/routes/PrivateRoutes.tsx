import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const isValidToken = (accessToken: any) => {
    if (!accessToken) return false;
    return true;
  };
  return isValidToken(localStorage.getItem("token")) ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};

export default PrivateRoutes;
