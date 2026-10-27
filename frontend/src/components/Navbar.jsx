import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Building2, BedDouble, CalendarCheck, ShieldCheck, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar({ currentView, setView }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
     
      <div className="logo-brand" onClick={() => setView('rooms')}>
        <img
          src="/night.png"
          alt="Home Away Logo"
          className="brand-logo"
        />
        <span>
        <span style={{ color: '#D97706' }}>Home </span>Away
      </span>
      </div>


      <nav className="nav-links">
        <button 
          className={`nav-btn ${currentView === 'rooms' ? 'active' : ''}`} 
          onClick={() => setView('rooms')}
        >
          <BedDouble size={18} /> Rooms
        </button>

        {user ? (
          <>
            <button 
              className={`nav-btn ${currentView === 'mybookings' ? 'active' : ''}`} 
              onClick={() => setView('mybookings')}
            >
              <CalendarCheck size={18} /> My Bookings
            </button>

            {user.role === 'admin' && (
              <button 
                className={`nav-btn ${currentView === 'admin' ? 'active' : ''}`} 
                onClick={() => setView('admin')}
              >
                <ShieldCheck size={18} /> Admin Console
              </button>
            )}

            <button className="nav-btn" onClick={logout} style={{ color: '#ef4444' }}>
              <LogOut size={18} /> Logout ({user.name.split(' ')[0]})
            </button>
          </>
        ) : (
          <>
            <button 
              className={`nav-btn ${currentView === 'login' ? 'active' : ''}`} 
              onClick={() => setView('login')}
            >
              <LogIn size={18} /> Login
            </button>
            <button 
              className="btn-primary" 
              onClick={() => setView('register')}
              style={{ width: 'auto', padding: '8px 16px' }}
            >
              <UserPlus size={18} style={{ display: 'inline', marginRight: '6px' }} /> Register
            </button>
          </>
        )}
      </nav>
    </header>
  );
}