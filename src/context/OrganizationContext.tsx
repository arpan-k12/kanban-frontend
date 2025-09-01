import React, { createContext, useContext, useState } from "react";

const OrganizationContext = createContext<{
  selectedOrg: string;
  setSelectedOrg: (id: string) => void;
}>({ selectedOrg: "", setSelectedOrg: () => {} });

export const useOrganization = () => useContext(OrganizationContext);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedOrg, setSelectedOrg] = useState("");
  return (
    <OrganizationContext.Provider value={{ selectedOrg, setSelectedOrg }}>
      {children}
    </OrganizationContext.Provider>
  );
};
