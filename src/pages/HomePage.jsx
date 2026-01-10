import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useReviews } from "../context/ReviewsContext";
import { useProductCatalog } from "../context/ProductCatalogContext";
import { sanitizeString } from "../utils/security";

function computeAverageRating(allReviews) {
  if (!allReviews || allReviews.length === 0) return null;
  const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
  return Number((sum / allReviews.length).toFixed(1));
}

function HomePage() {
  const {
    products,
    categories,
    loading,
    error,
    loadPage,
    total,
    pageSize,
    categoryError,
    retryLoad,
  } = useProductCatalog();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const [page, setPage] = useState(1);

  const { getAllReviewsForProduct } = useReviews();

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const term = searchTerm.trim();
      result = result.filter((product) =>
        typeof product.matchesSearch === "function"
          ? product.matchesSearch(term)
          : product.title.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((product) =>
        typeof product.belongsToCategory === "function"
          ? product.belongsToCategory(selectedCategory)
          : product.categoryId === selectedCategory
      );
    }

    if (minPrice !== "") {
      const min = Number(minPrice);
      result = result.filter((product) => {
        const effectivePrice =
          typeof product.getEffectivePrice === "function"
            ? product.getEffectivePrice()
            : product.discountPercentage
              ? product.price * (1 - product.discountPercentage / 100)
              : product.price;
        return effectivePrice >= min;
      });
    }

    if (maxPrice !== "") {
      const max = Number(maxPrice);
      result = result.filter((product) => {
        const effectivePrice =
          typeof product.getEffectivePrice === "function"
            ? product.getEffectivePrice()
            : product.discountPercentage
              ? product.price * (1 - product.discountPercentage / 100)
              : product.price;
        return effectivePrice <= max;
      });
    }

    if (sortOption === "price-asc") {
      result.sort((a, b) => {
        const pa =
          typeof a.getEffectivePrice === "function"
            ? a.getEffectivePrice()
            : a.discountPercentage
              ? a.price * (1 - a.discountPercentage / 100)
              : a.price;
        const pb =
          typeof b.getEffectivePrice === "function"
            ? b.getEffectivePrice()
            : b.discountPercentage
              ? b.price * (1 - b.discountPercentage / 100)
              : b.price;
        return pa - pb;
      });
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => {
        const pa =
          typeof a.getEffectivePrice === "function"
            ? a.getEffectivePrice()
            : a.discountPercentage
              ? a.price * (1 - a.discountPercentage / 100)
              : a.price;
        const pb =
          typeof b.getEffectivePrice === "function"
            ? b.getEffectivePrice()
            : b.discountPercentage
              ? b.price * (1 - b.discountPercentage / 100)
              : b.price;
        return pb - pa;
      });
    } else if (sortOption === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchTerm, selectedCategory, minPrice, maxPrice, sortOption]);

  useEffect(() => {
    loadPage(page, pageSize);
  }, [loadPage, page, pageSize]);

  const filtersApplied =
    searchTerm.trim() ||
    selectedCategory !== "all" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sortOption !== "none";

  const totalPages = filtersApplied
    ? Math.max(1, Math.ceil(filteredProducts.length / pageSize))
    : Math.max(1, Math.ceil(total / pageSize));

  if (loading) return <p className="center-text">Loading products...</p>;
  const fatalError = Boolean(error) && products.length === 0;

  if (fatalError) {
    return (
      <section className="page">
        <p className="center-text error-text">{error}</p>
        <p className="center-text">
          Check your connection and try again.
        </p>
        <div className="center-text">
          <button className="btn primary" onClick={retryLoad}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Products</h1>
      {error && products.length > 0 ? (
        <p className="error-text" role="status">
          {error}. Displaying previously saved items until the network recovers.
        </p>
      ) : null}
      {categoryError ? (
        <p className="error-text" role="status">
          {categoryError}. Showing cached categories when available.
        </p>
      ) : null}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) =>
            handleFilterChange(setSearchTerm)(
              sanitizeString(e.target.value, { maxLength: 120 })
            )
          }
        />

        <select
          value={selectedCategory}
          onChange={(e) => handleFilterChange(setSelectedCategory)(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          min="0"
          onChange={(e) => handleFilterChange(setMinPrice)(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          min="0"
          onChange={(e) => handleFilterChange(setMaxPrice)(e.target.value)}
        />

        <select
          value={sortOption}
          onChange={(e) => handleFilterChange(setSortOption)(e.target.value)}
        >
          <option value="none">No sort</option>
          <option value="price-asc">Price: Low - High</option>
          <option value="price-desc">Price: High - Low</option>
          <option value="rating-desc">Rating: High - Low</option>
        </select>
      </div>
      <div className="product-grid">
        {filteredProducts.map((product) => {
          const allReviews = getAllReviewsForProduct(
            product.id,
            product.reviews || []
          );
          const avgRating =
            allReviews.length > 0
              ? computeAverageRating(allReviews)
              : product.rating;

          return (
            <ProductCard
              key={product.id}
              product={product}
              averageRating={avgRating}
            />
          );
        })}
      </div>

      <div className="pagination">
        <button
          className="btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default HomePage;