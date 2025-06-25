import React, { useState, useEffect } from "react";
import Providernavbar from "./providernavbar";
// import axios from "axios";
import { axiosInstance } from "../../components/utilities/axiosInstance";
import { getTokenFromCookie } from "../../components/utilities/getTokenFromCookie";
// import useUserStore from "../../store.js";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phoneNumber: "",
    gender: "",
    age: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getTokenFromCookie();
        const res = await axiosInstance.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = res.data.user;
        setUser(userData);
        setFormData({
          name: userData.name || "",
          description: userData.description || "",
          phoneNumber: userData.phoneNumber || "",
          gender: userData.gender || "",
          age: userData.age || "",
          profileImage: userData.profileImage || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        profileImageFile: file,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handledSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("age", formData.age);
      if (formData.profileImageFile) {
        formDataToSend.append("profileImage", formData.profileImageFile);
      }

      const token = getTokenFromCookie();
      const response = await axiosInstance.put("/user-profile", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUser(response.data.user);
        setMessage("Profile updated successfully!");
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      setMessage("Error updating profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div>
        <Providernavbar />
        <div className="p-4 text-center text-white">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      <Providernavbar />
      <div className="max-w-4xl mx-auto p-8 mt-10 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20">
        <h2 className="text-4xl font-bold mb-8 text-center text-white drop-shadow-xl">My Account</h2>
        <form onSubmit={handledSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Image Section */}
          <div className="md:col-span-2 flex flex-col items-center mb-6">
            <label className="block text-lg font-semibold mb-3 text-white drop-shadow-md">Profile Image</label>
            <img
              src={
                profileImage
                  ? profileImage
                  : user.profileImage
                  ? import.meta.env.VITE_DB_URL.replace(/\/api$/, '') + user.profileImage
                  : "/default-profile.png"
              }
              alt="Profile image"
              className="w-40 h-40 object-cover rounded-full mb-4 shadow-xl border-4 border-purple-400"
              crossOrigin="anonymous"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="profileImageInput"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => document.getElementById('profileImageInput').click()}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Upload New Image
            </button>
          </div>

          {/* Form Fields */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1 text-white drop-shadow-sm" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-md px-4 py-2 text-gray-900 bg-white/80 border border-white/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1 text-white drop-shadow-sm" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full rounded-md px-4 py-2 text-gray-900 bg-white/80 border border-white/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-white drop-shadow-sm" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-md px-4 py-2 text-gray-900 bg-white/80 border border-white/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1 text-white drop-shadow-sm" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full rounded-md px-4 py-2 text-gray-900 bg-white/80 border border-white/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            >
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not_say">Prefer not to say</option>
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1 text-white drop-shadow-sm" htmlFor="age">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min="0"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full rounded-md px-4 py-2 text-gray-900 bg-white/80 border border-white/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="Enter your age"
            />
          </div>

          {/* Read-only Fields */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1 text-white drop-shadow-sm">City</label>
            <input
              type="text"
              value={user.city || ""}
              readOnly
              className="w-full rounded-md px-4 py-2 bg-white/50 text-gray-800 border border-white/20 shadow-inner cursor-not-allowed"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1 text-white drop-shadow-sm">Role</label>
            <input
              type="text"
              value={user.role || ""}
              readOnly
              className="w-full rounded-md px-4 py-2 bg-white/50 text-gray-800 border border-white/20 shadow-inner cursor-not-allowed"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1 text-white drop-shadow-sm">Category</label>
            <input
              type="text"
              value={user.category || ""}
              readOnly
              className="w-full rounded-md px-4 py-2 bg-white/50 text-gray-800 border border-white/20 shadow-inner cursor-not-allowed"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1 text-white drop-shadow-sm">Email</label>
            <input
              type="email"
              value={user.email || ""}
              readOnly
              className="w-full rounded-md px-4 py-2 bg-white/50 text-gray-800 border border-white/20 shadow-inner cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-800 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>

          {message && (
            <p className={`md:col-span-2 mt-4 text-center text-lg ${message.includes("success") ? "text-green-400" : "text-red-400"} font-semibold`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
