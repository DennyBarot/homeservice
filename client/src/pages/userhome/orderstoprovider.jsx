import React, { useState, useEffect } from 'react';
import Usernavbar from './usernavbar';
import { axiosInstance } from '../../components/utilities/axiosInstance.js';

const Ordertoprovider = () => {
  const [activeTab, setActiveTab] = useState('accepted');
  const [bookings, setBookings] = useState([]);

  const tabs = ['accepted', 'pending', 'completed', 'cancelled'];

  useEffect(() => {
    fetchBookings(activeTab);
  }, [activeTab]);

  const fetchBookings = async (status) => {
    try {
      const response = await axiosInstance.get(`/booking/user?status=${status}`);
      if (response.data.success) {
        let filteredBookings = response.data.bookings;
        if (status === 'cancelled') {
          filteredBookings = filteredBookings.filter(b => b.status === 'cancelled');
        }
        setBookings(filteredBookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmCancel) return;

    try {
      const response = await axiosInstance.put(`/booking/${bookingId}/status`, { status: 'cancelled' });
      if (response.data.success) {
        fetchBookings(activeTab);
      } else {
        alert('Failed to cancel booking');
      }
    } catch (error) {
      alert('Error cancelling booking');
    }
  };

  const confirmCompletion = async (booking) => {
    try {
      if (booking.providerConfirmed && !booking.userConfirmed) {
        const response = await axiosInstance.put(`/booking/${booking._id}/status`, { status: 'completed', userConfirmed: true });
        if (response.data.success) {
          fetchBookings(activeTab);
        } else {
          alert('Failed to confirm completion');
        }
      } else if (!booking.userConfirmed) {
        const response = await axiosInstance.put(`/booking/${booking._id}/status`, { userConfirmed: true });
        if (response.data.success) {
          fetchBookings(activeTab);
        } else {
          alert('Failed to confirm completion');
        }
      }
    } catch (error) {
      alert('Error confirming completion');
    }
  };

  const renderCard = (booking) => {
    const isCompletionConfirmed = booking.userConfirmed || booking.providerConfirmed;
    const bothConfirmed = booking.userConfirmed && booking.providerConfirmed;

    return (
      <div key={booking._id} className="bg-white/10 rounded-xl shadow-lg p-4 space-y-4 backdrop-blur-md border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={booking.provider?.profileImage ? booking.provider.profileImage : 'https://randomuser.me/api/portraits/lego/1.jpg'}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover shadow-md border border-white/30"
            />
            <div>
              <h3 className="font-bold text-lg text-white">{booking.serviceName}</h3>
              <p className="text-sm text-gray-300">{booking.provider?.name || 'Provider'}</p>
            </div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full ${
            booking.status === 'completed' ? 'bg-green-900 text-green-400' :
            booking.status === 'cancelled' ? 'bg-red-900 text-red-400' :
            booking.status === 'pending' ? 'bg-yellow-900 text-yellow-400' :
            'bg-purple-900 text-purple-400'
          }`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>

        <div className="text-sm text-gray-300 space-y-1">
          <p><strong>Date & Time:</strong> {new Date(booking.date).toLocaleDateString()} | {booking.timeSlot}</p>
          <p><strong>Address:</strong> {booking.address}</p>
        </div>

        {booking.status === 'pending' && activeTab === 'pending' && (
          <button
            onClick={() => cancelBooking(booking._id)}
            className="w-full mt-2 bg-gradient-to-r from-red-700 via-red-800 to-red-600 text-white py-2 rounded-xl font-semibold hover:from-red-800 hover:via-red-900 hover:to-red-700 transition"
          >
            Cancel Booking
          </button>
        )}

        {booking.status === 'accepted' && activeTab === 'accepted' && (
          <button
            onClick={() => confirmCompletion(booking)}
            className={`w-full mt-2 py-2 rounded-xl font-semibold transition ${
              isCompletionConfirmed ? 'bg-green-700 text-green-300' : 'bg-gradient-to-r from-purple-700 via-blue-700 to-purple-600 text-white hover:from-purple-800 hover:via-blue-800 hover:to-purple-700'
            }`}
            disabled={bothConfirmed}
          >
            {bothConfirmed ? 'Completion Confirmed' : 'Confirm Completion'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      <Usernavbar />
      <div className="min-h-screen px-4 py-6 md:px-10">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex justify-around bg-white/20 rounded-full p-1 mb-6 shadow-sm overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                  activeTab === tab ? 'bg-purple-700 text-white' : 'text-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {bookings.length === 0 ? (
            <p className="text-center text-gray-300">No {activeTab} bookings found.</p>
          ) : (
            bookings.map((booking) => renderCard(booking))
          )}
        </div>
      </div>
    </div>
  );
};

export default Ordertoprovider;
