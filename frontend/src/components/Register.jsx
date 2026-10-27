import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Register({ setView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('guest');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      login(data);
      setView('rooms');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', marginTop: '3rem' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Create Account</h2>
        {error && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input className="form-control" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />

          <label>Email Address</label>
          <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" />

          <label>Password</label>
          <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />

          <label>Account Role</label>
          <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
            <option value="guest">Guest User</option>
            <option value="admin">Hotel Manager (Admin)</option>
          </select>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Register</button>
        </form>
      </div>
    </div>
  );
}