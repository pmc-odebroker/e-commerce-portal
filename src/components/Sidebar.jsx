import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaBox, FaChevronDown, FaChevronUp, FaShoppingCart, FaCog, FaTags, FaListAlt } from "react-icons/fa";
import { MENU_CONFIG } from "../constants/MENU";

export default function Sidebar({ toggleSubMenu, subMenuOpen, PATH, sidebarVisible, role }) {
    if (!sidebarVisible) return null;

    const location = useLocation();
  
    const isAdmin = role === "SUPERADMIN";
    const isVendor = role === "VENDOR";

    const isSubMenuActive = (menuKey) =>
    MENU_CONFIG[menuKey]?.some((path) => location.pathname.startsWith(path));
  
    return (
      <aside className="sidebar bg-white p-4 shadow-md h-screen flex flex-col">
        <h2 className="text-2xl font-bold mb-6 sidebarTitle sticky top-0 bg-white z-10 p-4 shadow-sm">
          {isAdmin ? "Admin Panel" : isVendor ? "Vendor Panel" : ""}
        </h2>
  
        <nav className="flex-1 overflow-y-auto custom-scrollbar"> {/* Make the nav scrollable */}
          <ul className="space-y-4">
            {isAdmin ? (
              <>
                <li>
                  <NavLink
                    to={PATH.ADMIN_DASHBOARD}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    <FaHome className="text-xl" />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
  
                {/* Vendors Section */}
                <li>
                  <div
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      isSubMenuActive("vendors") ? "active" : ""
                    }`}
                    onClick={() => toggleSubMenu("vendors")}
                  >
                    <div className="flex items-center gap-3">
                      <FaUsers className="text-xl" />
                      <span>Vendors</span>
                    </div>
                    {subMenuOpen.vendors ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {subMenuOpen.vendors && (
                    <ul className="ml-8">
                      <li>
                        <NavLink
                          to={PATH.ADMIN_VENDORS}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          Vendor List
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={PATH.ADMIN_VENDOR_DETAIL(":id")}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          Vendor Details
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
  
                {/* Orders Section */}
                <li>
                  <NavLink
                    to={PATH.ADMIN_ORDERS}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    <FaBox className="text-xl" />
                    <span>Orders</span>
                  </NavLink>
                </li>

                {/* Settings Section */}
                <li>
                  <div
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      isSubMenuActive("settings") ? "active" : ""
                    }`}
                    onClick={() => toggleSubMenu("settings")}
                  >
                    <div className="flex items-center gap-3">
                      <FaCog className="text-xl" />
                      <span>Settings</span>
                    </div>
                    {subMenuOpen.settings ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {subMenuOpen.settings && (
                    <ul className="ml-8">
                      <li>
                        <NavLink
                          to={PATH.ADMIN_CATEGORIES}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaTags className="text-xl" />
                          <span>Categories</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={PATH.ADMIN_PRODUCT_STATUSES}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                          }
                        >
                          <FaListAlt className="text-xl" />
                          <span>Product Statuses</span>
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            ) : isVendor ? (
              <>
                <li>
                  <NavLink
                    to={PATH.VENDOR_DASHBOARD}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  > 
                  <FaHome className="text-xl" />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={PATH.VENDOR_PRODUCTS}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    <FaBox className="text-xl" />
                    <span>Products</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={PATH.VENDOR_ORDERS}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    <FaShoppingCart className="text-xl" />
                    <span>Orders</span>
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="text-red-600">Access Denied</li>
            )}
          </ul>
        </nav>
      </aside>
    );
  }
  
