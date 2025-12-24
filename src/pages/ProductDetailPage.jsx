import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../services/api";
import { useCart } from "../context/CartContext";
import { useReviews } from "../context/ReviewsContext";
import RatingStars from "../components/RatingStars";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";

function computeAverageRating(allReviews, fallbackRating) {
  if (!allReviews || allReviews.length === 0) return fallbackRating || null;
  const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
  return Number((sum / allReviews.length).toFixed(1));
}

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();
  const { addReview, getAllReviewsForProduct } = useReviews();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const allReviews = useMemo(() => {
    if (!product) return [];
    return getAllReviewsForProduct(product.id, product.reviews || []);
  }, [product, getAllReviewsForProduct]);

  const averageRating = useMemo(() => {
    if (!product) return null;
    return computeAverageRating(allReviews, product.rating);
  }, [allReviews, product]);

  const handleAddReview = (review) => {
    if (!product) return;
    addReview(product.id, review);
  };

  if (loading) return <p className="center-text">Loading product...</p>;
  if (error) return <p className="center-text error-text">{error}</p>;
  if (!product) return <p className="center-text">Product not found.</p>;

  const effectivePrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  return (
    <section className="page product-detail-page">
      <div className="product-detail">
        <div className="product-detail-image-wrapper">
          <img
            src={product.images?.[0] || product.thumbnail}
            alt={product.title}
            className="product-detail-image"
          />
        </div>
        <div className="product-detail-info">
          <h1>{product.title}</h1>
          <p className="product-detail-category">{product.category}</p>
          <div className="product-detail-rating">
            <RatingStars rating={averageRating} />
            <span>
              {allReviews.length} review{allReviews.length !== 1 && "s"}
            </span>
          </div>

          <div className="product-detail-prices">
            {product.discountPercentage ? (
              <>
                <span className="price-discounted">
                  ${effectivePrice.toFixed(2)}
                </span>
                <span className="price-original">
                  ${product.price.toFixed(2)}
                </span>
                <span className="discount-badge">
                  -{product.discountPercentage}%
                </span>
              </>
            ) : (
              <span className="price-normal">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <p className="product-detail-description">
            {product.description}
          </p>

          <button
            className="btn primary"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="product-detail-reviews">
        <h2>Reviews</h2>
        <ReviewList reviews={allReviews} />
        <ReviewForm onSubmit={handleAddReview} />
      </div>
    </section>
  );
}

export default ProductDetailPage;