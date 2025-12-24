import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* MENU */}
        <div className="footer-column">
          <h3>Menu</h3>
          {/* Original ReactShop links */}
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
             <li><a href="#">Today's Deals</a></li>
            <li><a href="#">Gift Cards</a></li>
            <li><a href="#">About</a></li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li><a href="#">Contact</a></li>
          </ul>

          
        </div>

        {/* SOCIAL */}
        <div className="footer-column">
          <h3>Social</h3>
          <ul className="social-links">
            <li>
              <a href="#">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
                  width="32"
                  style={{ verticalAlign: "middle", marginRight: "8px", filter: "invert(1)" }}
                />
              </a>
            </li>
            <li>
              <a href="#">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg"
                  width="32"
                  style={{ verticalAlign: "middle", marginRight: "8px", filter: "invert(1)" }}
                />
              </a>
            </li>
            <li>
              <a href="#">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg"
                  width="32"
                  style={{ verticalAlign: "middle", marginRight: "8px", filter: "invert(1)" }}
                />
              </a>
            </li>
            <li>
              <a href="#">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/indeed.svg"
                  width="32"
                  style={{ verticalAlign: "middle", marginRight: "8px", filter: "invert(1)" }}
                />
              </a>
            </li>
          </ul>
        </div>

        {/* CONTACT FORM */}
       
        <div className="footer-column wide">
          <h2>Let’s stay connected</h2>
          <p>Reach out about a project, collaboration or just to say hello!</p>

          <form className="footer-form">
            <div class="form-group">
            <label>Email*</label>
            <input type="email" required />
            </div>
            <div class="form-group">
            <label>Message*</label>
            <textarea required></textarea>
            </div>
            <button type="submit" className="send-button">Send</button>
          </form>
        </div>
      </div>

      <p style={{ marginTop: "20px" }}>
        © {new Date().getFullYear()} EMD. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;