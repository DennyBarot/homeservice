

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../../store.js';

const Login = () => {
  const navigate = useNavigate();
  const loginUser = useUserStore((state) => state.loginUser);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const userProfile = useUserStore((state) => state.userProfile);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
   
    const trimmedData = {
      email: loginData.email.trim(),
      password: loginData.password.trim(),
    };
    await loginUser(trimmedData);
    
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


  

  return (
    <div className="flex justify-center items-center h-screen bg-green-500 ">
    <form className="w-80  mx-auto rounded-lg bg-gradient-to-r from-green-400 to-green-600 bg-opacity-30 backdrop-blur-md shadow-lg p-6" onSubmit={handleLogin}>
     <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login</h2>
     <div className="mb-5">
       <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
       <input
        onChange={handleInputChange}

         type="email"
         value={loginData.email}
          name="email"
         id="email"
         className="bg-white bg-opacity-70 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
         placeholder="name@gmail.com"
         required
       />
     </div>
     <div className="mb-5">
       <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Your password</label>
       <input  className="bg-white bg-opacity-70 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="password" name="password" placeholder="Password"  value={loginData.password}
          onChange={handleInputChange}  required />
     </div>
   

<p className="text-center mb-4">Don't have an account?<Link to="/signup" className="text-blue-700 hover:underline">Signup</Link></p>
     <button onClick={handleLogin} 
       type="submit"
       className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
     >
       Login
     </button>
   </form>
 </div>

  );
};

export default Login;