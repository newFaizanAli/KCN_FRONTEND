import {
  ArchiveIcon,
  ArrowRightLeft,
  BarChart2,
  Boxes,
  Clipboard,
  ClipboardIcon,
  CreditCard,
  FileText,
  Home,
  Layers,
  LayoutDashboard,
  LucideIcon,
  Package,
  Settings,
  ShoppingCart,
  User2,
  UserCheck,
  UserCircle,
  Users2Icon,
  Wrench,
  ArrowUpFromLine,
  FileTextIcon,
} from "lucide-react";

import { ROUTES_PATHS } from "../routes/routes_path";

const NAV_TREE: {
  id: string;
  label: string;
  icon: LucideIcon;
  allowed: null | string[];
  children: {
    id: string;
    label: string;
    icon: LucideIcon;
    allowed: null | string[];
    route?: string;
  }[];
}[] = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    allowed: null,
    children: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        allowed: null,
        route: ROUTES_PATHS?.DASHBOARD?.ROOT,
      },
      { id: "analytics", label: "Analytics", icon: BarChart2, allowed: null },
    ],
  },
  {
    id: "catalog",
    label: "Catalog",
    icon: Package,
    allowed: null,
    children: [
      {
        id: "categories",
        label: "Categories",
        icon: FileText,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.CATEGORY.ROOT,
      },
      {
        id: "products",
        label: "Products",
        icon: Layers,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.PRODUCT.ROOT,
      },
      {
        id: "customer",
        label: "Customer",
        icon: UserCircle,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.CUSTOMER.ROOT,
      },
    ],
  },
  {
    id: "stock",
    label: "Stock",
    icon: ArchiveIcon,
    allowed: null,
    children: [
      {
        id: "stocks",
        label: "Stocks",
        icon: Boxes,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.STOCK.ROOT,
      },
      {
        id: "stock_transactions",
        label: "Stock Transactions",
        icon: ArrowRightLeft,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.STOCK.TRANSACTION,
      },
    ],
  },
  {
    id: "supplier_module",
    label: "Supplier",
    icon: Users2Icon, // top-level icon representing suppliers
    allowed: null,
    children: [
      {
        id: "supplier",
        label: "Supplier",
        icon: User2,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.SUPPLIER.ROOT,
      },
      {
        id: "supplier_payment",
        label: "Supplier Payment",
        icon: CreditCard, // better represents payments
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.SUPPLIER.PAYMENT,
      },
    ],
  },
  {
    id: "purchase",
    label: "Purchase",
    icon: ShoppingCart,
    allowed: null,
    children: [
      {
        id: "purchase_orders",
        label: "Purchase Orders",
        icon: Clipboard,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.PURCHASE.ORDER,
      },
      {
        id: "combined_purchase",
        label: "Combined Purchase",
        icon: ClipboardIcon,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.PURCHASE.COMBINED,
      },
      {
        id: "goods_received_notes",
        label: "Goods Received Notes",
        icon: Package,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.PURCHASE.GRN,
      },
    ],
  },
  {
    id: "sale",
    label: "Sale",
    icon: ShoppingCart,
    allowed: null,
    children: [
      {
        id: "sale_orders",
        label: "Sale Orders",
        icon: FileText,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.SALE.ORDER,
      },
      {
        id: "combined_sale",
        label: "Combined Sale",
        icon: FileTextIcon,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.SALE.COMBINED,
      },
      {
        id: "delivery_notes",
        label: "Delivery Notes",
        icon: ArrowUpFromLine,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.SALE.DN,
      },
      {
        id: "sale_payment",
        label: "Sale Payment",
        icon: CreditCard,
        allowed: null,
        route: ROUTES_PATHS.DASHBOARD.SALE.PAYMENT,
      },
    ],
  },

  {
    id: "system",
    label: "System",
    icon: Wrench,
    allowed: ["admin"],
    children: [
      {
        id: "users",
        label: "User Mgmt",
        icon: UserCheck,
        allowed: ["admin"],
        route: ROUTES_PATHS.DASHBOARD.USER.ROOT,
      },
      { id: "reports", label: "Reports", icon: FileText, allowed: ["admin"] },
      { id: "settings", label: "Settings", icon: Settings, allowed: ["admin"] },
    ],
  },
];

export default NAV_TREE;
