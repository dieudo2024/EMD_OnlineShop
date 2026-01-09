import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>Menu</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/deals">Today&apos;s Deals</Link>
            </li>
            <li>
              <Link to="/gift-cards">Gift Cards</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Social</h3>
          <ul className="social-links">
            <li>
              <a href="#" aria-label="Follow EMD on Instagram">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
                  alt="Instagram"
                  className="social-icon"
                />
              </a>
            </li>
            <li>
              <a href="#" aria-label="Follow EMD on X">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg"
                  alt="X"
                  className="social-icon"
                />
              </a>
            </li>
            <li>
              <a href="#" aria-label="Follow EMD on Facebook">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg"
                  alt="Facebook"
                  className="social-icon"
                />
              </a>
            </li>
            <li>
              <a href="#" aria-label="Connect with EMD on LinkedIn">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg"
                  alt="LinkedIn"
                  className="social-icon"
                />
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Let’s stay connected</h3>
          <p>Reach out about a project, collaboration, or just to say hello.</p>

          <form className="footer-form">
            <div className="form-field">
              <span>Email*</span>
              <input type="email" placeholder="you@example.com" required />
            </div>
            <div className="form-field">
              <span>Message*</span>
              <textarea placeholder="Tell us how we can help" required />
            </div>
            <button type="submit" className="btn primary">
              Send
            </button>
          </form>
        </div>
      </div>

      <p className="footer-note">
        © {new Date().getFullYear()} EMD. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;