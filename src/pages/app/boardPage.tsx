import Header from "../../layout/app/Header";
import Board from "../../components/kanban/Board";
import { useAuth } from "../../context/app/AuthContext";
import { useNavigate } from "react-router-dom";
import { OrganizationProvider } from "../../context/app/OrganizationContext";
import GlobalLoader from "../../utils/GlobalLoader";

export default function BoardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col">
      <OrganizationProvider>
        <Header user={user} handleLogout={handleLogout} />
        <GlobalLoader />
        <div className="flex-1 bg-gray-200 p-6">
          <Board />
        </div>
      </OrganizationProvider>
    </div>
  );
}
