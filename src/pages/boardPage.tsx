import Board from "../components/kanban/Board";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function BoardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 text-white p-4 flex justify-between">
        <h1 className="text-xl">Kanban Board</h1>
        <div>
          <span className="mr-4">{user?.username || user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded cursor-pointer hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 bg-gray-200 p-6">
        <Board />
      </div>
    </div>
  );
}
