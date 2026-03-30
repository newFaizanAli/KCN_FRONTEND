import { create } from "zustand";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";
import { Product, SearchOption } from "../../types";

const URL = backendRoutes.products.root;

interface ProductStore {
  isFetched: boolean;
  products: Product[];
  fetchProducts: () => Promise<void>;
  searchProductByName: (name: string) => Promise<SearchOption[]>;
  fetchProductById: (id: string) => Promise<Product | null>;
  addProduct: (data: any) => Promise<void>;
  editProduct: (id: string, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

interface API_RESPONSE {
  message: string;
  data: Product;
  success: boolean;
}

const useProductStore = create<ProductStore>((set) => ({
  isFetched: false,
  products: [],

  fetchProducts: async () => {
    try {
      const resp = await api.get(URL);

      if (resp.data.success) {
        set({ products: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      toastError(error.message);
      console.error(error.message);
    }
  },

  searchProductByName: async (name: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: Product[];
      }>(`${URL}/search/${name}`);

      if (resp.data.success) {
        return resp.data.data.map((prod: Product) => ({
          value: prod.id as string,
          label: prod.name,
        }));
      } else {
        toastError(resp.data.message || "Failed to search product");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  fetchProductById: async (id: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: Product;
      }>(`${URL}/${id}`);

      if (resp.data.success) {
        return resp.data.data;
      } else {
        toastError(resp.data.message || "Failed to fetch product");
        return null;
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return null;
    }
  },

  addProduct: async (productData: Product) => {
    try {
      const resp = await api.post<API_RESPONSE>(URL, productData);
      const message = resp.data.message || "";

      if (resp.data.success) {
        toastSuccess(message || "Product added successfully");
        set((state) => ({ products: [...state.products, resp.data.data] }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editProduct: async (id: string, productData: Product) => {
    try {
      const resp = await api.put<API_RESPONSE>(`${URL}/${id}`, productData);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Product updated successfully");
        set((state) => ({
          products: state.products.map((prod) =>
            prod.id === id ? resp.data.data : prod,
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

  deleteProduct: async (id: string) => {
    try {
      const resp = await api.delete<API_RESPONSE>(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Product deleted successfully");
        set((state) => ({
          products: state.products.filter((prod) => prod.id !== id),
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

export default useProductStore;
