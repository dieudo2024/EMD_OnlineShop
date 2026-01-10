const CART_KEY = "cart";
const REVIEWS_KEY = "reviews";
const LAST_ORDER_KEY = "lastOrder";
const PRODUCT_CACHE_KEY = "catalog";

// Generic helper – private
function safeParse(json, fallback) {
  try {
    return json ? JSON.parse(json) : fallback;
  } catch {
    return fallback;
  }
}

/* ---------- CART ---------- */

export function loadCartFromStorage() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  return safeParse(raw, []);
}

export function saveCartToStorage(cartItems) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  } catch (err) {
    console.error("Error saving cart to localStorage", err);
  }
}

/* ---------- REVIEWS ---------- */

export function loadReviewsFromStorage() {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(REVIEWS_KEY);
  return safeParse(raw, {});
}

export function saveReviewsToStorage(reviewsByProductId) {
  try {
    localStorage.setItem(
      REVIEWS_KEY,
      JSON.stringify(reviewsByProductId)
    );
  } catch (err) {
    console.error("Error saving reviews to localStorage", err);
  }
}

/* ---------- LAST ORDER (for confirmation page) ---------- */

export function loadLastOrderFromStorage() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LAST_ORDER_KEY);
  return safeParse(raw, null);
}

export function saveLastOrderToStorage(order) {
  try {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch (err) {
    console.error("Error saving last order", err);
  }
}

/* ---------- PRODUCT CACHE ---------- */

export function loadProductCache() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PRODUCT_CACHE_KEY);
  const data = safeParse(raw, null);
  if (!data || !Array.isArray(data.items)) {
    return null;
  }
  return data;
}

export function saveProductCache(items, metadata = {}) {
  try {
    const payload = {
      items,
      metadata: {
        savedAt: new Date().toISOString(),
        ...metadata,
      },
    };
    localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Error saving product cache", err);
  }
}