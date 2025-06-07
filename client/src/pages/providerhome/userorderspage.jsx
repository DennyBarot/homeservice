import React, { useState, useEffect } from 'react';
import Providernavbar from './providernavbar';
import { axiosInstance } from '../../components/utilities/axiosInstance.js';

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [bookings, setBookings] = useState([]);

  const tabs = ['pending', 'accepted', 'completed', 'cancelled'];

  useEffect(() => {
    fetchBookings(activeTab);
  }, [activeTab]);

  const fetchBookings = async (status) => {
    try {
      const response = await axiosInstance.get(`/booking/provider?status=${status}`);
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };

  const updateBookingStatus = async (bookingId, statusUpdate) => {
    try {
      const response = await axiosInstance.put(`/booking/${bookingId}/status`, statusUpdate);
      if (response.data.success) {
        fetchBookings(activeTab);
      } else {
        alert('Failed to update booking status');
      }
    } catch (error) {
      alert('Error updating booking status');
    }
  };

  const handleAccept = (bookingId) => {
    updateBookingStatus(bookingId, { status: 'accepted', providerConfirmed: true });
  };

  const handleCancel = (bookingId) => {
    updateBookingStatus(bookingId, { status: 'cancelled' });
  };

  const handlePending = (bookingId) => {
    updateBookingStatus(bookingId, { status: 'pending' });
  };

  const renderCard = (booking) => (
    <div key={booking._id} className="bg-white/10 rounded-xl shadow-lg p-4 space-y-4 backdrop-blur-md border border-white/20">
      {/* Top Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={booking.user?.profileImage ? booking.user.profileImage : 'https://randomuser.me/api/portraits/lego/1.jpg'}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover shadow-md border border-white/30"
          />
          <div>
            <h3 className="font-bold text-lg text-white">{booking.serviceName}</h3>
            <p className="text-sm text-gray-300">{booking.user?.name || 'User'}</p>
          </div>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full ${
          booking.status === 'completed' ? 'bg-green-900 text-green-400' :
          booking.status === 'cancelled' ? 'bg-red-900 text-red-400' :
          booking.status === 'accepted' ? 'bg-blue-900 text-blue-400' :
          'bg-yellow-900 text-yellow-400'
        }`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      {/* Date, Time & Address */}
      <div className="text-sm text-gray-300 space-y-1">
        <p><strong>Date & Time:</strong> {new Date(booking.date).toLocaleDateString()} | {booking.timeSlot}</p>
        <p><strong>Address:</strong> {booking.address}</p>
      </div>

      {/* Action Buttons for pending status */}
      {booking.status === 'pending' && activeTab === 'pending' && (
        <div className="flex space-x-2">
          <button
            onClick={() => handleAccept(booking._id)}
            className="flex-1 bg-gradient-to-r from-purple-700 via-blue-700 to-purple-600 text-white py-2 rounded shadow-md hover:from-purple-800 hover:via-blue-800 hover:to-purple-700 transition-colors duration-300"
          >
            Accept
          </button>
          <button
            onClick={() => handleCancel(booking._id)}
            className="flex-1 bg-gradient-to-r from-red-700 via-red-800 to-red-600 text-white py-2 rounded shadow-md hover:from-red-800 hover:via-red-900 hover:to-red-700 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={() => handlePending(booking._id)}
            className="flex-1 bg-gradient-to-r from-yellow-700 via-yellow-800 to-yellow-600 text-white py-2 rounded shadow-md hover:from-yellow-800 hover:via-yellow-900 hover:to-yellow-700 transition-colors duration-300"
          >
            Pending
          </button>
        </div>
      )}

      {/* For accepted bookings, show option to mark complete */}
      {booking.status === 'accepted' && activeTab === 'accepted' && (
        <button
          onClick={() => updateBookingStatus(booking._id, { providerConfirmed: true })}
          className="w-full bg-gradient-to-r from-purple-700 via-blue-700 to-purple-600 text-white py-2 rounded shadow-lg hover:from-purple-800 hover:via-blue-800 hover:to-purple-700 transition-colors duration-300"
        >
          Confirm Completion
        </button>
      )}

      {/* For completed bookings, show a completed label */}
      {booking.status === 'completed' && (
        <div className="text-green-400 font-semibold">Completed</div>
      )}

      {/* For cancelled bookings, show a cancelled label */}
      {booking.status === 'cancelled' && (
        <div className="text-red-400 font-semibold">Cancelled</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      <Providernavbar />
      <div className="min-h-screen px-4 py-6 md:px-10">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          {/* Tab Navigation */}
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

          {/* Tab Content */}
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

export default OrdersPage;
