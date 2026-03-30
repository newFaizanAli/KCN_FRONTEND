export interface SalesOrder {
  id?: string;
  customerName?: string;
  customerId: string | null;
  status: "pending" | "approved" | "rejected";
  payment_status: "pending" | "paid";
  total_amount?: number;
  tax: number;
  discount: number;
  createdAt: string;
}

export interface SaleOrderItem {
  id?: string;
  productId: string | null;
  saleId: string | null;
  quantity: number;
  price: number;

  orderId?: string;
  orderStatus?: "pending" | "approved" | "rejected";
  orderPaymentStatus?: string;

  productName?: string;
  productSku?: string;
}

export interface CombinedSaleOrderPayload {
  customerId: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  tax: number;
  discount: number;
  items: Array<{
    productId: string | null;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export interface DeliveryNote {
  id?: string;
  saleId: string | null;
  createdAt: string | null;
  customerName?: string;
  customerId?: string;
}

export interface SalePayment {
  id?: string;
  saleId: string | null;
  method: string; //  "cash" | "card" | "transfer" | "cheque" | "other";
  reference_id: string;
  type: string; // "SALE" | "SERVICE" | "OTHER";
  createdAt: string;
  note: string;
  customerName?: string;
  customerId?: string;
}
