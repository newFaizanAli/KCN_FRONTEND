export interface Category {
  id?: string;
  name: "";
  parent_id: null | {
    id: string;
    name: string;
  };
}
