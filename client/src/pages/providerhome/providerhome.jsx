import React from 'react'
import Providernavbar from './providernavbar.jsx'
const Providerhome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      <Providernavbar />
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
          {/* Text Section */}
          <div className="flex flex-col justify-center p-10 text-white">
            <h1 className="text-4xl font-extrabold drop-shadow-lg">
            Reliable Home Services <br />
              <span className="text-purple-300"> Anytime, Anywhere!</span>
            </h1>
            <p className="mt-6 text-purple-200 drop-shadow-md">
            Welcome to Home Service App, your trusted partner in home services. Whether you need expert cleaning, plumbing, electrical repairs, or personalized care, we connect you with skilled professionals who ensure quality and reliability. With seamless booking, real-time chat, and verified service providers, your home needs are met with ease and efficiency. Experience hassle-free service today!

            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="px-6 py-3 bg-gradient-to-r from-purple-700 via-blue-700 to-purple-600 text-white rounded-lg shadow hover:from-purple-800 hover:via-blue-800 hover:to-purple-700 transition"
              >
                Get Started
              </a>
              <a
                href="#"
                className="px-6 py-3 border border-purple-400 text-purple-300 rounded-lg hover:bg-white/20 transition"
              >
                Your Service
              </a>
            </div>
          </div>
        
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
  )
}

export default Providerhome;
