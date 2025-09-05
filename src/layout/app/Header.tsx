import React, { useEffect } from "react";
import type { User } from "../../types/user.type";
import { getUsersOrganizationByIdAPI } from "../../api/organizationAPI";
import { useOrganization } from "../../context/app/OrganizationContext";
import { useQuery } from "@tanstack/react-query";
import type { UserOrganizationType } from "../../types/userOrganization";

interface HeaderProps {
  user: User;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, handleLogout }) => {
  // const [organizations, setOrganizations] = useState<Organization[]>([]);

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
    <div className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-xl">Kanban Board</h1>
      <div className="flex items-center">
        <select
          value={selectedOrg}
          onChange={(e) => handleOrgChange(e.target.value)}
          className="mr-4 bg-gray-700 text-white px-2 py-1 rounded"
          disabled={isLoading}
        >
          {isLoading && <option value="">{"Loading..."}</option>}
          {orgList?.organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
          {orgList?.organizations?.length == 0 && (
            <option value="">No Organization</option>
          )}
        </select>
        <span className="mr-4">{user?.username || user?.email}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded cursor-pointer hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
