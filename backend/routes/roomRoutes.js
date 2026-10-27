const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get All Rooms with optional Filters
router.get('/', async(req, res) => {
    try {
        const { type, maxPrice, status } = req.query;
        let query = {};

        if (type && type !== 'All') query.type = type;
        if (maxPrice) query.pricePerNight = { $lte: Number(maxPrice) };
        if (status) query.housekeepingStatus = status;

        const rooms = await Room.find(query).sort({ createdAt: -1 });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Room Details
router.get('/:id', async(req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ error: 'Room not found.' });
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Room (Admin)
router.post('/', protect, adminOnly, async(req, res) => {
    try {
        const newRoom = await Room.create(req.body);
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update Housekeeping Status (Admin/Staff)
router.patch('/:id/housekeeping', protect, adminOnly, async(req, res) => {
    try {
        const { housekeepingStatus } = req.body;
        const room = await Room.findByIdAndUpdate(
            req.params.id, { housekeepingStatus }, { new: true }
        );
        res.json(room);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete Room (Admin)
router.delete('/:id', protect, adminOnly, async(req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.json({ message: 'Room removed successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;