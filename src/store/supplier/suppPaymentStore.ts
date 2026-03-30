import { create } from "zustand";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";
import api from "../../utilities/api";
import { SupplierPayment } from "../../types";

const URL = backendRoutes.suppliers.payment;

interface SupplierPaymentStore {
  supplier_payments: SupplierPayment[];
  isFetched: boolean;
  fetchSupplierPayment: () => Promise<void>;
  addSupplierPayment: (paymentData: any) => Promise<void>;
  editSupplierPayment: (id: string, paymentData: any) => Promise<void>;
  deleteSupplierPayment: (id: string) => Promise<void>;
}

const supplierStore = create<SupplierPaymentStore>((set) => ({
  supplier_payments: [],
  isFetched: false,

  fetchSupplierPayment: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ supplier_payments: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  addSupplierPayment: async (paymentData: SupplierPayment) => {
    try {
      const resp = await api.post(URL, paymentData);
      const message = resp.data.message || "";

      if (resp.data.success) {
        toastSuccess(message || "Supplier payment added successfully");
        set((state) => ({
          supplier_payments: [...state.supplier_payments, resp.data.data],
        }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editSupplierPayment: async (id: string, paymentData: SupplierPayment) => {
    try {
      const resp = await api.put(`${URL}/${id}`, paymentData);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Supplier payment updated successfully");
        set((state) => ({
          supplier_payments: state.supplier_payments.map((pay) =>
            pay.id === id ? resp.data.data : pay,
          ),
        }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  deleteSupplierPayment: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Supplier payment deleted successfully");
        set((state) => ({
          supplier_payments: state.supplier_payments.filter(
            (pay) => pay.id !== id,
          ),
        }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },
}));

export default supplierStore;
