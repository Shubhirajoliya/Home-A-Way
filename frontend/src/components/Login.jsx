import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import './hotelpro-redesign.css';

export default function Login({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to sign in. Please check your details.');
      login(data);
      setView('rooms');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="hp-auth-page">
      <div className="hp-auth-visual">
        <div className="hp-auth-visual-content"><span className="hp-eyebrow">A LITTLE ESCAPE, A LOT OF COMFORT</span><h1>Arrive as a guest.<br /><em>Feel right at home.</em></h1><p>Find your place to pause, explore, and make memories.</p></div>
        <span className="hp-auth-photo-credit">YOUR HOME AWAY FROM HOME</span>
      </div>
      <section className="hp-auth-panel" aria-labelledby="hp-login-title">
        <div className="hp-auth-form-wrap">
          <span className="hp-auth-symbol"><ShieldCheck size={23} /></span>
          <span className="hp-eyebrow">WELCOME BACK</span>
          <h2 id="hp-login-title">Sign in to Home Away</h2>
          <p className="hp-auth-description">Pick up where your next getaway begins.</p>
          {error && <div className="hp-alert hp-alert-error" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="hp-form-field"><label htmlFor="login-email">Email address</label><div className="hp-input-with-icon"><Mail size={18} aria-hidden="true" /><input id="login-email" className="hp-control" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" /></div></div>
            <div className="hp-form-field"><label htmlFor="login-password">Password</label><div className="hp-input-with-icon"><LockKeyhole size={18} aria-hidden="true" /><input id="login-password" className="hp-control" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" /></div></div>
            <button type="submit" className="hp-button hp-button-primary hp-button-full hp-auth-submit" disabled={submitting}>{submitting ? 'Signing you in…' : 'Sign in'} {!submitting && <ArrowRight size={18} />}</button>
          </form>
          <p className="hp-auth-switch">New to Home Away? <button type="button" onClick={() => setView('register')}>Create an account</button></p>
          <p className="hp-auth-footnote">By continuing, you agree to use your account responsibly.</p>
        </div>
      </section>
    </main>
  );
}
