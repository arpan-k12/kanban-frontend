import { useQuery } from "@tanstack/react-query";
import type { User } from "../../../types/user.type";
import { GetAllUsersAPI } from "../../../api/users.api";
import UserList from "../../../components/admin/user/UserList";

export default function Dashboard() {
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery<User[]>({
    queryKey: ["GetAllUsersAPI"],
    queryFn: GetAllUsersAPI,
  });

  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load users.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard - User List</h1>
      <UserList data={users} />
    </div>
  );
}
