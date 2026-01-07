import { useEffect, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { useProductCatalog } from "../context/ProductCatalogContext";
import { useReviews } from "../context/ReviewsContext";

function computeAverageRating(allReviews) {
  if (!allReviews || allReviews.length === 0) {
    return null;
  }
  const sum = allReviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / allReviews.length).toFixed(1));
}

function TodaysDealsPage() {
  const { products, loading, error, loadPage, pageSize } = useProductCatalog();
  const { getAllReviewsForProduct } = useReviews();

  useEffect(() => {
    loadPage(1, pageSize);
  }, [loadPage, pageSize]);

  const deals = useMemo(() => {
    return products
      .filter((product) => Number(product.discountPercentage) > 0)
      .sort(
        (a, b) =>
          Number(b.discountPercentage || 0) - Number(a.discountPercentage || 0)
      );
  }, [products]);

  if (loading && products.length === 0) {
    return <p className="center-text">Loading deals...</p>;
  }

  if (error) {
    return <p className="center-text error-text">{error}</p>;
  }

  return (
    <section className="page">
      <h1>Today's Deals</h1>
      <p className="page-subtitle">
        Grab limited-time discounts before the offers expire.
      </p>

      {deals.length === 0 ? (
        <div className="product-list-empty">
          <p>No deals available right now. Check back soon.</p>
        </div>
      ) : (
        <div className="product-grid">
          {deals.map((product) => {
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
      )}
    </section>
  );
}

export default TodaysDealsPage;
