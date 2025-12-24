import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    getDiscountedPrice,
  } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0)
    return (
      <section className="page">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
      </section>
    );

  return (
    <section className="page">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => {
            const effectivePrice = getDiscountedPrice(item);
            return (
              <div key={item.id} className="cart-item">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3>{item.title}</h3>
                  <p>Unit price: ${effectivePrice.toFixed(2)}</p>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <p>
                    Line total: $
                    {(effectivePrice * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="btn danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h3>Summary</h3>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Taxes and shipping calculated at checkout.</p>
          <button
            className="btn primary full-width"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
}

export default CartPage;