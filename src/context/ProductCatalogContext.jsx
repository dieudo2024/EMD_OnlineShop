import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { fetchAllProducts, fetchCategories, fetchProductById } from "../services/api";
import { sanitizeString } from "../utils/security";

const ProductCatalogContext = createContext(null);

export function ProductCatalogProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const productCache = useRef(new Map());

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productData, categoryData] = await Promise.all([
        fetchAllProducts(),
        fetchCategories(),
      ]);

      const normalizedProducts = productData.map(normalizeProduct);
      const normalizedCategories = dedupeCategories(
        categoryData.map(normalizeCategory)
      );

      setProducts(normalizedProducts);
      setCategories(normalizedCategories);

      const cache = productCache.current;
      cache.clear();
      normalizedProducts.forEach((item) => {
        cache.set(String(item.id), item);
      });
    } catch (err) {
      setError(err.message || "Failed to load product catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

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
        const normalized = normalizeProduct(product);
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
      refreshCatalog: loadCatalog,
      getProductFromCache,
      loadProductById,
    }),
    [products, categories, loading, error, loadCatalog, getProductFromCache, loadProductById]
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

function normalizeProduct(product) {
  if (!product || typeof product !== "object") return product;

  const title = sanitizeString(product.title, { maxLength: 200 });
  const description = sanitizeString(product.description, { maxLength: 1000 });
  const brand = sanitizeString(product.brand, { maxLength: 120 });
  const categoryLabel = sanitizeString(product.category, { maxLength: 120 }) || "Uncategorized";
  const categoryId = createSlug(product.category || categoryLabel);

  return {
    ...product,
    title,
    description,
    brand,
    category: categoryLabel,
    categoryId,
  };
}

function normalizeCategory(category) {
  if (category && typeof category === "object") {
    const label =
      sanitizeString(category.name, { maxLength: 120 }) ||
      sanitizeString(category.slug, { maxLength: 120 }) ||
      "Uncategorized";
    const id = createSlug(category.slug || label);
    return { id, label };
  }

  const label = sanitizeString(category, { maxLength: 120 }) || "Uncategorized";
  const id = createSlug(label);
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

function createSlug(value) {
  const base = sanitizeString(value, { maxLength: 120 })
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "uncategorized";
}
