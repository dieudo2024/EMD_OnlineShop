import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { fetchAllProducts, fetchCategories, fetchProductById } from "../services/api";
import { sanitizeString } from "../utils/security";
import { Product } from "../domain/Product";
import { loadProductCache, saveProductCache } from "../services/storage";

const ProductCatalogContext = createContext(null);

export function ProductCatalogProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const pageCache = useRef(new Map());
  const productCache = useRef(new Map());

  const loadCategories = useCallback(async () => {
    setCategoryError("");
    try {
      const categoryData = await fetchCategories();
      const normalizedCategories = dedupeCategories(
        categoryData.map(normalizeCategory)
      );
      setCategories(normalizedCategories);
    } catch (err) {
      setCategoryError(err.message || "Failed to load categories");
    }
  }, []);

  const loadPage = useCallback(
    async (page = 1, limit = pageSize) => {
      const safeLimit = limit || pageSize;
      const safePage = Math.max(1, Number(page) || 1);
      const cacheKey = `${safePage}:${safeLimit}`;

      if (pageCache.current.has(cacheKey)) {
        const cached = pageCache.current.get(cacheKey);
        setProducts(cached.items);
        setTotal(cached.total);
        setLoading(false);
        return cached.items;
      }

      setLoading(true);
      setError("");

      try {
        const skip = (safePage - 1) * safeLimit;
        const { products: productData, total: totalCount } = await fetchAllProducts({
          limit: safeLimit,
          skip,
        });

        const normalizedProducts = productData.map((item) => Product.fromRaw(item));
        setProducts(normalizedProducts);
        setTotal(totalCount);

        pageCache.current.set(cacheKey, {
          items: normalizedProducts,
          total: totalCount,
        });

        if (safePage === 1) {
          saveProductCache(productData, { total: totalCount, pageSize: safeLimit });
        }

        const cache = productCache.current;
        normalizedProducts.forEach((item) => {
          cache.set(String(item.id), item);
        });

        return normalizedProducts;
      } catch (err) {
        const message = err.message || "Failed to load product catalog";
        if (safePage === 1) {
          const cached = loadProductCache();
          if (cached?.items?.length) {
            const fallbackProducts = cached.items.map((item) => Product.fromRaw(item));
            setProducts(fallbackProducts);
            setTotal(cached.metadata?.total ?? fallbackProducts.length);
            fallbackProducts.forEach((item) => {
              productCache.current.set(String(item.id), item);
            });
            setError("");
            return fallbackProducts;
          }
        }
        setError(message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  const refreshCatalog = useCallback(async () => {
    pageCache.current.clear();
    if (productCache.current.size === 0) {
      setProducts([]);
      setTotal(0);
    }
    await Promise.all([loadPage(1, pageSize), loadCategories()]);
  }, [loadCategories, loadPage, pageSize]);

  const retryLoad = useCallback(() => {
    return refreshCatalog();
  }, [refreshCatalog]);

  useEffect(() => {
    const cached = loadProductCache();
    if (cached?.items?.length) {
      const hydrated = cached.items.map((item) => Product.fromRaw(item));
      setProducts(hydrated);
      setTotal(cached.metadata?.total ?? hydrated.length);
      hydrated.forEach((item) => {
        productCache.current.set(String(item.id), item);
      });
    }

    refreshCatalog();
  }, [refreshCatalog]);

  const getProductFromCache = useCallback((id) => {
    const key = String(id);
    return productCache.current.get(key) || null;
  }, []);

  const loadProductById = useCallback(
    async (id) => {
      const key = String(id);
      const cached = productCache.current.get(key);
      if (cached) return cached;

      try {
        const product = await fetchProductById(key);
        const normalized = Product.fromRaw(product);
        productCache.current.set(key, normalized);

        setProducts((prev) => {
          const index = prev.findIndex((item) => item.id === normalized.id);
          if (index !== -1) {
            const copy = [...prev];
            copy[index] = normalized;
            return copy;
          }
          return [...prev, normalized];
        });

        return normalized;
      } catch (err) {
        const message = err.message || "Failed to load product";
        setError(message);
        throw new Error(message);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      products,
      categories,
      loading,
      error,
      refreshCatalog,
      loadPage,
      total,
      pageSize,
      getProductFromCache,
      loadProductById,
      categoryError,
      retryLoad,
    }),
    [products, categories, loading, error, refreshCatalog, loadPage, total, pageSize, getProductFromCache, loadProductById, categoryError, retryLoad]
  );

  return (
    <ProductCatalogContext.Provider value={value}>
      {children}
    </ProductCatalogContext.Provider>
  );
}

export function useProductCatalog() {
  const context = useContext(ProductCatalogContext);
  if (!context) {
    throw new Error(
      "useProductCatalog must be used within ProductCatalogProvider"
    );
  }
  return context;
}

function normalizeCategory(category) {
  if (category && typeof category === "object") {
    const label =
      sanitizeString(category.name, { maxLength: 120 }) ||
      sanitizeString(category.slug, { maxLength: 120 }) ||
      "Uncategorized";
    const id = Product.createSlug(category.slug || label);
    return { id, label };
  }

  const label = sanitizeString(category, { maxLength: 120 }) || "Uncategorized";
  const id = Product.createSlug(label);
  return { id, label };
}

function dedupeCategories(list) {
  const seen = new Map();
  list.forEach((cat) => {
    if (!seen.has(cat.id)) {
      seen.set(cat.id, cat);
    }
  });
  return Array.from(seen.values());
}
