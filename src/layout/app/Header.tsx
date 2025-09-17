import React, { useEffect, useRef, useState } from "react";
import { getUsersOrganizationByIdAPI } from "../../api/usersOrganization.api";
import { useOrganization } from "../../context/app/OrganizationContext";
import { useQuery } from "@tanstack/react-query";
import type { UserOrganizationType } from "../../types/userOrganization";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { checkUserPermissionsAPI } from "../../api/users.api";
import { ChevronDown, LogOut } from "lucide-react";
import { Dropdown } from "../../components/common/Dropdown";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, setPermissions } = useAuthStore();
  const permissionsFetched = useRef(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: permissionsData } = useQuery({
    queryKey: ["checkUserPermissionsAPI"],
    queryFn: checkUserPermissionsAPI,
    enabled: !!user?.id && !permissionsFetched.current,
  });

  useEffect(() => {
    if (permissionsData && !permissionsFetched.current) {
      setPermissions(permissionsData?.permissions);
      permissionsFetched.current = true;
    }
  }, [permissionsData, setPermissions]);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const { selectedOrg, setSelectedOrg } = useOrganization();

  const { data: orgList, isLoading: isLoading } =
    useQuery<UserOrganizationType>({
      queryKey: ["getUsersOrganizationByIdAPI", user?.id],
      queryFn: () => getUsersOrganizationByIdAPI(user?.id!),
      enabled: !!user?.id,
    });

  useEffect(() => {
    if (
      !isLoading &&
      orgList &&
      Array.isArray(orgList.organizations) &&
      orgList.organizations.length > 0 &&
      !selectedOrg
    ) {
      setSelectedOrg(orgList?.organizations[0].id);
    }
  }, [orgList, isLoading, selectedOrg, setSelectedOrg]);

  const handleOrgChange = (orgId: string) => {
    setSelectedOrg(orgId);
  };

  return (
    <header className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-wide text-blue-400">
          Kanban
        </span>
        <span className="hidden sm:inline text-gray-400">Board</span>
      </div>

      <div className="flex">
        <div className="flex-1 flex justify-center mr-[7rem]">
          <select
            value={selectedOrg}
            onChange={(e) => handleOrgChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            disabled={isLoading}
          >
            {isLoading && <option value="">Loading...</option>}
            {orgList?.organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
            {orgList?.organizations?.length === 0 && (
              <option value="">No Organization</option>
            )}
          </select>
        </div>

        <div className="relative">
          <button
            className="dropdown-toggle flex items-center gap-2 focus:outline-none cursor-pointer"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold uppercase">
              {user?.username?.[0] || user?.email?.[0]}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition ${
                isDropdownOpen ? "rotate-180 text-white" : ""
              }`}
            />
          </button>

          <Dropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
          >
            <div className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              {user?.username || user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
