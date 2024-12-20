import { useState, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../constants/AXIOS_CONFIG";
import { PATH } from "../constants/PATH";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import defaultProfileImage from "../assets/profile-image.png";

export default function AdminLayout() {
  const { user, token, setUser, setToken } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState({
    vendors: false,
    customers: false,
  });

  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("USER_DATA");
    const storedToken = localStorage.getItem("ACCESS_TOKEN");

    if (storedUser && storedToken) {
      if (!user || !token) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    }
    setLoading(false);
  }, [setUser, setToken]);

  const toggleSubMenu = (menu) => {
    setSubMenuOpen((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const onLogout = async (ev) => {
    ev.preventDefault();
    try {
      await axiosClient.post("auth/logout");
      setUser(null);
      setToken(null);
      localStorage.removeItem("USER_DATA");
      localStorage.removeItem("ACCESS_TOKEN");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!token || !user) return <Navigate to={PATH.AUTH_ADMIN_LOGIN} />;
  if (user?.roleName !== "SUPERADMIN") return <Navigate to={PATH.AUTH_ADMIN_LOGIN} />;

  return (
    <div id="adminLayout" className="flex min-h-screen bg-gray-200">
      <Sidebar
        toggleSubMenu={toggleSubMenu}
        subMenuOpen={subMenuOpen}
        PATH={PATH}
        sidebarVisible={sidebarVisible}
        role={user?.roleName}
      />
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <button
            className="text-2xl text-black hover:text-primary transition-all"
            onClick={() => setSidebarVisible((prev) => !prev)}
          >
            {sidebarVisible ? <FaTimes /> : <FaBars />}
          </button>
          <div
            className="flex items-center gap-3 relative"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <span className="text-lg font-bold text-blue-600">
              Welcome, {user?.firstName} {user?.lastName}
            </span>
            <img
              src={user?.profileImage || defaultProfileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-2 w-40 z-10">
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
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
