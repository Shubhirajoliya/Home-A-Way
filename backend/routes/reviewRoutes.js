const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/authMiddleware');

// Get Reviews for a Room
router.get('/room/:roomId', async(req, res) => {
    try {
        const reviews = await Review.find({ room: req.params.roomId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit a Guest Review
router.post('/', protect, async(req, res) => {
    try {
        const { room, rating, comment } = req.body;
        const review = await Review.create({
            room,
            user: req.user.id,
            rating: Number(rating),
            comment
        });

        const populatedReview = await review.populate('user', 'name');
        res.status(201).json(populatedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;