import { Link, Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../constants/AXIOS_CONFIG";
import PATH from "../constants/ROUTER";

export default function VendorLayout() {
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

  // Redirect non-vendor users to the vendor login page
  if (!token) {
    return <Navigate to={PATH.AUTH_LOGIN_VENDOR} />;
  }

  if (user?.role !== "vendor") {
    return <Navigate to={PATH.AUTH_LOGIN_VENDOR} />;
  }

  return (
    <div id="vendorLayout" className="flex">
      <aside className="w-1/5 bg-gray-200 min-h-screen p-4">
        <nav>
          <ul>
            <li className="mb-2">
              <Link to={PATH.VENDOR_DASHBOARD} className="text-blue-600 hover:underline">
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link to={PATH.VENDOR_PRODUCTS} className="text-blue-600 hover:underline">
                Products
              </Link>
            </li>
            <li className="mb-2">
              <Link to={PATH.VENDOR_ORDERS} className="text-blue-600 hover:underline">
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="content flex-1">
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <div className="header-left text-lg font-bold">Vendor Panel</div>
          <div className="header-right flex items-center gap-4">
            <span className="font-medium">{user?.name || "Vendor"}</span>
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
