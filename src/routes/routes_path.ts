export interface RoutesPathProps {
  HOME: string;
  AUTH: {
    SIGNIN: string;
    SIGNUP: string;
  };
  DASHBOARD: {
    ROOT: string;
    USER: {
      ROOT: string;
    };
    CATEGORY: {
      ROOT: string;
    };
    PRODUCT: {
      ROOT: string;
      ATTRIBUTES: string;
    };
    STOCK: {
      ROOT: string;
      TRANSACTION: string;
    };
    CUSTOMER: {
      ROOT: string;
    };
    SUPPLIER: {
      ROOT: string;
      PAYMENT: string;
    };
    PURCHASE: {
      ORDER: string;
      ITEM: string;
      GRN: string;
      COMBINED: string;
    };
    SALE: {
      ORDER: string;
      ITEM: string;
      DN: string;
      COMBINED: string;
      PAYMENT: string;
    };
  };
}

export const ROUTES_PATHS: RoutesPathProps = {
  HOME: "/",
  AUTH: {
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    USER: {
      ROOT: "/dashboard/users",
    },
    CATEGORY: {
      ROOT: "/dashboard/categories",
    },
    PRODUCT: {
      ROOT: "/dashboard/products",
      ATTRIBUTES: `/dashboard/products/attributes`,
    },
    STOCK: {
      ROOT: `/dashboard/stocks`,
      TRANSACTION: `/dashboard/stocks/transactions`,
    },
    CUSTOMER: {
      ROOT: `/dashboard/customers`,
    },
    SUPPLIER: {
      ROOT: `/dashboard/suppliers`,
      PAYMENT: `/dashboard/suppliers/payment`,
    },
    PURCHASE: {
      ORDER: `/dashboard/purchases/orders`,
      ITEM: `/dashboard/purchases/orders/items`,
      GRN: `/dashboard/purchases/grn`,
      COMBINED: `/dashboard/purchases/combined`,
    },
    SALE: {
      ORDER: `/dashboard/sales/orders`,
      ITEM: `/dashboard/sales/orders/items`,
      DN: `/dashboard/sales/dn`,
      COMBINED: `/dashboard/sales/combined`,
      PAYMENT: `/dashboard/sales/payment`,
    },
  },
};
