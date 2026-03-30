import { ReactNode } from "react"
import { ROUTES_PATHS } from "./routes_path"
import { AuthLayout, MainLayout } from "../layout"
import {
    NotFound, CategoryPage, DashboardPage, HomePage,
    SignInPage, UserPage, ProductPage, ProductAttributePage,
    StockPage, StockTransactionPage, CustomerPage,
    SupplierPage, SupplierPaymentPage, PurchaseOrderPage, PurchaseOrderItemPage,
    GoodsReceivedNotePage, SaleOrderPage, SaleItemPage, DeliveryNotePage, SalePaymentPage
} from "../pages"
import { CombinedPurchaseForm, CombinedSaleForm } from "../forms"

const appRoutes: {
    path: string,
    element: ReactNode,
    children?: {
        path: string,
        element: ReactNode
    }[]
}[] = [
        {
            path: '/',
            element: <AuthLayout />,
            children: [
                { path: ROUTES_PATHS.HOME, element: <HomePage /> },
            ],
        },
        {
            path: '/auth',
            element: <AuthLayout />,
            children: [
                { path: ROUTES_PATHS.AUTH.SIGNIN, element: <SignInPage /> },
            ],
        },
        {
            path: ROUTES_PATHS.DASHBOARD.ROOT,
            element: <MainLayout />,
            children: [
                { path: ROUTES_PATHS.DASHBOARD.ROOT, element: <DashboardPage /> },
                { path: ROUTES_PATHS.DASHBOARD.USER.ROOT, element: <UserPage /> },
                { path: ROUTES_PATHS.DASHBOARD.CATEGORY.ROOT, element: <CategoryPage /> },
                { path: ROUTES_PATHS.DASHBOARD.PRODUCT.ROOT, element: <ProductPage /> },
                { path: ROUTES_PATHS.DASHBOARD.PRODUCT.ATTRIBUTES, element: <ProductAttributePage /> },
                { path: ROUTES_PATHS.DASHBOARD.STOCK.ROOT, element: <StockPage /> },
                { path: ROUTES_PATHS.DASHBOARD.STOCK.TRANSACTION, element: <StockTransactionPage /> },
                { path: ROUTES_PATHS.DASHBOARD.CUSTOMER.ROOT, element: <CustomerPage /> },
                { path: ROUTES_PATHS.DASHBOARD.SUPPLIER.ROOT, element: <SupplierPage /> },
                { path: ROUTES_PATHS.DASHBOARD.SUPPLIER.PAYMENT, element: <SupplierPaymentPage /> },
                { path: ROUTES_PATHS.DASHBOARD.PURCHASE.ORDER, element: <PurchaseOrderPage /> },
                { path: ROUTES_PATHS.DASHBOARD.PURCHASE.ITEM, element: <PurchaseOrderItemPage /> },
                { path: ROUTES_PATHS.DASHBOARD.PURCHASE.COMBINED, element: <CombinedPurchaseForm /> },
                { path: ROUTES_PATHS.DASHBOARD.PURCHASE.GRN, element: <GoodsReceivedNotePage /> },
                { path: ROUTES_PATHS.DASHBOARD.SALE.ORDER, element: <SaleOrderPage /> },
                { path: ROUTES_PATHS.DASHBOARD.SALE.ITEM, element: <SaleItemPage /> },
                { path: ROUTES_PATHS.DASHBOARD.SALE.COMBINED, element: <CombinedSaleForm /> },
                { path: ROUTES_PATHS.DASHBOARD.SALE.DN, element: <DeliveryNotePage /> },
                { path: ROUTES_PATHS.DASHBOARD.SALE.PAYMENT, element: <SalePaymentPage /> },
            ],
        },
        { path: '*', element: <NotFound /> },
    ]

export default appRoutes