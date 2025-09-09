import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import AdminLayout from "../layout/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import Organization from "../pages/admin/Organization/Organization";
import NotFound from "../pages/admin/OtherPage/NotFound";
import OrganizationLayout from "../layout/admin/OrganizationLayout";
import AddOrganization from "../components/admin/organization/AddOrganization";
import EditOrganization from "../components/admin/organization/EditOrganization";
import UsersOrganizationLayout from "../layout/admin/UsersOrganizationLayout";
import UsersOrganization from "../pages/admin/Users/UsersOrganization";
import AssignUsersOrganization from "../components/admin/usersOrganization/AssignUsersOrganization";
import EditAssignUsersOrganization from "../components/admin/usersOrganization/EditAssignUsersOrganization";
import DashboardLayout from "../layout/admin/DashboardLayout";
import EditDashboard from "../components/admin/user/EditDashboard";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            {/* <Route path="add-Dashboard" element={<AddDashboard />} /> */}
            <Route path="edit-dashboard/:id" element={<EditDashboard />} />
          </Route>

          {/* <Route path="/organization" element={<Organization />} /> */}

          <Route path="organization" element={<OrganizationLayout />}>
            <Route index element={<Organization />} />
            <Route path="add-Organization" element={<AddOrganization />} />
            <Route
              path="edit-organization/:id"
              element={<EditOrganization />}
            />
          </Route>

          <Route
            path="users-organization"
            element={<UsersOrganizationLayout />}
          >
            <Route index element={<UsersOrganization />} />
            <Route
              path="assign-organization"
              element={<AssignUsersOrganization />}
            />
            <Route
              path="edit-assign-organization/:id"
              element={<EditAssignUsersOrganization />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
