import Booking from '../models/Booking.js';

// Create a new booking
export const  createBooking = async (req, res) => {
  try {
    const { providerId, serviceName, date, timeSlot, address } = req.body;
    const userId = req.user._id;

    const booking = new Booking({
      user: userId,
      provider: providerId,
      serviceName,
      date,
      timeSlot,
      address,
      status: 'pending',
    });

    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get bookings for provider 
export const getBookingsByProvider = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { status } = req.query;

    const filter = { provider: providerId };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .sort({ date: 1, timeSlot: 1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings for provider:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get bookings for user with optional status filter
export const getBookingsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('provider', 'name email')
      .sort({ date: 1, timeSlot: 1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings for user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update booking status and confirmations
export const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status, userConfirmed, providerConfirmed } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (status) booking.status = status;
    if (typeof userConfirmed === 'boolean') booking.userConfirmed = userConfirmed;
    if (typeof providerConfirmed === 'boolean') booking.providerConfirmed = providerConfirmed;

    // If both confirmed, mark as completed
    if (booking.userConfirmed && booking.providerConfirmed) {
      booking.status = 'completed';
    }

    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
