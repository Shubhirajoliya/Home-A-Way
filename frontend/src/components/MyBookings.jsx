import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Calendar, DollarSign, XCircle, MapPin, Luggage, Clock3 } from 'lucide-react';
import './hotelpro-redesign.css';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    fetch('http://localhost:5000/api/bookings/mybookings', {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load your reservations.');
        return res.json();
      })
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    setError('');
    setCancellingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!res.ok) throw new Error('Cancellation failed. Please try again.');
      setBookings((current) => current.map((booking) => booking._id === id
        ? { ...booking, status: 'Cancelled', paymentStatus: 'Refunded' }
        : booking));
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId('');
    }
  };

  return (
    <main className="hp-page hp-bookings-page">
      <div className="hp-bookings-banner">
        <div><span className="hp-eyebrow">YOUR TRAVEL PLANS</span><h1>Every stay tells a story.</h1><p>All your upcoming and past reservations, together in one place.</p></div>
        <div className="hp-bookings-banner-icon"><Luggage size={46} strokeWidth={1.3} aria-hidden="true" /></div>
      </div>

      <div className="hp-section-heading hp-bookings-heading"><div><h2>My reservations</h2><p>Keep your details close and your plans simple.</p></div><span className="hp-result-count">{bookings.length} {bookings.length === 1 ? 'reservation' : 'reservations'}</span></div>
      {error && <div className="hp-alert hp-alert-error" role="alert">{error}</div>}
      {loading ? <div className="hp-state-panel" role="status"><span className="hp-spinner" />Loading your reservations…</div> : bookings.length === 0 ? (
        <div className="hp-state-panel hp-bookings-empty"><span className="hp-empty-icon"><Luggage size={28} /></span><h3>Your next story is waiting</h3><p>You don't have any reservations yet. Find a stay that feels like you.</p><button className="hp-button hp-button-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} >Explore Home Away</button></div>
      ) : (
        <div className="hp-booking-list">
          {bookings.map((booking) => (
            <article key={booking._id} className="hp-booking-card">
              <div className="hp-booking-art" aria-hidden="true"><span><Luggage size={34} /></span></div>
              <div className="hp-booking-details">
                <div className="hp-booking-title-row"><div><span className="hp-eyebrow">YOUR RESERVED STAY</span><h3>{booking.room ? booking.room.name : 'Reserved room'}</h3></div><span className={`hp-status-badge hp-booking-status hp-booking-${String(booking.status || '').toLowerCase()}`}>{booking.status}</span></div>
                <div className="hp-booking-meta"><span><Calendar size={16} aria-hidden="true" /> {booking.checkInDate.substring(0, 10)} – {booking.checkOutDate.substring(0, 10)}</span><span><DollarSign size={16} aria-hidden="true" /> Total: ${booking.totalAmount}</span><span><MapPin size={15} aria-hidden="true" /> Home Away stay</span></div>
                <div className="hp-booking-bottom"><span className="hp-payment-status"><Clock3 size={15} aria-hidden="true" /> Payment: {booking.paymentStatus}</span>
                  {booking.status === 'Confirmed' && <button className="hp-button hp-button-danger-outline" onClick={() => handleCancel(booking._id)} disabled={cancellingId === booking._id}><XCircle size={16} /> {cancellingId === booking._id ? 'Cancelling…' : 'Cancel stay'}</button>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
