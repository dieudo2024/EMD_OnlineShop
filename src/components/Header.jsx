import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logoImage from "../styles/logo.png"; 

function Header() {
  const { itemCount } = useCart();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <img src={logoImage} alt="EMD Shop Logo" className="logo-img" />
      
        </Link>

        <nav className="nav">          
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>

          <NavLink to="/deals" className="nav-link">
            Today's Deals
          </NavLink>

          <NavLink  to="#" className={({ isActive }) =>"nav-link disabled-link"}>
            Gift Cards
          </NavLink>

          <NavLink  to="#" className={({ isActive }) =>"nav-link disabled-link"}>
            About
          </NavLink>

          <NavLink to="/cart" className="nav-link">
            Cart <span className="cart-count">{itemCount}</span>
          </NavLink>

          <NavLink to="/admin/principles" className="nav-link">
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
