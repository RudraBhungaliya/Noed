import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../App.css';

export default function Navbar() {
  const location = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar glass">
      <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Using standard text styled similarly to the logo until the image asset is formally placed in public/ */}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '0.8', fontWeight: 900, fontSize: '1.8rem', letterSpacing: '-1px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ color: '#000' }}>N</span>
            <span style={{ color: '#000' }}>O</span>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ color: '#000' }}>E</span>
            <span style={{ color: '#000' }}>D</span>
          </div>
        </div>
      </Link>
      
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
        <Link to="/shop" className={`nav-link ${isActive('/shop')}`}>Products</Link>
        <Link to="/detailing" className={`nav-link ${isActive('/detailing')}`}>Custom Orders</Link>
        <Link to="/service" className={`nav-link ${isActive('/service')}`}>Contact</Link>
      </div>

      <div className="nav-icons" style={{ color: 'var(--text-primary)' }}>
        <Link to="/checkout" className="nav-icon" style={{ position: 'relative' }}>
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartCount}
            </div>
          )}
        </Link>
        <div className="nav-icon">
          <User size={24} />
        </div>
        <div className="nav-icon mobile-menu">
          <Menu size={24} />
        </div>
      </div>
    </nav>
  );
}
