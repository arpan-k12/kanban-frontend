import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/app/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
export default App;

// src
//  ├── api/                # Shared API services (auth, org, users, kanban, etc.)
//  ├── components/         # Shared small components (buttons, modals, loaders)
//  ├── context/            # Shared contexts (auth, organization, etc.)
//  ├── hooks/              # Shared custom hooks
//  ├── layouts/            # Different layouts
//  │    ├── admin/         # Sidebar + Header for admin
//  │    └── app/           # Header + Kanban for user
//  ├── modules/            # Big feature-specific UIs
//  │    ├── admin/         # Admin-specific UI modules
//  │    │    ├── organization/
//  │    │    ├── user/
//  │    │    └── usersorganization/
//  │    └── app/           # User-facing Kanban UI modules
//  │         ├── board/
//  │         └── cards/
//  ├── pages/              # Routing entry points
//  │    ├── admin/         # Admin pages
//  │    └── app/           # User app pages
//  ├── routes/
//  │    ├── AdminRoutes.tsx
//  │    └── AppRoutes.tsx
//  ├── types/              # Shared TypeScript types
//  ├── utils/              # Helpers (toast, loaders, formatters)

// import { useAuth } from "./context/AuthContext";
// import AdminRoutes from "./routes/AdminRoutes";
// import AppRoutes from "./routes/AppRoutes";

// function App() {
//   const { user } = useAuth();

//   if (!user) return <Login />;

//   return user.role === "admin" ? <AdminRoutes /> : <AppRoutes />;
// }

// export default App;

// // AdminRoutes.tsx
// <AdminLayout>
//    <Routes>
//       <Route path="/admin/dashboard" element={<Dashboard />} />
//       <Route path="/admin/users" element={<Users />} />
//    </Routes>
// </AdminLayout>

// // AppRoutes.tsx
// <AppLayout>
//    <Routes>
//       <Route path="/app/board" element={<Board />} />
//       <Route path="/app/projects" element={<Projects />} />
//    </Routes>
// </AppLayout>
