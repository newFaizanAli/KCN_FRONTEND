import { create } from "zustand";
import { toastError, toastSuccess } from "../../utilities/toast_message";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/config";
import { Stock, SearchOption } from "../../types";

const URL = backendRoutes.stocks.root;

interface StockStore {
  isFetched: boolean;
  stocks: Stock[];
  fetchStocks: () => Promise<void>;
  searchStockByProduct: (name: string) => Promise<SearchOption[]>;
  fetchStockById: (id: string) => Promise<Stock | null>;
  addStock: (stockData: any) => Promise<void>;
  editStock: (id: string, stockData: any) => Promise<void>;
  deleteStock: (id: string) => Promise<void>;
}

const useStockStore = create<StockStore>((set) => ({
  isFetched: false,
  stocks: [],

  fetchStocks: async () => {
    try {
      const resp = await api.get(URL);

      if (resp.data.success) {
        set({ stocks: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  searchStockByProduct: async (name: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: Stock[];
      }>(`${URL}/search/${name}`);

      if (resp.data.success) {
        return resp.data.data.map((stock: Stock) => ({
          value: stock.id as string,
          label: stock.productName as string,
        }));
      } else {
        toastError(resp.data.message || "Failed to search transact");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  fetchStockById: async (id: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: Stock;
      }>(`${URL}/${id}`);

      if (resp.data.success) {
        return resp.data.data;
      } else {
        toastError(resp.data.message || "Failed to fetch stock");
        return null;
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return null;
    }
  },

  addStock: async (stockData: Stock) => {
    try {
      const resp = await api.post(URL, stockData);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Stock added successfully");
        set((state) => ({ stocks: [...state.stocks, resp.data.data] }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editStock: async (id: string, stockData: Stock) => {
    try {
      const resp = await api.put(`${URL}/${id}`, stockData);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Stock updated successfully");
        set((state) => ({
          stocks: state.stocks.map((stk) =>
            stk.id === id ? resp.data.data : stk,
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

  deleteStock: async (id) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Stock deleted successfully");
        set((state) => ({
          stocks: state.stocks.filter((stk) => stk.id !== id),
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

export default useStockStore;
