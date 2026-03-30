export interface Supplier {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface SupplierPayment {
  id?: string;
  supplierId: string | null;
  payment_method: string; // "cash" | "bank" | "cheque" | "other"
  amount: number;
  createdAt: string;
  reference: string;
  supplierName?: string;
}
