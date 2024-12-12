import { Link, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../constants/AXIOS_CONFIG";
import { PATH } from "../constants/PATH";
import { FaHome, FaUsers, FaClipboardList, FaBox, FaSignOutAlt } from "react-icons/fa";
import defaultProfileImage from "../assets/profile-image.png";
import { useState } from "react";

export default function AdminLayout() {
  const { user, token, setUser, setToken } = useStateContext();
  const [dropdownVisible, setDropdownVisible] = useState(false);

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

  return (
    <div id="adminLayout" className="flex min-h-screen bg-gray-200 gap-x-6">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to={PATH.ADMIN_DASHBOARD}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500 transition-all duration-300"
              >
                <FaHome className="text-xl" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to={PATH.ADMIN_VENDORS}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500 transition-all duration-300"
              >
                <FaUsers className="text-xl" />
                <span>Vendors</span>
              </Link>
            </li>
            <li>
              <Link
                to={PATH.ADMIN_CUSTOMERS}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500 transition-all duration-300"
              >
                <FaClipboardList className="text-xl" />
                <span>Customers</span>
              </Link>
            </li>
            <li>
              <Link
                to={PATH.ADMIN_ORDERS}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500 transition-all duration-300"
              >
                <FaBox className="text-xl" />
                <span>Orders</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 relative">
          <div>
            {/* Provide a gap */}
          </div>
          
          <div
            className="flex items-center gap-3 cursor-pointer"
            onMouseEnter={() => setDropdownVisible(true)}
          >
            <div className="text-lg font-bold text-blue-600">
              Welcome, {user?.firstName} {user?.lastName}
            </div>

            <img
              src={user?.profileImage || defaultProfileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />

            {dropdownVisible && (
              <div
                className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-2 w-40 z-10"
                onMouseEnter={() => setDropdownVisible(true)}
                onMouseLeave={() => setDropdownVisible(false)}
              >
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200 rounded-md"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>


        {/* Main Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
