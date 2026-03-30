import { lazy } from "react";

// auth
const SignInPage = lazy(() => import("./auth/SignInPage"))
// public
const HomePage = lazy(() => import("./public/HomePage"))
const AccessDenied = lazy(() => import("./public/AccessDenied"))
const NotFound = lazy(() => import('./public/NotFound'))
// dashboard
const DashboardPage = lazy(() => import("./protected/DashboardPage"))
const UserPage = lazy(() => import("./protected/user/UserPage"))
const CategoryPage = lazy(() => import("./protected/category/CategoryPage"))
const ProductPage = lazy(() => import("./protected/product/ProductPage"))
const ProductAttributePage = lazy(() => import("./protected/product/ProductAttributePage"))
const StockPage = lazy(() => import("./protected/stock/StockPage"))
const StockTransactionPage = lazy(() => import("./protected/stock/StockTransactionPage"))
const CustomerPage = lazy(() => import("./protected/customer/CustomerPage"))
const SupplierPage = lazy(() => import("./protected/supplier/SupplierPage"))
const SupplierPaymentPage = lazy(() => import("./protected/supplier/SupplierPaymentPage"))
const PurchaseOrderPage = lazy(() => import("./protected/purchase/PurchaseOrder"))
const PurchaseOrderItemPage = lazy(() => import("./protected/purchase/PurchaseItem"))
const GoodsReceivedNotePage = lazy(() => import("./protected/purchase/GoodsReceivedNote"))
const SaleOrderPage = lazy(() => import("./protected/sale/SaleOrder"))
const SaleItemPage = lazy(() => import("./protected/sale/SaleItem"))
const DeliveryNotePage = lazy(() => import("./protected/sale/DeliveryNote"))
const SalePaymentPage = lazy(() => import("./protected/sale/SalePayment"))

export {
    SignInPage,
    HomePage,
    AccessDenied,
    NotFound,
    DashboardPage,
    UserPage,
    CategoryPage,
    // product
    ProductPage,
    ProductAttributePage,
    // stock
    StockPage,
    StockTransactionPage,
    CustomerPage,
    SupplierPage,
    SupplierPaymentPage,
    // purchase
    PurchaseOrderPage,
    PurchaseOrderItemPage,
    GoodsReceivedNotePage,
    // sale
    SaleOrderPage,
    SaleItemPage,
    DeliveryNotePage,
    SalePaymentPage
}