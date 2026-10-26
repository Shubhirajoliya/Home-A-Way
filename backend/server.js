const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully to "hotelpro"'))
    .catch((err) => console.error('❌ MongoDB Connection Failure:', err));

// Route Mounts
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Health Endpoint
app.get('/', (req, res) => {
    res.json({ status: 'Active', message: 'HotelPro Hospitality API is fully operational.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 HotelPro Server running locally at http://localhost:${PORT}`);
});
