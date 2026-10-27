import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  BedDouble, CalendarCheck, ShieldCheck, LogOut,
  LogIn, UserPlus, Menu, X, ShoppingBag
} from 'lucide-react';
import { readCart } from './cartUtils';
import './hotelpro-redesign.css';

export default function Navbar({ currentView, setView }) {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => readCart().length);

  useEffect(() => {
    const handleCartUpdate = (e) => {
      const items = e.detail || readCart();
      setCartCount(items.length);
    };
    window.addEventListener('homeaway-cart-updated', handleCartUpdate);
    return () => window.removeEventListener('homeaway-cart-updated', handleCartUpdate);
  }, []);

  const navigate = (view) => {
    setView(view);
    setMenuOpen(false);
  };

  return (
    <header className="hp-navbar">
      <div className="hp-nav-inner">
        <button className="hp-brand" onClick={() => navigate('rooms')} aria-label="Home Away home">
          <span className="hp-brand-mark" aria-hidden="true">
            <img src="/night.png" alt="" className="hp-brand-logo" />
          </span>
          <span className="hp-brand-wordmark">
            <span>Home</span><i aria-hidden="true" />Away
            <small>STAYS THAT FEEL LIKE HOME</small>
          </span>
        </button>

        <button
          type="button"
          className="hp-mobile-menu"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`hp-nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <button className={`hp-nav-link ${currentView === 'rooms' ? 'is-active' : ''}`} onClick={() => navigate('rooms')}>
            <BedDouble size={18} aria-hidden="true" /> <span>Explore stays</span>
          </button>

          {/* <button className={`hp-nav-link ${currentView === 'cart' ? 'is-active' : ''}`} onClick={() => navigate('cart')}>
            <ShoppingBag size={18} aria-hidden="true" /> <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
          </button> */}

          {user ? (
            <>
              <button className={`hp-nav-link ${currentView === 'mybookings' ? 'is-active' : ''}`} onClick={() => navigate('mybookings')}>
                <CalendarCheck size={18} aria-hidden="true" /> <span>My bookings</span>
              </button>
              {user.role === 'admin' && (
                <button className={`hp-nav-link ${currentView === 'admin' ? 'is-active' : ''}`} onClick={() => navigate('admin')}>
                  <ShieldCheck size={18} aria-hidden="true" /> <span>Manager</span>
                </button>
              )}
              <button className="hp-nav-link hp-nav-logout" onClick={() => { logout(); setMenuOpen(false); }}>
                <LogOut size={18} aria-hidden="true" /> <span>Sign out ({user.name.split(' ')[0]})</span>
              </button>
            </>
          ) : (
            <>
              <button className={`hp-nav-link ${currentView === 'login' ? 'is-active' : ''}`} onClick={() => navigate('login')}>
                <LogIn size={18} aria-hidden="true" /> <span>Sign in</span>
              </button>
              <button className="hp-button hp-button-primary hp-nav-cta" onClick={() => navigate('register')}>
                <UserPlus size={17} aria-hidden="true" /> Create account
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}