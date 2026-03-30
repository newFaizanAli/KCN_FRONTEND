import { create } from "zustand";
import { GoodsReceivedNote } from "../../types";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";

interface GRNStoreProps {
  goodsReceivedNotes: GoodsReceivedNote[];
  isFetched: boolean;
  fetchGoodsReceivedNotes: () => Promise<void>;
  addGoodsReceivedNote: (data: any) => Promise<void>;
  deleteGoodsReceivedNote: (id: string) => Promise<void>;
}

const URL = backendRoutes.purchases.grn;

const GRNStore = create<GRNStoreProps>((set) => ({
  goodsReceivedNotes: [],
  isFetched: false,

  fetchGoodsReceivedNotes: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ goodsReceivedNotes: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  addGoodsReceivedNote: async (data: GoodsReceivedNote) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "GRN added successfully");
        set((state) => ({
          goodsReceivedNotes: [...state.goodsReceivedNotes, resp.data.data],
        }));
      } else {
        toastError(resp.data.message || "Failed to add goods received note");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  deleteGoodsReceivedNote: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Goods received note deleted successfully");
        set((state) => ({
          goodsReceivedNotes: state.goodsReceivedNotes.filter(
            (itm) => itm.id !== id,
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

export default GRNStore;
