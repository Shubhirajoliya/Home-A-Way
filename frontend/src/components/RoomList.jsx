import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Star, Users, CreditCard, X, MapPin, SlidersHorizontal, BedDouble, ShoppingBag, Check } from 'lucide-react';
import { addToCart, readCart } from './cartUtils';
import './hotelpro-redesign.css';

export default function RoomList({ setView }) {
  const [rooms, setRooms] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(600);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cartItems, setCartItems] = useState(() => readCart());
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchRooms();
  }, [filterType, maxPrice]);

  useEffect(() => {
    const handleCartUpdate = (e) => setCartItems(e.detail || readCart());
    window.addEventListener('homeaway-cart-updated', handleCartUpdate);
    return () => window.removeEventListener('homeaway-cart-updated', handleCartUpdate);
  }, []);

  const fetchRooms = () => {
    setLoading(true);
    setLoadError('');
    let url = `http://localhost:5000/api/rooms?maxPrice=${maxPrice}`;
    if (filterType !== 'All') url += `&type=${encodeURIComponent(filterType)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('We could not load stays right now.');
        return res.json();
      })
      .then((data) => setRooms(Array.isArray(data) ? data : []))
      .catch((err) => setLoadError(err.message || 'Something went wrong while loading stays.'))
      .finally(() => setLoading(false));
  };

  const handleAddToCart = (room) => {
    addToCart(room);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    if (!user) {
      setBookingError('Please sign in before confirming a reservation.');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setBookingError('Check-out must be after check-in.');
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = selectedRoom.pricePerNight * nights;

    try {
      setSubmitting(true);
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
      if (!res.ok) throw new Error(data.error || 'Unable to confirm this reservation.');
      alert(`Booking Confirmed for ${selectedRoom.name}! Total: $${totalAmount}`);
      setSelectedRoom(null);
      setCheckIn('');
      setCheckOut('');
      setCardNum('');
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="hp-page hp-discovery-page">
      <section className="hp-hero" aria-labelledby="hp-hero-title">
        <div className="hp-hero-copy">
          <span className="hp-eyebrow"><MapPin size={14} aria-hidden="true" /> YOUR NEXT STAY STARTS HERE</span>
          <h1 id="hp-hero-title">Find a place that feels <em>like home.</em></h1>
          <p>Thoughtfully chosen rooms for slow mornings, new places, and memorable getaways.</p>
          <a className="hp-button hp-button-primary" href="#available-stays">Explore stays <span aria-hidden="true">↗</span></a>
        </div>
        <div className="hp-hero-photo" role="img" aria-label="Warm, inviting hotel suite with natural light">
          <div className="hp-photo-caption"><span>MAKE ROOM FOR</span><strong>Something wonderful.</strong></div>
        </div>
      </section>

      <section className="hp-content-section" id="available-stays" aria-labelledby="hp-stays-title">
        <div className="hp-section-heading">
          <div>
            <span className="hp-eyebrow">FIND YOUR FIT</span>
            <h2 id="hp-stays-title">Stays worth looking forward to</h2>
            <p>Comfortable spaces, considered details, and a little room to unwind.</p>
          </div>
          <span className="hp-result-count">{loading ? 'Finding stays…' : `${rooms.length} ${rooms.length === 1 ? 'stay' : 'stays'} to explore`}</span>
        </div>

        <div className="hp-filter-panel">
          <div className="hp-filter-title"><SlidersHorizontal size={18} aria-hidden="true" /><span>Refine your search</span></div>
          <div className="hp-filter-field">
            <label htmlFor="room-type">Room type</label>
            <select id="room-type" className="hp-control" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All categories</option>
              <option value="Single">Single room</option>
              <option value="Double">Double room</option>
              <option value="Deluxe">Deluxe suite</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>
          <div className="hp-filter-field hp-price-filter">
            <div className="hp-range-label"><label htmlFor="max-price">Maximum nightly rate</label><strong>${maxPrice}</strong></div>
            <input id="max-price" type="range" min="80" max="600" step="20" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
            <div className="hp-range-ends"><span>$80</span><span>$600+</span></div>
          </div>
        </div>

        {loading && <div className="hp-state-panel" role="status"><span className="hp-spinner" />Finding your next stay…</div>}
        {!loading && loadError && (
          <div className="hp-state-panel hp-state-error" role="alert">
            <h3>We hit a little travel snag.</h3><p>{loadError}</p>
            <button className="hp-button hp-button-secondary" onClick={fetchRooms}>Try again</button>
          </div>
        )}
        {!loading && !loadError && rooms.length === 0 && (
          <div className="hp-state-panel">
            <BedDouble size={30} aria-hidden="true" />
            <h3>No stays match those filters</h3>
            <p>Try another room type or increase your nightly budget.</p>
            <button className="hp-button hp-button-secondary" onClick={() => { setFilterType('All'); setMaxPrice(600); }}>Clear filters</button>
          </div>
        )}

        {!loading && !loadError && rooms.length > 0 && (
          <div className="hp-room-grid">
            {rooms.map((room) => {
              const inCart = cartItems.some((i) => i._id === room._id);
              return (
                <article key={room._id} className="hp-room-card">
                  <div className="hp-room-image-wrap">
                    <img src={room.image} alt={room.name} className="hp-room-image" loading="lazy" />
                    <span className={`hp-status-badge hp-status-${String(room.housekeepingStatus || 'available').toLowerCase()}`}>{room.housekeepingStatus || 'Available'}</span>
                  </div>
                  <div className="hp-room-body">
                    <div className="hp-room-title-row"><h3>{room.name}</h3><span className="hp-rating"><Star size={14} fill="currentColor" aria-hidden="true" /> 4.9 <small>(42)</small></span></div>
                    <p className="hp-room-description">{room.description || 'A welcoming space designed for a comfortable stay.'}</p>
                    <div className="hp-room-meta"><span><Users size={16} aria-hidden="true" /> Up to {room.maxCapacity} guests</span><span><MapPin size={15} aria-hidden="true" /> Thoughtful comfort</span></div>
                    <div className="hp-room-footer">
                      <div className="hp-price"><strong>${room.pricePerNight}</strong><span>/ night</span></div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="hp-button hp-button-secondary"
                          onClick={() => inCart ? setView?.('cart') : handleAddToCart(room)}
                          title={inCart ? "View Cart" : "Add to Cart"}
                        >
                          {inCart ? <Check size={16} /> : <ShoppingBag size={16} />}
                        </button>
                        <button className="hp-button hp-button-primary" onClick={() => { setSelectedRoom(room); setBookingError(''); }}>Reserve</button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selectedRoom && (
        <div className="hp-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedRoom(null); }}>
          <section className="hp-modal" role="dialog" aria-modal="true" aria-labelledby="hp-checkout-title">
            <div className="hp-modal-header">
              <div><span className="hp-eyebrow">YOUR GETAWAY</span><h2 id="hp-checkout-title">Reserve {selectedRoom.name}</h2></div>
              <button type="button" className="hp-icon-button" onClick={() => setSelectedRoom(null)} aria-label="Close reservation"><X size={20} /></button>
            </div>
            <p className="hp-modal-intro">Choose your dates to see the details for your stay.</p>
            {bookingError && <div className="hp-alert hp-alert-error" role="alert">{bookingError}</div>}
            <form onSubmit={handleBooking}>
              <div className="hp-form-grid">
                <div className="hp-form-field"><label htmlFor="check-in">Check-in</label><input id="check-in" className="hp-control" type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required /></div>
                <div className="hp-form-field"><label htmlFor="check-out">Check-out</label><input id="check-out" className="hp-control" type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required /></div>
              </div>
              <div className="hp-form-field"><label htmlFor="card-number">Simulated payment card</label><input id="card-number" className="hp-control" type="text" inputMode="numeric" autoComplete="cc-number" placeholder="4242 •••• •••• 4242" value={cardNum} onChange={(e) => setCardNum(e.target.value)} required /></div>
              <div className="hp-booking-summary"><span>{selectedRoom.name}</span><strong>${selectedRoom.pricePerNight} <small>/ night</small></strong></div>
              <button type="submit" className="hp-button hp-button-primary hp-button-full" disabled={submitting}>
                <CreditCard size={18} aria-hidden="true" /> {submitting ? 'Confirming reservation…' : 'Pay & confirm reservation'}
              </button>
              <p className="hp-form-note">Demo checkout only. Payment details are not processed by a payment provider.</p>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}