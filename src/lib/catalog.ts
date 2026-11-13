import { unstable_cache } from "next/cache";
import { store } from "./store";

export const getCatalog = unstable_cache(
  async () => {
    store.incrementReads();

    return store.getProducts();
  },
  ["shop-catalog"],
  {
    tags: ["catalog"],
  },
);
