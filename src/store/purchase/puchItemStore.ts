import { create } from "zustand";
import { PurchaseOrderItem } from "../../types";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";

interface ItemStoreProps {
  purchase_items: PurchaseOrderItem[];
  isFetched: boolean;
  fetchPurchaseItems: () => Promise<void>;
  fetchPurchaseItemByOrderId: (orderId: string) => Promise<PurchaseOrderItem[]>;
  addPurchaseItem: (data: any) => Promise<void>;
  editPurchaseItem: (id: string, data: any) => Promise<void>;
  deletePurchaseItem: (id: string) => Promise<void>;
}

const URL = backendRoutes.purchases.item;

const PurchaseItemStore = create<ItemStoreProps>((set) => ({
  purchase_items: [],
  isFetched: false,

  fetchPurchaseItems: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ purchase_items: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  fetchPurchaseItemByOrderId: async (orderId: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: PurchaseOrderItem[];
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

  addPurchaseItem: async (data: PurchaseOrderItem) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "Purchase item added successfully");
        set((state) => ({
          purchase_items: [...state.purchase_items, resp.data.data],
        }));
      } else {
        toastError(resp.data.message || "Failed to add purchase item");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editPurchaseItem: async (id: string, data: PurchaseOrderItem) => {
    try {
      const resp = await api.put(`${URL}/${id}`, data);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Purchase item updated successfully");
        set((state) => ({
          purchase_items: state.purchase_items.map((item) =>
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

  deletePurchaseItem: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Purchase item deleted successfully");
        set((state) => ({
          purchase_items: state.purchase_items.filter((itm) => itm.id !== id),
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

export default PurchaseItemStore;
