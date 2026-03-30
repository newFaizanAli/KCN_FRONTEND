import { Customer, SearchOption } from "../../types";
import { create } from "zustand";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/config";
import { toastError, toastSuccess } from "../../utilities/toast_message";

const URL = backendRoutes.customers.root;

interface ApiResponse {
  message: string;
  success: boolean;
  data: Customer;
}

interface CustomerStore {
  isFetched: boolean;
  customers: Customer[];
  fetchCustomers: () => Promise<void>;
  searchCustomerByName: (name: string) => Promise<SearchOption[]>;
  addCustomer: (customerData: any) => Promise<void>;
  editCustomer: (id: string, customerData: any) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

const useCustomerStore = create<CustomerStore>((set) => ({
  isFetched: false,
  customers: [],

  fetchCustomers: async () => {
    try {
      const resp = await api.get(URL);

      if (resp.data.success) {
        set({ customers: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      toastError(error.message);
      console.error(error.message);
    }
  },

  addCustomer: async (customerData) => {
    try {
      const resp = await api.post<ApiResponse>(URL, customerData);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Customer added successfully");
        set((state) => ({ customers: [...state.customers, resp.data.data] }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      toastError(error.message);
      console.error(error.message);
    }
  },

  editCustomer: async (id, customerData) => {
    try {
      const resp = await api.put<ApiResponse>(`${URL}/${id}`, customerData);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Customer updated successfully");
        set((state) => ({
          customers: state.customers.map((cus) =>
            cus.id === id ? resp.data.data : cus,
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

  searchCustomerByName: async (name: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: Customer[];
      }>(`${URL}/search/${name}`);

      if (resp.data.success) {
        return resp.data.data.map((prod: Customer) => ({
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

  deleteCustomer: async (id) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Customer deleted successfully");
        set((state) => ({
          customers: state.customers.filter((stk) => stk.id !== id),
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

export default useCustomerStore;
