export interface PurchaseOrder {
  id?: string;
  supplierName?: string;
  supplierId: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  tax: number;
  totalAmount?: number;
}

export interface PurchaseOrderItem {
  id?: string;
  productId: string | null;
  purchaseId: string | PurchaseOrder | null;
  quantity: number;
  unit_cost: number;
  total: number;

  orderId?: string;
  orderStatus?: string;
  orderTax?: number;

  productName?: string;
  productSku?: string;
}

export interface CombinedPurchaseOrderPayload {
  supplierId: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  tax: number;
  items: Array<{
    productId: string | null;
    quantity: number;
    unit_cost: number;
    total: number;
  }>;
}

export interface GoodsReceivedNote {
  id?: string;
  purchaseId: string | PurchaseOrder | null;
  createdAt: string | null;
  supplierName?: string;
  supplierId?: string;
}
