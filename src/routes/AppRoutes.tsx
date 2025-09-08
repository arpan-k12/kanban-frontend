import { Routes, Route, Navigate } from "react-router-dom";
import Board from "../pages/app/boardPage";
import type { ReactElement } from "react";
import NotFound from "../pages/admin/OtherPage/NotFound";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/signin" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/board"
        element={
          <ProtectedRoute>
            <Board />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
