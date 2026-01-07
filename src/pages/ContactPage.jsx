import { useState } from "react";

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "support", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Share a few details so we can help.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setSubmitted(true);
  };

  return (
    <section className="page contact-page">
      <h1>Contact EMD</h1>
      <p className="page-subtitle">
        Questions about orders, gift cards, or partnerships? Send us a note and
        our team will reply within one business day.
      </p>

      <form className="card form" onSubmit={handleSubmit} noValidate>
        <label className="form-field">
          <span>Name</span>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Your full name"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </label>

        <label className="form-field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </label>

        <label className="form-field">
          <span>Topic</span>
          <select value={form.topic} onChange={handleChange("topic")}>
            <option value="support">Order Support</option>
            <option value="gift-cards">Gift Card Question</option>
            <option value="bulk">Bulk & Corporate</option>
            <option value="partnerships">Partnership Inquiry</option>
          </select>
        </label>

        <label className="form-field">
          <span>Message</span>
          <textarea
            value={form.message}
            onChange={handleChange("message")}
            rows={5}
            placeholder="Share the details of your request"
          />
          {errors.message && (
            <span className="form-error">{errors.message}</span>
          )}
        </label>

        <button type="submit" className="btn primary">
          Send Message
        </button>
      </form>

      {submitted && (
        <div className="card confirmation">
          <h2>Thanks for reaching out!</h2>
          <p>
            We have logged your request under <strong>{form.topic}</strong> and
            will answer at {form.email} as soon as possible.
          </p>
          <p className="small-print">
            This submission is stored locally for the demo environment. Connect
            your email provider or ticketing system to route requests in
            production.
          </p>
        </div>
      )}
    </section>
  );
}

export default ContactPage;
