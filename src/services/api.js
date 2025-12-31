const BASE_URL = "https://dummyjson.com";
const DEFAULT_TIMEOUT_MS = 8000;

async function request(path, options = {}) {
  const timeout = Number.isFinite(options.timeout)
    ? options.timeout
    : DEFAULT_TIMEOUT_MS;
  const retries = Number.isInteger(options.retries) ? options.retries : 2;
  const retryDelay = Number.isInteger(options.retryDelay)
    ? options.retryDelay
    : 300;

  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
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
      lastError = error;
      if (error.name === "AbortError") {
        lastError = new Error("Request timed out. Please retry.");
      }

      if (attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    } finally {
      clearTimeout(id);
      attempt += 1;
    }
  }

  throw lastError || new Error("Network error. Check your connection.");
}

async function parseJson(response) {
  try {
    return await response.json();
  } catch (error) {
    throw new Error("Invalid response payload.");
  }
}

export async function fetchAllProducts({ limit = 20, skip = 0 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safeSkip = Math.max(Number(skip) || 0, 0);
  const data = await parseJson(
    await request(`/products?limit=${safeLimit}&skip=${safeSkip}`)
  );
  return { products: data.products || [], total: data.total || data.products?.length || 0 };
}

export async function fetchProductById(id) {
  const safeId = encodeURIComponent(id);
  return parseJson(await request(`/products/${safeId}`));
}

export async function fetchCategories() {
  return parseJson(await request("/products/categories"));
}

export async function searchProducts(query, { limit = 20, skip = 0 } = {}) {
  const safeQuery = encodeURIComponent(query);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safeSkip = Math.max(Number(skip) || 0, 0);
  const data = await parseJson(
    await request(`/products/search?q=${safeQuery}&limit=${safeLimit}&skip=${safeSkip}`)
  );
  return { products: data.products || [], total: data.total || data.products?.length || 0 };
}