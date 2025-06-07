import React, { useEffect, useState } from 'react';
import Usernavbar from './usernavbar';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Categories as per signup page values
    const categories = [
      { value: 'carpenter', label: 'Carpenter' },
      { value: 'painter', label: 'Painter' },
      { value: 'gardener', label: 'Gardener' },
      { value: 'plumber', label: 'Plumber' },
      { value: 'electric', label: 'Electric' },
      { value: 'cleaning', label: 'Cleaning' },
      { value: 'cooking', label: 'Cooking' },
      { value: 'other', label: 'Other' },
    ];
    setServices(categories);
  }, []);

  const handleServiceClick = (categoryValue) => {
    // Navigate to providers list page with category param
    navigate(`/providers/${categoryValue}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      <Usernavbar />
      <div className="max-w-6xl mx-auto p-6 mt-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.value}
              className="cursor-pointer bg-white/10 border border-white/30 rounded-lg p-6 shadow-md text-white font-semibold text-center transition hover:shadow-lg hover:bg-gradient-to-r hover:from-purple-700 hover:via-blue-700 hover:to-purple-600"
              onClick={() => handleServiceClick(service.value)}
            >
              <h2 className="text-xl">{service.label}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
