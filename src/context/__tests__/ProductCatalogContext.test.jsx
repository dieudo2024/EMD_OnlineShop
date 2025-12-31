import React, { useEffect } from "react";
import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductCatalogProvider, useProductCatalog } from "../ProductCatalogContext";

const mockFetchAllProducts = vi.fn();
const mockFetchCategories = vi.fn();
const mockFetchProductById = vi.fn();

vi.mock("../../services/api", () => ({
  fetchAllProducts: (...args) => mockFetchAllProducts(...args),
  fetchCategories: (...args) => mockFetchCategories(...args),
  fetchProductById: (...args) => mockFetchProductById(...args),
}));

function renderWithProvider(onReady) {
  function Collector() {
    const ctx = useProductCatalog();
    useEffect(() => {
      onReady(ctx);
    }, [ctx, onReady]);
    return null;
  }

  return render(
    <ProductCatalogProvider>
      <Collector />
    </ProductCatalogProvider>
  );
}

describe("ProductCatalogProvider", () => {
  beforeEach(() => {
    mockFetchAllProducts.mockReset();
    mockFetchCategories.mockReset();
    mockFetchProductById.mockReset();
  });

  it("normalizes product fields and deduplicates categories", async () => {
    mockFetchAllProducts.mockResolvedValueOnce([
      {
        id: 1,
        title: "<b>Phone</b>",
        description: "Great <script>bad()</script>",
        brand: " ACME ",
        category: "Tech & Gadgets",
      },
    ]);
    mockFetchCategories.mockResolvedValueOnce([
      "Tech & Gadgets",
      "Tech & Gadgets",
    ]);
    mockFetchProductById.mockResolvedValueOnce({});

    let ctx;
    renderWithProvider((value) => {
      ctx = value;
    });

    await waitFor(() => expect(ctx?.loading).toBe(false));

    expect(ctx.products).toHaveLength(1);
    const product = ctx.products[0];
    expect(product.title).toBe("Phone");
    expect(product.description).toBe("Great bad()");
    expect(product.brand).toBe("ACME");
    expect(product.category).toBe("Tech & Gadgets");
    expect(product.categoryId).toBe("tech-gadgets");

    expect(ctx.categories).toHaveLength(1);
    expect(ctx.categories[0]).toEqual({ id: "tech-gadgets", label: "Tech & Gadgets" });
  });

  it("caches product lookups to avoid duplicate fetches", async () => {
    mockFetchAllProducts.mockResolvedValueOnce([]);
    mockFetchCategories.mockResolvedValueOnce([]);
    mockFetchProductById.mockResolvedValue({
      id: "123",
      title: "Laptop",
      description: "Nice laptop",
      brand: "BrandX",
      category: "Computers",
    });

    let ctx;
    renderWithProvider((value) => {
      ctx = value;
    });

    await waitFor(() => expect(ctx?.loading).toBe(false));

    const first = await ctx.loadProductById("123");
    const second = await ctx.loadProductById("123");

    expect(first).toEqual(second);
    expect(mockFetchProductById).toHaveBeenCalledTimes(1);
  });
});
