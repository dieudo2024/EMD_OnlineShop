const BASE_URL = "https://dummyjson.com";
const DEFAULT_TIMEOUT_MS = 8000;

async function request(path, options = {}) {
  const timeout = Number.isFinite(options.timeout)
    ? options.timeout
    : DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    return response;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please retry.");
    }
    throw new Error("Network error. Check your connection.");
  } finally {
    clearTimeout(id);
  }
}

async function parseJson(response) {
  try {
    return await response.json();
  } catch (error) {
    throw new Error("Invalid response payload.");
  }
}

export async function fetchAllProducts() {
  const data = await parseJson(await request("/products?limit=0"));
  return data.products;
}

export async function fetchProductById(id) {
  const safeId = encodeURIComponent(id);
  return parseJson(await request(`/products/${safeId}`));
}

export async function fetchCategories() {
  return parseJson(await request("/products/categories"));
}

export async function searchProducts(query) {
  const safeQuery = encodeURIComponent(query);
  const data = await parseJson(
    await request(`/products/search?q=${safeQuery}`)
  );
  return data.products;
}