import { create } from "zustand";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";
import api from "../../utilities/api";
import { StockTransaction, SearchOption } from "../../types";

const URL = backendRoutes.stocks.transaction;

interface StockTransactionStore {
  isFetched: boolean;
  stock_transactions: StockTransaction[];
  fetchStockTransactions: () => Promise<void>;

  addStockTransaction: (transactionData: any) => Promise<void>;
  deleteStockTransaction: (id: string) => Promise<void>;
}

const transactionStore = create<StockTransactionStore>((set) => ({
  isFetched: false,
  stock_transactions: [],

  fetchStockTransactions: async () => {
    try {
      const resp = await api.get(URL);

      if (resp.data.success) {
        set({ stock_transactions: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  addStockTransaction: async (transactionData: StockTransaction) => {
    try {
      const resp = await api.post(URL, transactionData);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Stock transaction added successfully");
        set((state) => ({
          stock_transactions: [...state.stock_transactions, resp.data.data],
        }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  deleteStockTransaction: async (id) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Stock transaction deleted successfully");
        set((state) => ({
          stock_transactions: state.stock_transactions.filter(
            (stk) => stk.id !== id,
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

export default transactionStore;
