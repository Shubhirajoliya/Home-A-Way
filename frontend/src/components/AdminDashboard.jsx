import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, RefreshCw, BedDouble, ClipboardCheck, Users, DollarSign, Trash2 } from 'lucide-react';
import './hotelpro-redesign.css';

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('Deluxe');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('2');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/rooms')
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load room inventory.');
        return res.json();
      })
      .then((data) => setRooms(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ name, type, pricePerNight: Number(price), maxCapacity: Number(capacity), description })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to add room inventory.');
      await fetchRooms();
      setName(''); setPrice(''); setDescription('');
      setSuccess('Room added to your inventory.');
    } catch (err) {
      setError(err.message);
    }
  };

  const updateHousekeeping = async (id, status) => {
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${id}/housekeeping`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ housekeepingStatus: status })
      });
      if (!res.ok) throw new Error('Failed to update room status.');
      fetchRooms();
    } catch (err) {
      setError(err.message || 'Failed to update room status.');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) return;
    setError('');
    setSuccess('');
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete room.');
      }
      setRooms((prev) => prev.filter((r) => r._id !== id));
      setSuccess('Room deleted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to delete room.');
    } finally {
      setDeletingId('');
    }
  };

  const availableRooms = rooms.filter((room) => String(room.housekeepingStatus).toLowerCase() === 'clean').length;
  const totalCapacity = rooms.reduce((total, room) => total + Number(room.maxCapacity || 0), 0);

  return (
    <main className="hp-page hp-admin-page">
      <div className="hp-page-heading">
        <div><span className="hp-eyebrow">PROPERTY OVERVIEW</span><h1>Good to see you, manager.</h1><p>Keep your rooms ready and your next guest welcome.</p></div>
        <button className="hp-button hp-button-secondary" onClick={fetchRooms} disabled={loading}><RefreshCw size={17} className={loading ? 'hp-spin' : ''} /> Refresh inventory</button>
      </div>

      <section className="hp-metric-grid" aria-label="Inventory summary">
        <article className="hp-metric-card"><span className="hp-metric-icon"><BedDouble size={19} /></span><span className="hp-metric-label">Total rooms</span><strong>{rooms.length}</strong><small>In your inventory</small></article>
        <article className="hp-metric-card"><span className="hp-metric-icon hp-metric-icon-green"><ClipboardCheck size={19} /></span><span className="hp-metric-label">Clean & ready</span><strong>{availableRooms}</strong><small>Marked clean</small></article>
        <article className="hp-metric-card"><span className="hp-metric-icon hp-metric-icon-blue"><Users size={19} /></span><span className="hp-metric-label">Guest capacity</span><strong>{totalCapacity}</strong><small>Across all rooms</small></article>
        <article className="hp-metric-card"><span className="hp-metric-icon hp-metric-icon-gold"><DollarSign size={19} /></span><span className="hp-metric-label">Starting rate</span><strong>{rooms.length ? `$${Math.min(...rooms.map((room) => Number(room.pricePerNight || 0)))}` : '—'}</strong><small>Per night</small></article>
      </section>

      {error && <div className="hp-alert hp-alert-error" role="alert">{error}</div>}
      {success && <div className="hp-alert hp-alert-success" role="status">{success}</div>}

      <div className="hp-admin-layout">
        <section className="hp-panel hp-add-room-panel">
          <div className="hp-panel-heading"><div><span className="hp-eyebrow">ROOM SETUP</span><h2>Add a new room</h2></div><span className="hp-panel-heading-icon"><PlusCircle size={20} /></span></div>
          <form onSubmit={handleAddRoom}>
            <div className="hp-form-field"><label htmlFor="room-name">Room name</label><input id="room-name" className="hp-control" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Grand Ocean View Suite" /></div>
            <div className="hp-form-field"><label htmlFor="room-category">Room type</label><select id="room-category" className="hp-control" value={type} onChange={(e) => setType(e.target.value)}><option value="Single">Single</option><option value="Double">Double</option><option value="Deluxe">Deluxe</option><option value="Penthouse">Penthouse</option></select></div>
            <div className="hp-form-grid">
              <div className="hp-form-field"><label htmlFor="room-price">Nightly rate ($)</label><input id="room-price" className="hp-control" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="250" /></div>
              <div className="hp-form-field"><label htmlFor="room-capacity">Max guests</label><input id="room-capacity" className="hp-control" type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} required /></div>
            </div>
            <div className="hp-form-field"><label htmlFor="room-description">Description <span className="hp-optional">(optional)</span></label><textarea id="room-description" className="hp-control hp-textarea" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Balcony view with king bed…" /></div>
            <button type="submit" className="hp-button hp-button-primary hp-button-full"><PlusCircle size={18} /> Add room to inventory</button>
          </form>
        </section>

        <section className="hp-panel hp-inventory-panel">
          <div className="hp-panel-heading"><div><span className="hp-eyebrow">HOUSEKEEPING</span><h2>Room inventory</h2><p>Update each room's status or remove unlisted stays.</p></div><span className="hp-inventory-count">{rooms.length} rooms</span></div>
          {loading ? <div className="hp-state-inline" role="status">Loading inventory…</div> : rooms.length === 0 ? <div className="hp-state-inline">No rooms have been added yet.</div> : (
            <div className="hp-table-wrap" role="region" aria-label="Room inventory table" tabIndex="0">
              <table className="hp-table">
                <thead><tr><th scope="col">Room</th><th scope="col">Type</th><th scope="col">Rate</th><th scope="col">Status</th><th scope="col">Update status</th><th scope="col">Actions</th></tr></thead>
                <tbody>{rooms.map((room) => (
                  <tr key={room._id}>
                    <td><strong>{room.name}</strong><small>Up to {room.maxCapacity} guests</small></td>
                    <td>{room.type}</td><td>${room.pricePerNight}</td>
                    <td><span className={`hp-status-badge hp-status-${String(room.housekeepingStatus || 'unknown').toLowerCase()}`}>{room.housekeepingStatus}</span></td>
                    <td><label className="hp-sr-only" htmlFor={`status-${room._id}`}>Housekeeping status for {room.name}</label><select id={`status-${room._id}`} className="hp-control hp-table-select" value={room.housekeepingStatus} onChange={(e) => updateHousekeeping(room._id, e.target.value)}><option value="Clean">Clean</option><option value="Dirty">Dirty</option><option value="Maintenance">Maintenance</option></select></td>
                    <td>
                      <button
                        type="button"
                        className="hp-button hp-button-danger-outline"
                        style={{ padding: '6px 10px', minHeight: '32px' }}
                        disabled={deletingId === room._id}
                        onClick={() => handleDeleteRoom(room._id)}
                        title="Delete Room"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}