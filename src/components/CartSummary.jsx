function CartSummary({ subtotal, gst, qst, total }) {
  return (
    <div className="cart-summary">
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
      <div className="summary-row total-row">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default CartSummary;