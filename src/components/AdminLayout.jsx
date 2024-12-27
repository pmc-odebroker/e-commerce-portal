import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { useStateContext } from "../contexts/ContextProvider";
import axiosConfig from "../constants/AXIOS_CONFIG";
import { PATH } from "../constants/PATH";
import API from "../constants/API";

export default function AdminLayout() {
  const { user, token, setUser, setToken } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [subMenuOpen, setSubMenuOpen] = useState({
    vendors: false,
    customers: false,
  });

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
      await axiosConfig.post(API.LOGOUT);
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
    <div id="adminLayout" className="flex h-screen bg-gray-200">
      <Sidebar
        toggleSubMenu={toggleSubMenu}
        subMenuOpen={subMenuOpen}
        PATH={PATH}
        sidebarVisible={sidebarVisible}
        role={user?.roleName}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
          user={user}
          onLogout={onLogout}
        />

        <main className="p-6 flex-1 overflow-y-auto max-h-screen">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
