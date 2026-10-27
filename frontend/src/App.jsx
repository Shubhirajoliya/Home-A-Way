import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import RoomList from './components/RoomList';
import MyBookings from './components/MyBookings';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

export default function App() {
  const [view, setView] = useState('rooms');

  return (
    <AuthProvider>
      <div className="app-wrapper">
        <Navbar currentView={view} setView={setView} />
        <main>
          {view === 'rooms' && <RoomList />}
          {view === 'login' && <Login setView={setView} />}
          {view === 'register' && <Register setView={setView} />}
          {view === 'mybookings' && <MyBookings />}
          {view === 'admin' && <AdminDashboard />}
        </main>
      </div>
    </AuthProvider>
  );
}