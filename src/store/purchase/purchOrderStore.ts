import { create } from "zustand";
import {
  PurchaseOrder,
  CombinedPurchaseOrderPayload,
  SearchOption,
} from "../../types";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";

interface OrderStoreProps {
  purchase_orders: PurchaseOrder[];
  isFetched: boolean;
  fetchPurchaseOrders: () => Promise<void>;
  searchPurchaseOrderByID: (id: string) => Promise<SearchOption[]>;
  addPurchaeOrder: (
    data: Partial<PurchaseOrder>,
  ) => Promise<PurchaseOrder | undefined>;
  editPurchaeOrder: (
    id: string,
    data: Partial<PurchaseOrder>,
  ) => Promise<PurchaseOrder | undefined>;
  addCombinedPurchaseOrder: (
    data: CombinedPurchaseOrderPayload,
  ) => Promise<void>;
  deletePurchaseOrder: (id: string) => Promise<void>;
}

const URL = backendRoutes.purchases.order;

const PurchaseOrderStore = create<OrderStoreProps>((set) => ({
  purchase_orders: [],
  isFetched: false,

  fetchPurchaseOrders: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ purchase_orders: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  addPurchaeOrder: async (data: Partial<PurchaseOrder>) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "Purchase order added successfully");
        set((state) => ({
          purchase_orders: [...state.purchase_orders, resp.data.data],
        }));

        return resp.data.data;
      } else {
        toastError(resp.data.message || "Failed to add purchase order");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editPurchaeOrder: async (id: string, data: Partial<PurchaseOrder>) => {
    try {
      const resp = await api.put(`${URL}/${id}`, data);

      const message = resp.data.message || "";

      if (resp.data.success) {
        toastSuccess(message || "Purchase order updated successfully");

        set((state) => ({
          purchase_orders: state.purchase_orders.map((order) =>
            order.id === id ? resp.data.data : order,
          ),
        }));

        return resp.data.data as PurchaseOrder;
      } else {
        toastError(message || "Failed to update purchase order");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      toastError("Something went wrong");
    }
  },

  searchPurchaseOrderByID: async (id: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: PurchaseOrder[];
      }>(`${URL}/search/${id}`);

      if (resp.data.success) {
        return resp.data.data.map((pur: PurchaseOrder) => ({
          value: pur.id as string,
          label: `${pur.id}`,
        }));
      } else {
        toastError(resp.data.message || "Failed to search purchase order");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  addCombinedPurchaseOrder: async (data: CombinedPurchaseOrderPayload) => {
    try {
      const resp = await api.post(`${URL}/combined`, data);
      if (resp.data.success) {
        toastSuccess(
          resp.data.message || "Purchase order created successfully",
        );
        set((state) => ({
          purchase_orders: [...state.purchase_orders, resp.data.data.order],
        }));
      } else {
        toastError(resp.data.message || "Failed to create purchase order");
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  },

  deletePurchaseOrder: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Purchase order deleted successfully");
        set((state) => ({
          purchase_orders: state.purchase_orders.filter((ord) => ord.id !== id),
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

export default PurchaseOrderStore;
