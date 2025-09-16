import React from "react";
import PublicHeader from "./PublicHeader";
import { Outlet } from "react-router-dom";

const PublicLayoutContent: React.FC = () => {
  return (
    <div>
      <div className="h-screen flex flex-col">
        <PublicHeader />
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const PublicLayout: React.FC = () => {
  return <PublicLayoutContent />;
};

export default PublicLayout;
