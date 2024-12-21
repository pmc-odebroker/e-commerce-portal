import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaBox, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Sidebar({ toggleSubMenu, subMenuOpen, PATH, sidebarVisible, role }) {
    if (!sidebarVisible) return null;
  
    const isAdmin = role === "SUPERADMIN";
    const isVendor = role === "VENDOR";
  
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
                    className="flex items-center justify-between p-3 rounded-md cursor-pointer"
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
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={PATH.VENDOR_PRODUCTS}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    Products
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={PATH.VENDOR_ORDERS}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-md ${isActive ? "active" : ""}`
                    }
                  >
                    Orders
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
  
