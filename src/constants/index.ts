import NAV_TREE from "./nav_tree";

const STATUS_V: {
  [key: string]: string;
} = {
  Delivered: "success",
  Shipped: "info",
  Processing: "warning",
  Cancelled: "danger",
  Active: "success",
  Low_Stock: "warning",
  Inactive: "danger",
  VIP: "purple",
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  PAID: "success",
};

const STOCKTRANSFERTYPES: {
  value: string;
  label: string;
}[] = [
  { value: "IN", label: "Stock In" },
  { value: "OUT", label: "Stock Out" },
  { value: "ADJUSTMENT", label: "Stock Adjustment" },
  { value: "TRANSFER", label: "Stock Transfer" },
  { value: "RETURN", label: "Stock Return" },
  { value: "PURCHASE", label: "Stock Purchase" },
  { value: "SALE", label: "Stock Sale" },
];

const PAYMENT_METHODS: {
  value: string;
  label: string;
}[] = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank" },
  { value: "cheque", label: "Cheque" },
  { value: "transfer", label: "Transfer" },
  { value: "other", label: "Other" },
];

const SALE_TYPE: {
  value: string;
  label: string;
}[] = [
  { value: "sale", label: "Sale" },
  { value: "service", label: "Service" },
  { value: "other", label: "Other" },
];

export { STATUS_V, STOCKTRANSFERTYPES, PAYMENT_METHODS, SALE_TYPE, NAV_TREE };
