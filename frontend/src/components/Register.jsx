import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, UserRound, Mail, LockKeyhole, UserPlus } from 'lucide-react';
import './hotelpro-redesign.css';

export default function Register({ setView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('guest');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to create your account.');
      login(data);
      setView('rooms');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="hp-auth-page hp-register-page">
      <div className="hp-auth-visual">
        <div className="hp-auth-visual-content"><span className="hp-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h1>Good stays.<br /><em>Great stories.</em></h1><p>Create your account and make your next trip feel effortless.</p></div>
        <span className="hp-auth-photo-credit">TRAVEL A LITTLE CLOSER TO HOME</span>
      </div>
      <section className="hp-auth-panel" aria-labelledby="hp-register-title">
        <div className="hp-auth-form-wrap">
          <span className="hp-auth-symbol"><UserPlus size={23} /></span>
          <span className="hp-eyebrow">LET'S GET YOU SET UP</span>
          <h2 id="hp-register-title">Create your account</h2>
          <p className="hp-auth-description">A few details, then you're ready to explore.</p>
          {error && <div className="hp-alert hp-alert-error" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="hp-form-field"><label htmlFor="register-name">Full name</label><div className="hp-input-with-icon"><UserRound size={18} aria-hidden="true" /><input id="register-name" className="hp-control" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" /></div></div>
            <div className="hp-form-field"><label htmlFor="register-email">Email address</label><div className="hp-input-with-icon"><Mail size={18} aria-hidden="true" /><input id="register-email" className="hp-control" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" /></div></div>
            <div className="hp-form-field"><label htmlFor="register-password">Password</label><div className="hp-input-with-icon"><LockKeyhole size={18} aria-hidden="true" /><input id="register-password" className="hp-control" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Create a password" /></div></div>
            <div className="hp-form-field"><label htmlFor="register-role">Account type</label><select id="register-role" className="hp-control" value={role} onChange={(e) => setRole(e.target.value)}><option value="guest">Guest</option><option value="admin">Hotel manager (admin)</option></select><small className="hp-field-help">Choose the role that applies to your account.</small></div>
            <button type="submit" className="hp-button hp-button-primary hp-button-full hp-auth-submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'} {!submitting && <ArrowRight size={18} />}</button>
          </form>
          <p className="hp-auth-switch">Already have an account? <button type="button" onClick={() => setView('login')}>Sign in</button></p>
        </div>
      </section>
    </main>
  );
}
