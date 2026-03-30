export interface Product {
  id?: string;
  name: string;
  categoryId: string | null;
  brand: string | null;
  sku: string | null;
  type: "product";
  price: number;
  cost_price: number;
  description: string | null;
  categoryName?: string | null;
}

export interface ProductAttribute {
  id?: string;
  productId:
    | string
    | {
        id: string;
        name: string;
        sku: string;
      };
  value: string;
  key: string;
}
