import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Star, Users, CheckCircle, CreditCard, X } from 'lucide-react';

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(600);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Checkout Modal State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [cardNum, setCardNum] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchRooms();
  }, [filterType, maxPrice]);

  const fetchRooms = () => {
    let url = `http://localhost:5000/api/rooms?maxPrice=${maxPrice}`;
    if (filterType !== 'All') url += `&type=${filterType}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error(err));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please sign in to confirm a reservation.');

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1;
    const totalAmount = selectedRoom.pricePerNight * nights;

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          room: selectedRoom._id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          totalAmount
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(`✅ Booking Confirmed for ${selectedRoom.name}! Total: $${totalAmount}`);
      setSelectedRoom(null);
    } catch (err) {
      alert(`Booking Error: ${err.message}`);
    }
  };

  return (
    <div className="container">
      {/* Filtering Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Room Type</label>
          <select className="form-control" style={{ marginBottom: 0, marginTop: '4px' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Single">Single Room</option>
            <option value="Double">Double Room</option>
            <option value="Deluxe">Deluxe Suite</option>
            <option value="Penthouse">Penthouse</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Max Nightly Rate (${maxPrice})</label>
          <input type="range" min="80" max="600" step="20" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', marginTop: '8px' }} />
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid-layout">
        {rooms.map(room => (
          <div key={room._id} className="card">
            <img src={room.image} alt={room.name} className="card-img" />
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem' }}>{room.name}</h3>
                <span className={`badge badge-${room.housekeepingStatus.toLowerCase()}`}>{room.housekeepingStatus}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 12px 0' }}>{room.description}</p>
              
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: '#475569', marginBottom: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={16} /> Max {room.maxCapacity} Guests</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={16} fill="#d97706" color="#d97706" /> 4.9 (42)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>${room.pricePerNight}</span>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}> / night</span>
                </div>
                <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setSelectedRoom(room)}>Book Room</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Modal */}
      {selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Checkout: {selectedRoom.name}</h3>
              <X style={{ cursor: 'pointer' }} onClick={() => setSelectedRoom(null)} />
            </div>

            <form onSubmit={handleBooking}>
              <label>Check-in Date</label>
              <input className="form-control" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required />

              <label>Check-out Date</label>
              <input className="form-control" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required />

              <label>Simulated Payment Card</label>
              <input className="form-control" type="text" placeholder="4242 •••• •••• 4242" value={cardNum} onChange={e => setCardNum(e.target.value)} required />

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                <CreditCard size={18} style={{ display: 'inline', marginRight: '6px' }} /> Pay & Confirm
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}