import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartSummary from "../components/CartSummary";
import { saveLastOrderToStorage } from "../services/storage";
import { sanitizeString } from "../utils/security";

const GST = 0.05;
const QST = 0.09975;

const ALLOWED_PROVINCES = new Set([
  "Quebec",
  "Ontario",
  "Alberta",
  "British Columbia",
  "Other",
]);

function CheckoutPage() {
  const { cartItems, subtotal, clearCart, getDiscountedPrice } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("Quebec");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [error, setError] = useState("");

  const gst = Number((subtotal * GST).toFixed(2));
  const qst = province === "Quebec" ? Number((subtotal * QST).toFixed(2)) : 0;
  const total = Number((subtotal + gst + qst).toFixed(2));

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    const safeName = sanitizeString(name, { maxLength: 120 });
    const safeAddress = sanitizeString(address, { maxLength: 180 });
    const safeCity = sanitizeString(city, { maxLength: 120 });
    const safeProvince = ALLOWED_PROVINCES.has(province)
      ? province
      : "Other";
    const safePostalCode = sanitizeString(postalCode, {
      maxLength: 10,
    })
      .toUpperCase()
      .replace(/\s+/g, "");

    if (!safeName || !safeAddress || !safeCity || !safePostalCode) {
      setError("Please fill all required fields.");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unitPrice: getDiscountedPrice(item),
      lineTotal: Number(
        (getDiscountedPrice(item) * item.quantity).toFixed(2)
      ),
    }));

    const order = {
      id: Date.now(),
      items: orderItems,
      address: {
        name: safeName,
        address: safeAddress,
        city: safeCity,
        province: safeProvince,
        postalCode: safePostalCode,
      },
      paymentMethod,
      totals: { subtotal, gst, qst, total },
      createdAt: new Date().toISOString(),
    };

    saveLastOrderToStorage(order);
    clearCart();
    navigate("/order-confirmation", { state: { order } });
  };

  if (cartItems.length === 0)
    return (
      <section className="page">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </section>
    );

  return (
    <section className="page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        {/* FORM */}
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
  <h2 className="section-title">Shipping Information</h2>

  <div className="form-group">
    <label>Full Name</label>
    <input value={name} onChange={(e) => setName(e.target.value)} />
  </div>

  <div className="form-group">
    <label>Address</label>
    <input value={address} onChange={(e) => setAddress(e.target.value)} />
  </div>

  <div className="form-group">
    <label>City</label>
    <input value={city} onChange={(e) => setCity(e.target.value)} />
  </div>

  <div className="form-group">
    <label>Province</label>
    <select value={province} onChange={(e) => setProvince(e.target.value)}>
      <option value="Quebec">Quebec</option>
      <option value="Ontario">Ontario</option>
      <option value="Alberta">Alberta</option>
      <option value="British Columbia">British Columbia</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <div className="form-group">
    <label>Postal Code</label>
    <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
  </div>

  <h2 className="section-title">Payment Method</h2>

  <div className="form-group">
    <label><input type="radio" checked={paymentMethod==="credit"} value="credit" onChange={(e)=>setPaymentMethod(e.target.value)} /> Credit Card</label>
    <label><input type="radio" checked={paymentMethod==="paypal"} value="paypal" onChange={(e)=>setPaymentMethod(e.target.value)} /> PayPal</label>
    <label><input type="radio" checked={paymentMethod==="bank"} value="bank" onChange={(e)=>setPaymentMethod(e.target.value)} /> Bank Transfer</label>
  </div>

  {error && <p className="error-text">{error}</p>}

  <button className="btn primary full-width">Place Order</button>
</form>


        <div className="order-summary">
  <h3>Order Summary</h3>

  <div className="summary-row">
    <span>Subtotal</span>
    <span>${subtotal.toFixed(2)}</span>
  </div>

  <div className="summary-row">
    <span>GST (5%)</span>
    <span>${gst.toFixed(2)}</span>
  </div>

  <div className="summary-row">
    <span>QST (9.975%)</span>
    <span>${qst.toFixed(2)}</span>
  </div>

  <div className="summary-divider"></div>

  <div className="summary-row total">
    <span>Total</span>
    <span>${total.toFixed(2)}</span>
  </div>
</div>
      </div>
    </section>
  );
}

export default CheckoutPage;
