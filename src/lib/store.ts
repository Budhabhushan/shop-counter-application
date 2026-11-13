import type { Product, Payment, CheckoutAttempt, Order, SKU } from "./types";

const initialProducts: Product[] = [
  {
    sku: "lamp",
    name: "Maple lamp",
    priceCents: 8000,
    remaining: 5,
    extras: [],
  },
  {
    sku: "stool",
    name: "Cedar stool",
    priceCents: 12000,
    remaining: 2,
    extras: [{ code: "cushion", name: "Cushion", priceCents: 2500 }],
  },
  {
    sku: "notebook",
    name: "Field notebook",
    priceCents: 1500,
    remaining: null,
    extras: [],
  },
  { sku: "pen", name: "Gel pen", priceCents: 400, remaining: null, extras: [] },
  {
    sku: "case",
    name: "Slip case",
    priceCents: 2200,
    remaining: null,
    extras: [],
  },
];

// Create a class to managing a multiple data insted of maintaining in separate global variables
class ShopStore {
  products = initialProducts.map((product) => ({
    ...product,
    extras: product.extras.map((extra) => ({ ...extra })),
  }));

  payments: Payment[] = [];

  attempts = new Map<string, CheckoutAttempt>();

  orders = new Map<string, Order>();

  catalogReads = 0;

  getProducts() {
    return this.products.map((product) => ({
      ...product,
      extras: product.extras.map((extra) => ({ ...extra })),
    }));
  }

  getProduct(sku: string) {
    return this.products.find((product) => product.sku === sku);
  }
  incrementReads() {
    this.catalogReads += 1;
  }
  getReads() {
    return this.catalogReads;
  }
  getPayment() {
    return [...this.payments];
  }
}

// One store instance per server process.
const globalForStore = globalThis as typeof globalThis & {
  shopStore?: ShopStore;
};

export const store = globalForStore.shopStore ?? new ShopStore();

globalForStore.shopStore = store;
