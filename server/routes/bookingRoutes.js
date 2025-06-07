import express from 'express';
const router = express.Router();
import { createBooking, getBookingsByProvider, getBookingsByUser, updateBookingStatus } from '../controllers/bookingController.js';
import authenticate from '../middleware/authenticate.js';

// Create a new booking
router.post('/', authenticate, createBooking);

// Get bookings for provider
router.get('/provider', authenticate, getBookingsByProvider);

// Get bookings for user
router.get('/user', authenticate, getBookingsByUser);

// Update booking status
router.put('/:id/status', authenticate, updateBookingStatus);

export default router;
