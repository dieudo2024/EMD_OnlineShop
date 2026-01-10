import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import SortSelect from "../components/SortSelect";
import { useReviews } from "../context/ReviewsContext";
import { useProductCatalog } from "../context/ProductCatalogContext";

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

  const updateAndResetPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleSearchChange = updateAndResetPage(setSearchTerm);
  const handleCategoryChange = updateAndResetPage(setSelectedCategory);
  const handleMinPriceChange = updateAndResetPage(setMinPrice);
  const handleMaxPriceChange = updateAndResetPage(setMaxPrice);
  const handleSortChange = updateAndResetPage(setSortOption);

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

  const shouldShowLoading = loading && products.length === 0;

  if (shouldShowLoading) {
    return <p className="center-text">Loading products...</p>;
  }
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
      {loading && products.length > 0 ? (
        <p className="muted" role="status">
          Refreshing catalog…
        </p>
      ) : null}
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
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          onSubmit={() => setPage(1)}
        />

        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          minPrice={minPrice}
          onMinPriceChange={handleMinPriceChange}
          maxPrice={maxPrice}
          onMaxPriceChange={handleMaxPriceChange}
        />

        <SortSelect value={sortOption} onSortChange={handleSortChange} />
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