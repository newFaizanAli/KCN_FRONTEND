import { create } from "zustand";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";
import api from "../../utilities/api";
import { Supplier, SearchOption } from "../../types";

const URL = backendRoutes.suppliers.root;

interface SupplierStore {
  suppliers: Supplier[];
  isFetched: boolean;
  fetchSuppliers: () => Promise<void>;
  searchSupplierByName: (name: string) => Promise<SearchOption[]>;
  addSupplier: (supplierData: any) => Promise<void>;
  editSupplier: (id: string, supplierData: any) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
}

const supplierStore = create<SupplierStore>((set) => ({
  suppliers: [],
  isFetched: false,

  fetchSuppliers: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ suppliers: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  searchSupplierByName: async (name: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: Supplier[];
      }>(`${URL}/search/${name}`);

      if (resp.data.success) {
        return resp.data.data.map((supp: Supplier) => ({
          value: supp.id as string,
          label: supp.name,
        }));
      } else {
        toastError(resp.data.message || "Failed to search supplier");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  addSupplier: async (supplierData: Supplier) => {
    try {
      const resp = await api.post(URL, supplierData);
      const message = resp.data.message || "";

      if (resp.data.success) {
        toastSuccess(message || "Supplier added successfully");
        set((state) => ({ suppliers: [...state.suppliers, resp.data.data] }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editSupplier: async (id: string, supplierData: Supplier) => {
    try {
      const resp = await api.put(`${URL}/${id}`, supplierData);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Supplier updated successfully");
        set((state) => ({
          suppliers: state.suppliers.map((sup) =>
            sup.id === id ? resp.data.data : sup,
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

  deleteSupplier: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Supplier deleted successfully");
        set((state) => ({
          suppliers: state.suppliers.filter((sup) => sup.id !== id),
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

export default supplierStore;
