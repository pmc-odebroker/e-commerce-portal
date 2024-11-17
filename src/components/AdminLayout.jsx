import { Link, Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

export default function AdminLayout() {
  const { user, token, setUser, setToken } = useStateContext();

  const onLogout = async (ev) => {
    ev.preventDefault();
    try {
      await axiosClient.post("auth/logout");
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Redirect non-admin users to the admin login page
  if (!token) {
    return <Navigate to="/auth/admin/login" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/auth/admin/login" />;
  }

  return (
    <div id="adminLayout" className="flex">
      <aside className="w-1/5 bg-gray-200 min-h-screen p-4">
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/admin/dashboard" className="text-blue-600 hover:underline">
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/vendors" className="text-blue-600 hover:underline">
                Vendors
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/customers" className="text-blue-600 hover:underline">
                Customers
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/orders" className="text-blue-600 hover:underline">
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="content flex-1">
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <div className="header-left text-lg font-bold">Admin Panel</div>
          <div className="header-right flex items-center gap-4">
            <span className="font-medium">{user?.name || "Admin"}</span>
            <button onClick={onLogout} className="btn btn-red">
              Logout
            </button>
          </div>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
