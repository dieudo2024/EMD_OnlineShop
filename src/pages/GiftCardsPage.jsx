import { Link } from "react-router-dom";

function GiftCardsPage() {
  return (
    <section className="page">
      <h1>Gift Cards</h1>
      <p className="page-subtitle">
        Share the joy of shopping at EMD with friends and family.
      </p>

      <div className="card gift-card-hero">
        <h2>Digital Gift Cards</h2>
        <p>
          Send an instant surprise by email. Choose an amount, add a personal
          message, and your recipient can redeem it at checkout on any order.
        </p>
        <Link to="/gift-cards/purchase" className="btn primary">
          Buy a Gift Card
        </Link>
      </div>

      <section className="gift-card-details">
        <h3>Why gift with EMD?</h3>
        <ul>
          <li>Flexible values starting at $10.</li>
          <li>Never expires and works on every product.</li>
          <li>Track remaining balance in your account dashboard.</li>
        </ul>
      </section>

      <section className="gift-card-faq">
        <h3>Frequently Asked Questions</h3>
        <h4>How do recipients redeem their gift card?</h4>
        <p>
          Gift cards arrive via email with a unique code. Enter that code during
          checkout and the balance automatically applies to the order total.
        </p>
        <h4>Can I schedule delivery?</h4>
        <p>
          Yes. Pick any future date and we will send the digital card on your
          behalf right on time.
        </p>
        <h4>Need more help?</h4>
        <p>
          Reach our support team anytime at support@emdshop.com. We are happy
          to assist with corporate or bulk orders too.
        </p>
      </section>
    </section>
  );
}

export default GiftCardsPage;
