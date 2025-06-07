import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../components/utilities/axiosInstance.js';
import Usernavbar from './usernavbar';
import useUserStore from '../../store.js';
import toast from 'react-hot-toast';

const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userProfile = useUserStore((state) => state.userProfile);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const [rating, setRating] = React.useState('');
  const [showRatingModal, setShowRatingModal] = React.useState(false);
  const [userRating, setUserRating] = React.useState(null);

  // Booking modal state and form fields
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingAddress, setBookingAddress] = useState('');

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await axiosInstance.get(`/provider/${id}`);
        if (response.data.success) {
          setProvider(response.data.provider);
          // Find if current user has rated
          if (isAuthenticated && response.data.provider.ratings) {
            const currentUserRating = response.data.provider.ratings.find(r => r.userId === userProfile._id);
            if (currentUserRating) {
              setUserRating(currentUserRating.rating);
            } else {
              setUserRating(null);
            }
          }
        } else {
          setError('Provider not found');
        }
      } catch (err) {
        setError('Error fetching provider details');
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id, isAuthenticated, userProfile]);

  const handleSubmitRating = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to submit a rating');
      return;
    }
    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please select a valid rating');
      return;
    }
    try {
      const response = await axiosInstance.post(`/provider/${id}/rate`, { rating: Number(rating) });
      if (response.data.success) {
        toast.success('Rating submitted successfully');
        // Update provider rating info
        setProvider(prev => ({
          ...prev,
          averageRating: response.data.averageRating,
          totalRatings: response.data.totalRatings,
          ratings: prev.ratings ? prev.ratings.filter(r => r.userId !== userProfile._id).concat({ userId: userProfile._id, rating: Number(rating) }) : [{ userId: userProfile._id, rating: Number(rating) }],
        }));
        setUserRating(Number(rating));
        setRating('');
        setShowRatingModal(false);
      } else {
        toast.error('Failed to submit rating');
      }
    } catch (error) {
      toast.error('Error submitting rating');
    }
  };

  const handleChatClick = async () => {
    if (!isAuthenticated || !userProfile) {
      toast.error('Please login to start chat');
      return;
    }
    try {
      const response = await axiosInstance.post(`/send/${provider._id}`, {
        message: 'Hi',
        timestamp: new Date().toISOString(),
      });
      if (response.data.success) {
        toast.success(' Please check your chat page to message with this provider.');
      } else {
        toast.error('Failed to start chat');
      }
    } catch (error) {
      toast.error('Error starting chat');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !bookingAddress) {
      alert('Please fill all booking details');
      return;
    }
    try {
      const response = await axiosInstance.post('/booking', {
        providerId: provider._id,
        serviceName: provider.category || 'Service',
        date: bookingDate,
        timeSlot: bookingTime,
        address: bookingAddress,
      });
      if (response.data.success) {
        alert('Booking request sent successfully');
        setShowBookingModal(false);
        setBookingDate('');
        setBookingTime('');
        setBookingAddress('');
      } else {
        alert('Failed to send booking request');
      }
    } catch (error) {
      alert('Error sending booking request');
    }
  };

  if (loading) {
    return (
      <div>
        <Usernavbar />
        <div className="p-4">Loading provider details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Usernavbar />
        <div className="p-4 text-red-600">{error}</div>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-700 via-blue-700 to-purple-600 text-white rounded shadow hover:from-purple-800 hover:via-blue-800 hover:to-purple-700 transition">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      <Usernavbar />
      <div className="max-w-4xl mx-auto p-8 mt-10 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/30">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-700 via-blue-700 to-purple-600 text-white rounded-lg shadow-lg hover:from-purple-800 hover:via-blue-800 hover:to-purple-700 transition"
        >
           back
        </button>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
          <img
            src={provider.profileImage ? `${import.meta.env.VITE_DB_URL.replace(/\/api$/, '')}${provider.profileImage.replace(/^\/api\//, '/')}` : '/default-profile.png'}
            alt={provider.name}
            className="w-56 h-56 object-cover rounded-xl shadow-lg border border-white/40"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-extrabold mb-4 text-white drop-shadow-xl">{provider.name}</h2>
            <p className="text-gray-300 mb-2"><strong>Category:</strong> {provider.category}</p>
            <p className="text-gray-300 mb-2"><strong>City:</strong> {provider.city}</p>
            {provider.description && <p className="text-gray-300 mb-2"><strong>Description:</strong> {provider.description}</p>}
            {provider.phoneNumber && <p className="text-gray-300 mb-2"><strong>Phone:</strong> {provider.phoneNumber}</p>}
            {provider.gender && <p className="text-gray-300 mb-2"><strong>Gender:</strong> {provider.gender}</p>}

            <div className="mt-8 flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0 justify-center md:justify-start">
              <div className="flex space-x-6">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="bg-gradient-to-r from-purple-700 via-blue-700 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-purple-800 hover:via-blue-800 hover:to-purple-700 transition"
                >
                  Book
                </button>
                <button
                  onClick={handleChatClick}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 transition"
                >
                  Chat
                </button>
                {!userRating ? (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition"
                  >
                    Rate
                  </button>
                ) : (
                  <div className="text-yellow-400 font-semibold flex items-center">
                    Your rating: {userRating} / 5
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-center md:text-left">
                <div className="text-yellow-400 text-xl font-semibold">
                  Average Rating: {provider.averageRating ? provider.averageRating.toFixed(1) : '0.0'} / 5
                </div>
                <div className="text-white text-sm">
                  ({provider.totalRatings || 0} {provider.totalRatings === 1 ? 'rating' : 'ratings'})
                </div>
              </div>

              {showRatingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Rate this provider</h3>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full rounded border border-gray-300 px-3 py-2 mb-4"
                    >
                      <option value="">Select rating</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowRatingModal(false)}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitRating}
                        disabled={rating === null || rating === ''}
                        className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 w-96 shadow-lg border border-white/20">
            <h3 className="text-xl font-semibold mb-4 text-white drop-shadow-md">Book Service</h3>
            <form onSubmit={handleBookingSubmit}>
              <label className="block mb-3 text-white drop-shadow-md">
                Date:
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="w-full border border-white/30 rounded px-3 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </label>
              <label className="block mb-3 text-white drop-shadow-md">
                Time Slot:
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  required
                  className="w-full border border-white/30 rounded px-3 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                >
                  <option value="">Select a time slot</option>
                  <option value="09:00 - 11:00">09:00 - 11:00</option>
                  <option value="11:00 - 13:00">11:00 - 13:00</option>
                  <option value="13:00 - 15:00">13:00 - 15:00</option>
                  <option value="15:00 - 17:00">15:00 - 17:00</option>
                </select>
              </label>
              <label className="block mb-3 text-white drop-shadow-md">
                Address:
                <input
                  type="text"
                  value={bookingAddress}
                  onChange={(e) => setBookingAddress(e.target.value)}
                  required
                  className="w-full border border-white/30 rounded px-3 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  placeholder="Enter your address"
                />
              </label>
              <div className="flex justify-end space-x-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-5 py-2 rounded bg-white/30 text-white hover:bg-white/40 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-gradient-to-r from-purple-700 via-blue-700 to-purple-600 text-white hover:from-purple-800 hover:via-blue-800 hover:to-purple-700 transition"
                >
                  Book Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDetails;
