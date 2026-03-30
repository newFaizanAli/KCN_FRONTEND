import { create } from "zustand";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";
import type { ProductAttribute } from "../../types";

const URL = backendRoutes.products.attributes;

interface ProductAttributeStoreProps {
  isFetched: boolean;
  attributes: ProductAttribute[];
  fetchAttributes: () => Promise<void>;
  fetchAttributeByProductId: (id: string) => Promise<ProductAttribute[]>;
  addAttribute: (attributeData: any) => Promise<void>;
  editAttribute: (id: string, attributeData: any) => Promise<void>;
  deleteAttribute: (id: string) => Promise<void>;
}

interface API_RESP {
  success: false;
  message: "";
  data: ProductAttribute;
}

const useProdAttributesStore = create<ProductAttributeStoreProps>((set) => ({
  isFetched: false,
  attributes: [],

  fetchAttributes: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ attributes: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  fetchAttributeByProductId: async (id: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: ProductAttribute[];
      }>(`${URL}/product/${id}`);

      if (resp.data.success) {
        return resp.data.data;
      } else {
        toastError(resp.data.message || "Failed to fetch attributes");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  addAttribute: async (attributeData: ProductAttribute) => {
    try {
      const resp = await api.post(URL, attributeData);
      const message = resp.data.message || "";

      if (resp.data.success) {
        toastSuccess(message || "Attribute added successfully");
        set((state) => ({ attributes: [...state.attributes, resp.data.data] }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editAttribute: async () => {
    try {
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  deleteAttribute: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Attribute deleted successfully");
        set((state) => ({
          attributes: state.attributes.filter((v) => v.id !== id),
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

export default useProdAttributesStore;
