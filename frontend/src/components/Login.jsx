import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
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
    <div className="container" style={{ maxWidth: '420px', marginTop: '4rem' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Sign In to HotelPro</h2>
        {error && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="guest@example.com" />
          
          <label>Password</label>
          <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          
          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
}