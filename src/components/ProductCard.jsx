import { useNavigate } from "react-router-dom";
import RatingStars from "../components/RatingStars";
import { useCart } from "../context/CartContext";

function ProductCard({ product, averageRating }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const effectivePrice =
    typeof product.getEffectivePrice === "function"
      ? product.getEffectivePrice()
      : product.discountPercentage
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;

  return (
    <div className="product-card">
      <div
        className="product-image-wrapper"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-image"
        />
      </div>
      <div className="product-body">
        <h3
          className="product-title clickable"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.title}
        </h3>
        <p className="product-category">{product.category}</p>
        <RatingStars rating={averageRating ?? product.rating} />
        <div className="product-prices">
          {product.discountPercentage ? (
            <>
              <span className="price-discounted">
                ${effectivePrice.toFixed(2)}
              </span>
              <span className="price-original">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="price-normal">${product.price.toFixed(2)}</span>
          )}
        </div>
        <button
          className="btn primary"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;