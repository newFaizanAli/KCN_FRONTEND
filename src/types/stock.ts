export interface Stock {
  id?: string;
  productId: string | null;
  quantity: number;
  serial_number: string | null;
  productName?: string;
}

export interface StockTransaction {
  id?: string;
  stockId: string | null;
  quantity: number;
  type: "IN" | "OUT" | null;
  reference_id: string | null;
  notes: string | null;
  productName?: string;
}
