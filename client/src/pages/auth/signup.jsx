

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../../store.js';

const Signup = () => {
  const navigate = useNavigate();
  const registerUser = useUserStore((state) => state.registerUser);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const userProfile = useUserStore((state) => state.userProfile);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    city: '',
    role: 'user',
    category: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    if (dataToSend.role !== 'provider') {
      dataToSend.category = null;
    }
    await registerUser(dataToSend);
  };

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      if (userProfile.role === 'provider') {
        navigate('/providerhome');
      } else {
        navigate('/userhome');
      }
    }
  }, [isAuthenticated, userProfile, navigate]);

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-green-400">
      <form
        className="w-80 h-auto mx-auto rounded-lg bg-gradient-to-r from-green-400 to-green-600 bg-opacity-30 backdrop-blur-md shadow-lg p-6"
        onSubmit={handleSignup}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Sign up</h2>

        <input
          className="bg-white bg-opacity-70 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
          placeholder="Name"
          type="text"
          name="name"
          onChange={handleChange}
          required
        />
        <input
          className="bg-white bg-opacity-70 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
          placeholder="name@gmail.com"
          name="email"
          onChange={handleChange}
          required
        />
        <input
          className="bg-white bg-opacity-70 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Select city
        </label>
        <select
          id="city"
          name="city"
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select city</option>
          <option value="ahmedabad">Ahmedabad</option>
          <option value="surat">Surat</option>
          <option value="rajkot">Rajkot</option>
          <option value="vadodara">Vadodara</option>
        </select>

        <select
          id="role"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
          name="role"
          onChange={handleRoleChange}
        >
          <option value="">Select role</option>
          <option value="user">User</option>
          <option value="provider">Provider</option>
        </select>

        {formData.role === 'provider' && (
          <select
            id="category"
            name="category"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Select category</option>
            <option value="carpenter">Carpenter</option>
            <option value="painter">Painter</option>
            <option value="gardener">Gardener</option>
            <option value="plumber">Plumber</option>
            <option value="electric">Electric</option>
            <option value="cleaning">Cleaning</option>
            <option value="cooking">Cooking</option>
            <option value="other">Other</option>
          </select>
        )}
        <p className="text-center mb-4">Don't have an account?<Link to="/login" className="text-blue-700 hover:underline">Login</Link></p>
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;