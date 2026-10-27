import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Calendar, DollarSign, XCircle } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/api/bookings/mybookings', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setBookings(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!res.ok) throw new Error('Cancellation failed.');
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'Cancelled', paymentStatus: 'Refunded' } : b));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h2>My Hotel Reservations</h2>
      {bookings.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>You have no past or upcoming reservations.</div>
      ) : (
        bookings.map(b => (
          <div key={b._id} className="card" style={{ padding: '1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0' }}>{b.room ? b.room.name : 'Reserved Room'}</h3>
              <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '0.9rem', display: 'flex', gap: '12px' }}>
                <span><Calendar size={15} inline /> {b.checkInDate.substring(0, 10)} to {b.checkOutDate.substring(0, 10)}</span>
                <span><DollarSign size={15} inline /> Total: ${b.totalAmount}</span>
              </p>
              <div>
                <span className={`badge ${b.status === 'Confirmed' ? 'badge-clean' : 'badge-dirty'}`}>{b.status}</span>
                <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: '#64748b' }}>Payment: {b.paymentStatus}</span>
              </div>
            </div>

            {b.status === 'Confirmed' && (
              <button 
                onClick={() => handleCancel(b._id)} 
                style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
              >
                <XCircle size={16} inline /> Cancel Stay
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}