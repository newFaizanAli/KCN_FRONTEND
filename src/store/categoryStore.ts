import api from "../utilities/api";
import { create } from "zustand";
import { backendRoutes } from "../utilities/config";
import { toastError, toastSuccess } from "../utilities/toast_message";
import { Category, SearchOption } from "../types";

interface CategoryStore {
  categories: Category[];
  isFetched: boolean;
  fetchCategories: () => Promise<void>;
  searchCategoryByName: (name: string) => Promise<SearchOption[]>;
  addCategory: (categoryData: Category) => Promise<void>;
  editCategory: (id: string, categoryData: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const URL = backendRoutes.categories as string;

const categoryStore = create<CategoryStore>((set) => ({
  categories: [],
  isFetched: false,

  fetchCategories: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ categories: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  searchCategoryByName: async (name: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: Category[];
      }>(`${URL}/search/${name}`);

      if (resp.data.success) {
        return resp.data.data.map((cat: Category) => ({
          value: cat.id as string,
          label: cat.name,
        }));
      } else {
        toastError(resp.data.message || "Failed to search category");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  addCategory: async (categoryData: Category) => {
    try {
      const resp = await api.post<{
        success: boolean;
        message: string;
        data: Category;
      }>(URL, categoryData);
      const message = resp.data.message || "";

      if (resp.data.success) {
        toastSuccess(message || "Category added successfully");
        set((state) => ({ categories: [...state.categories, resp.data.data] }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editCategory: async (id: string, categoryData: Category) => {
    try {
      const resp = await api.put(
        `${backendRoutes.categories}/${id}`,
        categoryData,
      );
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Category updated successfully");
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? resp.data.data : cat,
          ),
        }));
      } else {
        toastError(message);
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const resp = await api.delete(`${backendRoutes.categories}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Category deleted successfully");
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
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

export default categoryStore;
