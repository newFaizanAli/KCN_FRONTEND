import { create } from "zustand";
import { DeliveryNote } from "../../types";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";

interface DNStoreProps {
  deliveryNotes: DeliveryNote[];
  isFetched: boolean;
  fetchDeliveryNotes: () => Promise<void>;
  addDeliveryNote: (data: any) => Promise<void>;
  deleteDeliveryNote: (id: string) => Promise<void>;
}

const URL = backendRoutes.sales.dn;

const DNStore = create<DNStoreProps>((set) => ({
  deliveryNotes: [],
  isFetched: false,

  fetchDeliveryNotes: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ deliveryNotes: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  addDeliveryNote: async (data: DeliveryNote) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "DN added successfully");
        set((state) => ({
          deliveryNotes: [...state.deliveryNotes, resp.data.data],
        }));
      } else {
        toastError(resp.data.message || "Failed to add goods delivery note");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  deleteDeliveryNote: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Delivery note deleted successfully");
        set((state) => ({
          deliveryNotes: state.deliveryNotes.filter((itm) => itm.id !== id),
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

export default DNStore;
