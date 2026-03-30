import { create } from "zustand";
import { SaleOrderItem } from "../../types";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";

interface ItemStoreProps {
  sale_items: SaleOrderItem[];
  isFetched: boolean;
  fetchSaleItems: () => Promise<void>;
  fetchSaleItemByOrderId: (orderId: string) => Promise<SaleOrderItem[]>;
  addSaleItem: (data: any) => Promise<void>;
  editSaleItem: (id: string, data: any) => Promise<void>;
  deleteSaleItem: (id: string) => Promise<void>;
}

const URL = backendRoutes.sales.item;

const SaleItemStore = create<ItemStoreProps>((set) => ({
  sale_items: [],
  isFetched: false,

  fetchSaleItems: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ sale_items: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  fetchSaleItemByOrderId: async (orderId: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: SaleOrderItem[];
      }>(`${URL}/order/${orderId}`);

      if (resp.data.success) {
        return resp.data.data;
      } else {
        toastError(resp.data.message || "Failed to fetch items");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  addSaleItem: async (data: SaleOrderItem) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "Sale item added successfully");
        set((state) => ({
          sale_items: [...state.sale_items, resp.data.data],
        }));
      } else {
        toastError(resp.data.message || "Failed to add sale item");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editSaleItem: async (id: string, data: SaleOrderItem) => {
    try {
      const resp = await api.put(`${URL}/${id}`, data);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Sale item updated successfully");
        set((state) => ({
          sale_items: state.sale_items.map((item) =>
            item.id === id ? resp.data.data : item,
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

  deleteSaleItem: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Sale item deleted successfully");
        set((state) => ({
          sale_items: state.sale_items.filter((itm) => itm.id !== id),
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

export default SaleItemStore;
