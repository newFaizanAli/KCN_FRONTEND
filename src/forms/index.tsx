import { lazy } from "react";

const UserForm = lazy(() => import("./UserForm"));
const CategoryForm = lazy(() => import("./CategoryForm"));
const ProductForm = lazy(() => import("./product/ProductForm"));
const ProdAttributeForm = lazy(() => import("./product/ProdAttributeForm"));
const StockForm = lazy(() => import("./stock/StockForm"))
const StockTransactionForm = lazy(() => import("./stock/StockTransactionForm"))
const CustomerForm = lazy(() => import("./customer/CustomerForm"))
const SupplierForm = lazy(() => import("./supplier/SupplierForm"))
const SupplierPaymentForm = lazy(() => import("./supplier/SupplierPaymentForm"))
const PurchaseOrderForm = lazy(() => import("./purchase/PurchaseOrderForm"))
const PurchaseItemForm = lazy(() => import("./purchase/PurchaseItemForm"))
const CombinedPurchaseForm = lazy(() => import("./purchase/CombinedPurchaseForm"))
const GRNForm = lazy(() => import("./purchase/GRNForm"))
const SaleOrderForm = lazy(() => import("./sale/SaleOrderForm"))
const SaleItemForm = lazy(() => import("./sale/SaleItemForm"))
const CombinedSaleForm = lazy(() => import("./sale/CombinedSaleForm"))
const DeliveryNoteForm = lazy(() => import("./sale/DeliveryNoteForm"))
const SalePaymentForm = lazy(() => import("./sale/SalePaymentForm"))

export {
    UserForm,
    CategoryForm,
    ProductForm,
    ProdAttributeForm,
    StockForm,
    StockTransactionForm,
    CustomerForm,
    SupplierForm,
    SupplierPaymentForm,
    PurchaseOrderForm,
    PurchaseItemForm,
    CombinedPurchaseForm,
    GRNForm,
    SaleOrderForm,
    SaleItemForm,
    CombinedSaleForm,
    DeliveryNoteForm,
    SalePaymentForm
}