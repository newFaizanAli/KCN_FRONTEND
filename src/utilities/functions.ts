import { toastError } from "./toast_message";
import { STOCKTRANSFERTYPES } from "../constants";
import { Stock } from "../types";

const checkTransactionQuantity = (
  stock: Stock,
  quantity: number,
  type: string | null,
  setQtnError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  if (!STOCKTRANSFERTYPES.some((t) => t.value === type)) {
    toastError("Invalid transaction type");
    return false;
  }

  switch (type) {
    case "IN":
      return true;

    case "OUT":
      if (stock.quantity < quantity) {
        setQtnError("Insufficient stock quantity");
        return false;
      }
      return true;

    default:
      return true;
  }
};

function calculateGrandTotal(
  totalAmount: number,
  taxPercent: number,
  discount: number = 0, // ✅ default 0
) {
  const total = Number(totalAmount) || 0;
  const tax = Number(taxPercent) || 0;
  const disc = Number(discount) || 0;

  // apply discount first
  const discountedTotal = total - disc;

  // prevent negative values (important)
  const safeTotal = discountedTotal < 0 ? 0 : discountedTotal;

  const taxAmount = (safeTotal * tax) / 100;
  const grandTotal = safeTotal + taxAmount;

  return grandTotal;
}

export { checkTransactionQuantity, calculateGrandTotal };
