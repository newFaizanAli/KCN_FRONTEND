import { create } from "zustand";
import {
  SalesOrder,
  SearchOption,
  CombinedSaleOrderPayload,
} from "../../types";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";

interface OrderStoreProps {
  sale_orders: SalesOrder[];
  isFetched: boolean;
  fetchSaleOrders: () => Promise<void>;
  searchSaleOrderByID: (id: string) => Promise<SearchOption[]>;
  addSaleOrder: (data: Partial<SalesOrder>) => Promise<SalesOrder | undefined>;
  editSaleOrder: (
    id: string,
    data: Partial<SalesOrder>,
  ) => Promise<SalesOrder | undefined>;
  addCombinedSaleOrder: (data: CombinedSaleOrderPayload) => Promise<void>;
  deleteSaleOrder: (id: string) => Promise<void>;
}

const URL = backendRoutes.sales.order;

const SaleOrderStore = create<OrderStoreProps>((set) => ({
  sale_orders: [],
  isFetched: false,

  fetchSaleOrders: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ sale_orders: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  addSaleOrder: async (data: Partial<SalesOrder>) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "Sale order added successfully");
        set((state) => ({
          sale_orders: [...state.sale_orders, resp.data.data],
        }));

        return resp.data.data;
      } else {
        toastError(resp.data.message || "Failed to add sale order");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editSaleOrder: async (id: string, data: Partial<SalesOrder>) => {
    try {
      const resp = await api.put(`${URL}/${id}`, data);

      const message = resp.data.message || "";

      if (resp.data.success) {
        toastSuccess(message || "Sale order updated successfully");

        set((state) => ({
          sale_orders: state.sale_orders.map((order) =>
            order.id === id ? resp.data.data : order,
          ),
        }));

        return resp.data.data as SalesOrder;
      } else {
        toastError(message || "Failed to update sale order");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      toastError("Something went wrong");
    }
  },

  searchSaleOrderByID: async (id: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: SalesOrder[];
      }>(`${URL}/search/${id}`);

      if (resp.data.success) {
        return resp.data.data.map((pur: SalesOrder) => ({
          value: pur.id as string,
          label: `${pur.id}`,
        }));
      } else {
        toastError(resp.data.message || "Failed to search sale order");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  addCombinedSaleOrder: async (data: CombinedSaleOrderPayload) => {
    try {
      const resp = await api.post(`${URL}/combined`, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "Sale order created successfully");
        set((state) => ({
          sale_orders: [...state.sale_orders, resp.data.data.order],
        }));
      } else {
        toastError(resp.data.message || "Failed to create sale order");
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  },

  deleteSaleOrder: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Sale order deleted successfully");
        set((state) => ({
          sale_orders: state.sale_orders.filter((ord) => ord.id !== id),
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

export default SaleOrderStore;
