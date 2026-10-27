const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get Logged-in User's Bookings
router.get('/mybookings', protect, async(req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('room')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Bookings (Admin)
router.get('/', protect, adminOnly, async(req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('room')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Booking with Atomic Check
router.post('/', protect, async(req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guestsCount, totalAmount } = req.body;

        const newBooking = await Booking.create({
            user: req.user.id,
            room,
            checkInDate,
            checkOutDate,
            guestsCount,
            totalAmount,
            paymentStatus: 'Paid',
            status: 'Confirmed'
        });

        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Cancel Reservation
router.put('/:id/cancel', protect, async(req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking reservation not found.' });

        // Ensure owner or admin is requesting cancellation
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to modify this reservation.' });
        }

        booking.status = 'Cancelled';
        booking.paymentStatus = 'Refunded';
        await booking.save();

        res.json({ message: 'Reservation cancelled successfully.', booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;