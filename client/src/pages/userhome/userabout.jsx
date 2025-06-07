import React from 'react';
import Usernavbar from './usernavbar';

const UserAbout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      <Usernavbar />
      <div className="max-w-4xl mx-auto p-8 mt-10 bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30 text-white">
        <h1 className="text-4xl font-extrabold mb-6 drop-shadow-lg">About Us</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 drop-shadow-md">What You Can Do</h2>
          <p className="text-lg leading-relaxed drop-shadow-md">
            Our platform connects you with trusted home service providers in your area. You can browse through a wide range of services including plumbing, electrical work, cleaning, and more. Easily find providers that match your needs, view their profiles, and read reviews from other users.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3 drop-shadow-md">How It Works</h2>
          <p className="text-lg leading-relaxed drop-shadow-md mb-4">
            Simply create an account and log in to access personalized features. Search for the service you need, select a provider, and book an appointment at your convenience. You can communicate directly with providers through our integrated chat system to discuss details and confirm bookings. Manage your orders and messages all in one place for a seamless experience.
          </p>
          <p className="text-lg leading-relaxed drop-shadow-md">
            We strive to make home maintenance hassle-free by connecting you with reliable professionals quickly and easily.
          </p>
        </section>
      </div>
    </div>
  );
};

export default UserAbout;
