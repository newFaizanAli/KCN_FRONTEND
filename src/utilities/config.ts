export const backendConfig = {
  // baseUrl: "http://localhost:3000",
  baseUrl: "https://kcn-backend.vercel.app",
  apiPath: "/api",
};

export const backendRoutes = {
  auth: {
    signIn: `${backendConfig.baseUrl}${backendConfig.apiPath}/auth/login`,
    register: `${backendConfig.baseUrl}${backendConfig.apiPath}/auth/register`,
    profile: `${backendConfig.baseUrl}${backendConfig.apiPath}/auth/profile`,
  },
  user: { root: `${backendConfig.baseUrl}${backendConfig.apiPath}/users` },
  categories: `/categories`,
  products: {
    root: `${backendConfig.baseUrl}${backendConfig.apiPath}/products`,
    attributes: `${backendConfig.baseUrl}${backendConfig.apiPath}/products/attributes`,
  },
  stocks: {
    root: `${backendConfig.baseUrl}${backendConfig.apiPath}/stocks`,
    transaction: `${backendConfig.baseUrl}${backendConfig.apiPath}/stocks/transactions`,
  },
  customers: {
    root: `${backendConfig.baseUrl}${backendConfig.apiPath}/customers`,
  },
  suppliers: {
    root: `${backendConfig.baseUrl}${backendConfig.apiPath}/suppliers`,
    payment: `${backendConfig.baseUrl}${backendConfig.apiPath}/suppliers/payments`,
  },
  purchases: {
    order: `${backendConfig.baseUrl}${backendConfig.apiPath}/purchases/orders`,
    item: `${backendConfig.baseUrl}${backendConfig.apiPath}/purchases/items`,
    grn: `${backendConfig.baseUrl}${backendConfig.apiPath}/purchases/grn`,
  },
  sales: {
    order: `${backendConfig.baseUrl}${backendConfig.apiPath}/sales/orders`,
    item: `${backendConfig.baseUrl}${backendConfig.apiPath}/sales/items`,
    dn: `${backendConfig.baseUrl}${backendConfig.apiPath}/sales/dn`,
    payment: `${backendConfig.baseUrl}${backendConfig.apiPath}/sales/payments`,
  },
};
