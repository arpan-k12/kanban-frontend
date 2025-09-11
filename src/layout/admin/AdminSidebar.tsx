import { Link, useLocation } from "react-router-dom";
import { Building, Grid, MoreHorizontal, UserCircle } from "lucide-react";
import { useSidebar } from "../../context/admin/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  { icon: <Grid size={18} />, name: "Dashboard", path: "/dashboard" },
  { icon: <Building size={18} />, name: "Organization", path: "/organization" },
  {
    icon: <UserCircle size={18} />,
    name: "Users",
    path: "/users-organization",
  },
];

const AdminSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`fixed mt-16 lg:mt-0 top-0 left-0 z-50 h-screen border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 transition-all duration-300 
        ${isExpanded || isMobileOpen || isHovered ? "w-72" : "w-20"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-6 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-center"
        }`}
      >
        <Link
          to="/dashboard"
          className="text-lg font-semibold text-gray-700 dark:text-gray-200"
        >
          Home
        </Link>
      </div>
      <nav className="flex flex-col gap-6 px-4 overflow-y-auto no-scrollbar">
        <h2
          className={`mb-2 text-xs uppercase text-gray-400 flex ${
            !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
        >
          {isExpanded || isHovered || isMobileOpen ? (
            "Menu"
          ) : (
            <MoreHorizontal className="size-5" />
          )}
        </h2>

        <ul className="flex flex-col gap-2">
          {navItems.map((nav) => {
            const active = isActive(nav.path);
            return (
              <li key={nav.name}>
                <Link
                  to={nav.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                    ${
                      active
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                >
                  <span className="flex items-center justify-center w-6 h-6">
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span>{nav.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
