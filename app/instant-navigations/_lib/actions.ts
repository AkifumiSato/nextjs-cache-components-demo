"use server";

import { updateTag } from "next/cache";
import { cacheTagName } from "./data";

// Expires product details, recommendations and stock immediately, so the next
// navigation to each pattern behaves like the first one
export async function clearCaches() {
  updateTag(cacheTagName);
}
