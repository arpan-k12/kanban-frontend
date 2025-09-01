import React, { useState } from "react";
import type { User } from "../../types/user.type";
import { getOrganization } from "../../api/organizationAPI";
import { useOrganization } from "../../context/OrganizationContext";

interface Organization {
  id: string;
  name: string;
}

interface HeaderProps {
  user: User;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, handleLogout }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { selectedOrg, setSelectedOrg } = useOrganization();

  const fetchOrganizations = async () => {
    const response = await getOrganization();
    setOrganizations(response);
  };
  const handleOrgChange = (orgId: string) => {
    setSelectedOrg(orgId);
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-xl">Kanban Board</h1>
      <div className="flex items-center">
        <select
          value={selectedOrg}
          onFocus={fetchOrganizations}
          onChange={(e) => handleOrgChange(e.target.value)}
          className="mr-4 bg-gray-700 text-white px-2 py-1 rounded"
        >
          <option value="">Select Organization</option>
          {organizations?.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
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
