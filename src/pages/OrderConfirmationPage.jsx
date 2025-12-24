import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadLastOrderFromStorage } from "../services/storage";

function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);

  // restore from localStorage on refresh
  useEffect(() => {
    if (!order) {
      const saved = loadLastOrderFromStorage();
      if (saved) setOrder(saved);
    }
  }, [order]);

  if (!order) {
    return (
      <section className="page">
        <h1>No order found</h1>
        <button className="btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Thank you for your order!</h1>
      <p>Your order ID: {order.id}</p>

      <h2>Items</h2>
      <div className="order-items">
        {order.items.map((item) => (
          <div key={item.id} className="order-item">
            <span>{item.title}</span>
            <span>x{item.quantity}</span>
            <span>${item.lineTotal.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <h2>Totals</h2>
      <p>Subtotal: ${order.totals.subtotal.toFixed(2)}</p>
      <p>GST: ${order.totals.gst.toFixed(2)}</p>
      <p>QST: ${order.totals.qst.toFixed(2)}</p>
      <strong>Total: ${order.totals.total.toFixed(2)}</strong>

      <h2>Shipping</h2>
      <p>
        {order.address.name}<br />
        {order.address.address}<br />
        {order.address.city}, {order.address.province} {order.address.postalCode}
      </p>

      <h2>Payment Method</h2>
      <p>{order.paymentMethod}</p>

      <button className="btn primary" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </section>
  );
}

export default OrderConfirmationPage;