// import { createContext, useContext, useState } from "react";
// import type { ReactNode } from "react";
// import { getToken, getUser } from "../../utils/storage";
// import { logoutUser } from "../../api/auth.api";
// import { Navigate } from "react-router-dom";
// import UseToast from "../../hooks/useToast";

// type AuthContextType = {
//   user: any;
//   token: string | null;
//   login: (user: any, token: string) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<any>(getUser());

//   const [token, setToken] = useState<string | null>(getToken());

//   const login = (user: any, token: string) => {
//     if (!user || !token) {
//       <Navigate to="/login" />;
//       UseToast("Something went wrong, Please Login again", "error");
//     }
//     setUser(user);
//     setToken(token);
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//   };

//   const logout = () => {
//     logoutUser();
//     setUser(null);
//     setToken(null);
//     <Navigate to="/login" />;
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used inside AuthProvider");
//   return context;
// };
