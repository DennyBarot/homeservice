import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceName: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g. "13:00 - 15:00"
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'cancelled', 'completed'],
    default: 'pending',
  },
  userConfirmed: { type: Boolean, default: false },
  providerConfirmed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
