import { useMemo, useState } from "react";

const presetAmounts = [25, 50, 75, 100, 150];

function GiftCardPurchasePage() {
  const [form, setForm] = useState({
    senderName: "",
    recipientName: "",
    recipientEmail: "",
    amount: presetAmounts[0],
    deliveryDate: "",
    message: "",
  });
  const [customAmount, setCustomAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const effectiveAmount = useMemo(() => {
    if (customAmount) {
      return Number(customAmount) || presetAmounts[0];
    }
    return Number(form.amount) || presetAmounts[0];
  }, [customAmount, form.amount]);

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleCustomAmountChange = (event) => {
    const value = event.target.value;
    setCustomAmount(value);
    setErrors((prev) => ({ ...prev, amount: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.senderName.trim()) {
      nextErrors.senderName = "Sender name is required.";
    }
    if (!form.recipientName.trim()) {
      nextErrors.recipientName = "Recipient name is required.";
    }
    if (!form.recipientEmail.trim()) {
      nextErrors.recipientEmail = "Recipient email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recipientEmail)) {
      nextErrors.recipientEmail = "Enter a valid email address.";
    }

    const chosenAmount = effectiveAmount;
    if (!Number.isFinite(chosenAmount) || chosenAmount < 10) {
      nextErrors.amount = "Gift card amount must be at least $10.";
    }

    if (!form.deliveryDate) {
      nextErrors.deliveryDate = "Pick a delivery date.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const order = {
      ...form,
      amount: effectiveAmount,
      customAmount: customAmount ? effectiveAmount : null,
      submittedAt: new Date().toISOString(),
    };

    setSubmittedOrder(order);
  };

  return (
    <section className="page gift-card-purchase">
      <h1>Buy a Gift Card</h1>
      <p className="page-subtitle">
        Send a personalized gift card instantly or schedule delivery for later.
      </p>

      <div className="gift-card-layout">
        <form className="card form" onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend>Sender</legend>
            <label className="form-field">
              <span>Your name</span>
              <input
                type="text"
                value={form.senderName}
                onChange={handleFieldChange("senderName")}
                placeholder="Alex Smith"
              />
              {errors.senderName && (
                <span className="form-error">{errors.senderName}</span>
              )}
            </label>
          </fieldset>

          <fieldset>
            <legend>Recipient</legend>
            <label className="form-field">
              <span>Recipient name</span>
              <input
                type="text"
                value={form.recipientName}
                onChange={handleFieldChange("recipientName")}
                placeholder="Jamie Doe"
              />
              {errors.recipientName && (
                <span className="form-error">{errors.recipientName}</span>
              )}
            </label>
            <label className="form-field">
              <span>Recipient email</span>
              <input
                type="email"
                value={form.recipientEmail}
                onChange={handleFieldChange("recipientEmail")}
                placeholder="jamie@example.com"
              />
              {errors.recipientEmail && (
                <span className="form-error">{errors.recipientEmail}</span>
              )}
            </label>
          </fieldset>

          <fieldset>
            <legend>Amount</legend>
            <div className="amount-options">
              {presetAmounts.map((value) => (
                <label key={value} className="amount-option">
                  <input
                    type="radio"
                    name="amount"
                    value={value}
                    checked={!customAmount && Number(form.amount) === value}
                    onChange={handleFieldChange("amount")}
                  />
                  ${value}
                </label>
              ))}
              <label className="amount-option custom">
                <input
                  type="radio"
                  name="amount"
                  value="custom"
                  checked={Boolean(customAmount)}
                  onChange={() => {
                    setCustomAmount("50");
                    setForm((prev) => ({ ...prev, amount: "custom" }));
                  }}
                />
                Other
              </label>
            </div>
            {Boolean(customAmount) && (
              <input
                type="number"
                className="custom-amount-input"
                min="10"
                step="5"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Enter amount"
              />
            )}
            {errors.amount && <span className="form-error">{errors.amount}</span>}
          </fieldset>

          <fieldset>
            <legend>Delivery</legend>
            <label className="form-field">
              <span>Delivery date</span>
              <input
                type="date"
                value={form.deliveryDate}
                onChange={handleFieldChange("deliveryDate")}
              />
              {errors.deliveryDate && (
                <span className="form-error">{errors.deliveryDate}</span>
              )}
            </label>
            <label className="form-field">
              <span>Personal message</span>
              <textarea
                value={form.message}
                onChange={handleFieldChange("message")}
                placeholder="Write a short note..."
                rows={4}
              />
            </label>
          </fieldset>

          <button type="submit" className="btn primary">
            Preview Gift Card
          </button>
        </form>

        <aside className="card order-summary">
          <h2>Order Summary</h2>
          <p>
            Amount: <strong>${effectiveAmount.toFixed(2)}</strong>
          </p>
          <p>
            Recipient: <strong>{form.recipientName || "—"}</strong>
          </p>
          <p>
            Delivery date: <strong>{form.deliveryDate || "—"}</strong>
          </p>
          <p>
            Message preview:
          </p>
          <blockquote>{form.message || "(No message)"}</blockquote>
          <p className="small-print">
            You will confirm payment on the next screen after submitting the
            preview.
          </p>
        </aside>
      </div>

      {submittedOrder && (
        <div className="card confirmation">
          <h2>Looks great!</h2>
          <p>
            We are ready to process the digital card for {submittedOrder.recipientName}.
            A confirmation email will be sent to {submittedOrder.senderName} at the
            address on file.
          </p>
          <p>
            Reference amount: <strong>${submittedOrder.amount.toFixed(2)}</strong>
          </p>
          <p className="small-print">
            Payment collection is simulated for this demo. Integrate your payment
            gateway to complete the workflow.
          </p>
        </div>
      )}
    </section>
  );
}

export default GiftCardPurchasePage;
