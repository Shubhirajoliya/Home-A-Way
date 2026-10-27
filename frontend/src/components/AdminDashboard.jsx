import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('Deluxe');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('2');
  const [description, setDescription] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data));
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ name, type, pricePerNight: Number(price), maxCapacity: Number(capacity), description })
      });
      if (!res.ok) throw new Error('Failed to add room inventory.');
      fetchRooms();
      setName(''); setPrice(''); setDescription('');
    } catch (err) {
      alert(err.message);
    }
  };

  const updateHousekeeping = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/rooms/${id}/housekeeping`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ housekeepingStatus: status })
      });
      fetchRooms();
    } catch (err) {
      alert('Failed to update room status.');
    }
  };

  return (
    <div className="container">
      <h2>Hotel Manager Administrative Console</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Add Room Panel */}
        <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0 }}><PlusCircle size={20} inline /> Add New Room</h3>
          <form onSubmit={handleAddRoom}>
            <label>Room Name</label>
            <input className="form-control" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Grand Ocean View Suite" />

            <label>Type</label>
            <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Penthouse">Penthouse</option>
            </select>

            <label>Nightly Rate ($)</label>
            <input className="form-control" type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="250" />

            <label>Max Guests</label>
            <input className="form-control" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} required />

            <label>Description</label>
            <textarea className="form-control" rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="Balcony view with king bed..." />

            <button type="submit" className="btn-primary">Add Room</button>
          </form>
        </div>

        {/* Inventory Housekeeping Tracker */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>Housekeeping & Inventory Status</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '8px' }}>Room</th>
                <th>Type</th>
                <th>Rate</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 8px', fontWeight: '600' }}>{r.name}</td>
                  <td>{r.type}</td>
                  <td>${r.pricePerNight}</td>
                  <td><span className={`badge badge-${r.housekeepingStatus.toLowerCase()}`}>{r.housekeepingStatus}</span></td>
                  <td>
                    <select 
                      value={r.housekeepingStatus} 
                      onChange={e => updateHousekeeping(r._id, e.target.value)}
                      style={{ padding: '4px', borderRadius: '4px' }}
                    >
                      <option value="Clean">Clean</option>
                      <option value="Dirty">Dirty</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}