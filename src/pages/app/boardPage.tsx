import Header from "../../layout/app/Header";
import Board from "../../components/app/kanban/Board";
import { OrganizationProvider } from "../../context/app/OrganizationContext";
import GlobalLoader from "../../utils/GlobalLoader";

export default function BoardPage() {
  return (
    <div className="h-screen flex flex-col">
      <OrganizationProvider>
        <Header />
        <GlobalLoader />
        <div className="flex-1 bg-gray-200 p-6">
          <Board />
        </div>
      </OrganizationProvider>
    </div>
  );
}
