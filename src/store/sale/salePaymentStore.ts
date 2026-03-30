import { create } from "zustand";
import { SalePayment } from "../../types";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";

interface PaymentStoreProps {
  sale_payments: SalePayment[];
  isFetched: boolean;
  fetchSalePayments: () => Promise<void>;
  addSalePayment: (data: any) => Promise<void>;
  editSalePayment: (id: string, data: any) => Promise<void>;
  deleteSalePayment: (id: string) => Promise<void>;
}

const URL = backendRoutes.sales.payment;

const SalePaymentStore = create<PaymentStoreProps>((set) => ({
  sale_payments: [],
  isFetched: false,

  fetchSalePayments: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ sale_payments: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  addSalePayment: async (data: SalePayment) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "Sale payment added successfully");
        set((state) => ({
          sale_payments: [...state.sale_payments, resp.data.data],
        }));
      } else {
        toastError(resp.data.message || "Failed to add sale payment");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editSalePayment: async (id: string, data: SalePayment) => {
    try {
      const resp = await api.put(`${URL}/${id}`, data);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Sale payment updated successfully");
        set((state) => ({
          sale_payments: state.sale_payments.map((pay) =>
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

  deleteSalePayment: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Sale payment deleted successfully");
        set((state) => ({
          sale_payments: state.sale_payments.filter((itm) => itm.id !== id),
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

export default SalePaymentStore;
