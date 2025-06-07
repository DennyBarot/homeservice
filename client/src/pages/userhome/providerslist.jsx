import React, { useState, useEffect } from 'react';
import Usernavbar from './usernavbar';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../components/utilities/axiosInstance.js';

const ProvidersList = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [cityFilter, setCityFilter] = useState('');
  const [filteredProviders, setFilteredProviders] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        let url = `/providers/${category}`;
        if (cityFilter) {
          url += `?city=${cityFilter}`;
        }
        const response = await axiosInstance.get(url);
        setProviders(Array.isArray(response.data.providers) ? response.data.providers : []);
      } catch (error) {
        console.error('Error fetching providers:', error);
        setProviders([]);
      }
    };
    fetchProviders();
  }, [category, cityFilter]);

  useEffect(() => {
    setFilteredProviders(providers);
  }, [providers]);

  const handleCityChange = (e) => {
    setCityFilter(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      <Usernavbar />
      <div className="max-w-6xl mx-auto p-6 mt-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
        <h1 className="text-3xl font-bold mb-6 capitalize text-white drop-shadow-lg">{category} Providers</h1>
        <div className="mb-6">
          <label htmlFor="cityFilter" className="mr-2 font-semibold text-white drop-shadow-md">Filter by City:</label>
          <select
            id="cityFilter"
            value={cityFilter}
            onChange={handleCityChange}
            className="border border-white/40 bg-white/10 text-white rounded p-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          >
            <option value="">All Cities</option>
            <option value="ahmedabad">Ahmedabad</option>
            <option value="surat">Surat</option>
            <option value="vadodara">Vadodara</option>
            <option value="rajkot">Rajkot</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <div
                key={provider._id}
                className="cursor-pointer bg-white/10 border border-white/30 rounded-lg p-4 shadow-md text-white transition hover:shadow-lg hover:bg-gradient-to-r hover:from-purple-700 hover:via-blue-700 hover:to-purple-600"
                onClick={() => navigate(`/provider/${provider._id}`)}
              >
                <img
                  src={provider.profileImage ? `${import.meta.env.VITE_DB_URL.replace(/\/api$/, '')}${provider.profileImage.replace(/^\/api\//, '/')}` : '/default-profile.png'}
                  alt={provider.name}
                  className="w-48 h-48 object-cover rounded mb-4 shadow-md border border-white/30"
                />
                <h2 className="text-xl font-semibold cursor-pointer">{provider.name}</h2>
                <div className="text-yellow-400 font-semibold">
                  {provider.averageRating ? provider.averageRating.toFixed(1) : '0.0'} / 5 ({provider.totalRatings || 0})
                </div>
                <p className="text-gray-300">{provider.city}</p>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No providers found for this category and city.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProvidersList;
