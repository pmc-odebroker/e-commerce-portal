import { PATH } from "./PATH";
export const MENU_CONFIG = {
    vendors: [PATH.ADMIN_VENDORS, PATH.ADMIN_VENDOR_DETAIL(":id")],
    orders: [PATH.ADMIN_ORDERS],
    dashboard: [PATH.ADMIN_DASHBOARD],
  };