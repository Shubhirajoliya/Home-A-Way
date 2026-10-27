const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['Single', 'Double', 'Deluxe', 'Suite', 'Penthouse'] },
    pricePerNight: { type: Number, required: true, min: 0 },
    maxCapacity: { type: Number, required: true, min: 1 },
    description: { type: String, default: 'Modern air-conditioned room with high-speed Wi-Fi, smart TV, and 24/7 room service.' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80' },
    housekeepingStatus: { type: String, enum: ['Clean', 'Dirty', 'Maintenance'], default: 'Clean' },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);