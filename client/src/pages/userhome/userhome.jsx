import React from 'react';

import Usernavbar from './usernavbar';

const Userhome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      <Usernavbar />
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
          {/* Text Section */}
          <div className="flex flex-col justify-center p-10 text-white">
            <h1 className="text-4xl font-extrabold drop-shadow-lg">
              Welcome to Home Service <br />
              <span className="text-purple-300">Find your service today?</span>
            </h1>
            <p className="mt-6 text-purple-200 drop-shadow-md">
              Welcome to our home service app, where we connect you with the best service providers in your area. Whether you need a plumber, electrician, or cleaner, we've got you covered. Our platform makes it easy to find and book reliable services at your convenience. Explore our range of services and experience hassle-free home maintenance today!
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="px-6 py-3 bg-gradient-to-r from-purple-700 via-blue-700 to-purple-600 text-white rounded-lg shadow hover:from-purple-800 hover:via-blue-800 hover:to-purple-700 transition"
              >
                Choose
              </a>
              <a
                href="#"
                className="px-6 py-3 border border-purple-400 text-purple-300 rounded-lg hover:bg-white/20 transition"
              >
                Your Service
              </a>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative">
            <img
              src="https://smarther.co/wp-content/uploads/2021/07/home-service-app-enterprises-blog.png"
              alt="Hero"
              className="w-full h-full object-cover rounded-r-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userhome;
