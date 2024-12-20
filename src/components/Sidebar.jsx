import { NavLink, Link } from "react-router-dom";
import { FaHome, FaUsers, FaClipboardList, FaBox, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Sidebar({ toggleSubMenu, subMenuOpen, PATH, sidebarVisible, role }) {

    if (!sidebarVisible) return null;
    console.log(role);
    const isAdmin = role === "SUPERADMIN";
    const isVendor = role === "VENDOR";

    return (
        <aside className="sidebar bg-white p-4 shadow-md">
        <h2 className="text-2xl font-bold mb-6 sidebarTitle">Admin Panel</h2>
            <nav>
                <ul className="space-y-4">
                {isAdmin ? (
                    <>
                    <li>
                        <NavLink
                        to={PATH.ADMIN_DASHBOARD}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${
                            isActive ? "active" : ""
                            }`
                        }
                        >
                        <FaHome className="text-xl" />
                        <span>Dashboard</span>
                        </NavLink>
                    </li>

                    {/* Vendors Section */}
                    <li>
                        <div
                        className="flex items-center justify-between p-3 rounded-md transition-all duration-300 cursor-pointer"
                        onClick={() => toggleSubMenu("vendors")}
                        >
                        <div className="flex items-center gap-3">
                            <FaUsers className="text-xl" />
                            <span>Vendors</span>
                        </div>
                        {subMenuOpen.vendors ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {subMenuOpen.vendors && (
                        <ul className="ml-6 space-y-2">
                            <li>
                            <NavLink
                                to={PATH.ADMIN_VENDORS}
                                className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${
                                    isActive ? "active" : ""
                                }`
                                }
                            >
                                Vendor List
                            </NavLink>
                            </li>
                            <li>
                            <NavLink
                                to={PATH.ADMIN_VENDOR_DETAIL(":id")}
                                className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${
                                    isActive ? "active" : ""
                                }`
                                }
                            >
                                Vendor Details
                            </NavLink>
                            </li>
                        </ul>
                        )}
                    </li>

                    {/* Customers Section */}
                    <li>
                        <div
                        className="flex items-center justify-between p-3 rounded-md transition-all duration-300 cursor-pointer"
                        onClick={() => toggleSubMenu("customers")}
                        >
                        <div className="flex items-center gap-3">
                            <FaClipboardList className="text-xl" />
                            <span>Customers</span>
                        </div>
                        {subMenuOpen.customers ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {subMenuOpen.customers && (
                        <ul className="ml-6 space-y-2">
                            <li>
                            <NavLink
                                to={PATH.ADMIN_CUSTOMERS}
                                className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${
                                    isActive ? "active" : ""
                                }`
                                }
                            >
                                Customer List
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
                            `flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${
                            isActive ? "active" : ""
                            }`
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
                        <Link
                        to={PATH.VENDOR_DASHBOARD}
                        className="flex items-center gap-3 p-3 rounded-md text-blue-600 hover:underline"
                        >
                        Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                        to={PATH.VENDOR_PRODUCTS}
                        className="flex items-center gap-3 p-3 rounded-md text-blue-600 hover:underline"
                        >
                        Products
                        </Link>
                    </li>
                    <li>
                        <Link
                        to={PATH.VENDOR_ORDERS}
                        className="flex items-center gap-3 p-3 rounded-md text-blue-600 hover:underline"
                        >
                        Orders
                        </Link>
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
