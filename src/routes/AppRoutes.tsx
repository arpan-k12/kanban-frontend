import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../modules/auth/Login";
import Signup from "../modules/auth/Signup";
import Board from "../pages/boardPage";
import type { ReactElement } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/board"
          element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
