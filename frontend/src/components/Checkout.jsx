import React, { useContext, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, CreditCard, LockKeyhole, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './hotelpro-redesign.css';
import { clearCart, readCart } from './cartUtils';

export default function Checkout({ setView }) {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState(() => readCart());
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const nights = useMemo(() => checkIn && checkOut && new Date(checkOut) > new Date(checkIn) ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000) : 0, [checkIn, checkOut]);
  const total = items.reduce((sum, item) => sum + Number(item.pricePerNight || 0), 0) * nights;
  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (!user) { setError('Please sign in before completing checkout.'); return; }
    if (!items.length) { setError('Your trip cart is empty. Add a stay before checking out.'); return; }
    if (!nights) { setError('Choose a check-out date after your check-in date.'); return; }
    try { setSubmitting(true);
      for (const item of items) {
        const res = await fetch('http://localhost:5000/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` }, body: JSON.stringify({ room: item._id, checkInDate: checkIn, checkOutDate: checkOut, totalAmount: Number(item.pricePerNight || 0) * nights }) });
        const data = await res.json(); if (!res.ok) throw new Error(data.error || `Unable to reserve ${item.name}.`);
      }
      clearCart(); setItems([]); setSuccess(true);
    } catch (err) { setError(err.message || 'Checkout could not be completed. Please try again.'); } finally { setSubmitting(false); }
  };
  if (success) return <main className="hp-page hp-checkout-page"><section className="hp-checkout-success"><span><CheckCircle2 size={36}/></span><span className="hp-eyebrow">ALL SET</span><h1>Your getaway is taking shape.</h1><p>Your booking request was submitted. Visit My bookings to review the reservation status.</p><button className="hp-button hp-button-primary" onClick={() => setView('mybookings')}>View my bookings <CheckCircle2 size={17}/></button></section></main>;
  return <main className="hp-page hp-checkout-page"><button className="hp-back-link" onClick={() => setView('cart')}><ArrowLeft size={16}/> Back to trip cart</button><div className="hp-checkout-heading"><span className="hp-eyebrow">JUST A FEW MORE DETAILS</span><h1>Make it <em>official.</em></h1><p>Choose your dates and review the details before confirming your stay.</p></div>
    {!user && <div className="hp-alert hp-alert-error" role="alert">Please <button className="hp-inline-link" onClick={() => setView('login')}>sign in</button> before checkout so we can attach reservations to your account.</div>}
    {error && <div className="hp-alert hp-alert-error" role="alert">{error}</div>}
    <div className="hp-checkout-layout"><form className="hp-checkout-form hp-panel" onSubmit={submit}><div className="hp-panel-heading"><div><span className="hp-eyebrow">01 / YOUR DATES</span><h2>When are you going?</h2><p>These dates apply to every stay in your cart.</p></div><CalendarDays size={24}/></div><div className="hp-form-grid"><div className="hp-form-field"><label htmlFor="checkout-in">Check-in</label><input className="hp-control" id="checkout-in" type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required/></div><div className="hp-form-field"><label htmlFor="checkout-out">Check-out</label><input className="hp-control" id="checkout-out" type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required/></div></div><div className="hp-checkout-divider"/><div className="hp-panel-heading"><div><span className="hp-eyebrow">02 / GUEST DETAILS</span><h2>Who should we welcome?</h2><p>Use the name you'd like associated with this demo checkout.</p></div></div><div className="hp-form-field"><label htmlFor="checkout-name">Name on reservation</label><input id="checkout-name" className="hp-control" value={cardName} onChange={(e) => setCardName(e.target.value)} autoComplete="name" placeholder={user?.name || 'Full name'} required/></div><div className="hp-checkout-divider"/><div className="hp-panel-heading"><div><span className="hp-eyebrow">03 / PAYMENT DEMO</span><h2>Payment details</h2><p>No real transaction will take place.</p></div><CreditCard size={24}/></div><div className="hp-form-field"><label htmlFor="checkout-card">Demo card number</label><input id="checkout-card" className="hp-control" inputMode="numeric" autoComplete="cc-number" value={cardNum} onChange={(e) => setCardNum(e.target.value)} placeholder="4242 4242 4242 4242" required/></div><p className="hp-form-note"><LockKeyhole size={14}/> Demo only: card details are not sent to a payment gateway. For production, use a PCI-compliant payment provider.</p><button className="hp-button hp-button-primary hp-button-full hp-checkout-submit" type="submit" disabled={submitting || !items.length}>{submitting ? 'Submitting reservations…' : `Confirm demo booking · $${total}`} <ArrowLeft className="hp-arrow-flip" size={17}/></button></form>
    <aside className="hp-checkout-summary hp-panel"><span className="hp-eyebrow">YOUR STAY DETAILS</span><h2>Booking summary</h2>{items.length ? <div className="hp-checkout-items">{items.map((item) => <div className="hp-checkout-item" key={item._id}><img src={item.image} alt=""/><div><strong>{item.name}</strong><small>${item.pricePerNight} × {nights || '—'} {nights === 1 ? 'night' : 'nights'}</small></div><b>${Number(item.pricePerNight || 0) * nights}</b></div>)}</div> : <div className="hp-state-inline">Your cart is empty. <button className="hp-inline-link" onClick={() => setView('rooms')}>Explore stays</button></div>}<div className="hp-summary-line"><span>Length of stay</span><strong>{nights ? `${nights} ${nights === 1 ? 'night' : 'nights'}` : 'Select dates'}</strong></div><div className="hp-summary-line"><span>Taxes & fees</span><strong>Included in demo</strong></div><div className="hp-summary-total"><span>Estimated total</span><strong>${total}</strong></div><div className="hp-cart-trust"><ShieldCheck size={18}/><span>You're in control<br/><small>Review your dates before submitting.</small></span></div></aside></div></main>;
}
