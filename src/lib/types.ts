export type SKU = "lamp" | "stool" | "notebook" | "pen" | "case";

export interface Extra {
  code: string;
  name: string;
  priceCents: number;
}

export interface Product {
  sku: SKU;
  name: string;
  priceCents: number;
  remaining: number | null;
  extras: Extra[];
}

export interface Payment {
  email: string;
  sku: SKU;
  itemName: string;
  extraCode: string | null;
  externalChargeId: string;
  totalCents: number;
}

export interface CheckoutLine {
  sku: SKU;
  name: string;
  unitPriceCents: number;
  qty: number;
}
export interface CheckoutAttempt {
  attemptId: string;
  lines: CheckoutLine[];
  amountCents: number;
}

export interface Order extends CheckoutAttempt {
  orderId: string;
}
