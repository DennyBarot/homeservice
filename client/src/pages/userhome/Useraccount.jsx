import React, { useState, useEffect } from "react";
import Usernavbar from './usernavbar';
import useUserStore from '../../store.js';

const UserAccount = () => {
  const { userProfile, getCurrentUser, updateUserProfile } = useUserStore();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userProfile) {
      getCurrentUser();
    } else {
      setFormData({
        name: userProfile.name || "",
        gender: userProfile.gender || "",
        age: userProfile.age || "",
        profileImage: userProfile.profileImage || "",
      });
    }
  }, [userProfile, getCurrentUser]);

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
      const data = new FormData();
      data.append('name', formData.name);
      data.append('gender', formData.gender);
      data.append('age', formData.age);
      if (formData.profileImageFile) {
        data.append('profileImage', formData.profileImageFile);
      }
      await updateUserProfile(data);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Error updating profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div>
        <Usernavbar />
        <div className="p-4">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      <Usernavbar />
      <div className="max-w-3xl mx-auto p-6 mt-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
        <h2 className="text-3xl font-extrabold mb-6 text-white drop-shadow-lg">My Account</h2>
        <form onSubmit={handledSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-white drop-shadow-md">Profile Image</label>
            <img
              src={
                profileImage
                  ? profileImage
                  : userProfile.profileImage
                  ? import.meta.env.VITE_DB_URL.replace(/\/api$/, '') + userProfile.profileImage
                  : "/default-profile.png"
              }
              alt="Profile image"
              className="w-32 h-32 object-cover rounded-full mb-3 shadow-lg border-4 border-white/30"
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
              className="bg-gradient-to-r from-purple-700 via-blue-700 to-purple-600 text-white px-5 py-2 rounded-full shadow-md hover:from-purple-800 hover:via-blue-800 hover:to-purple-700 transition-colors duration-300"
            >
              Upload
            </button>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-white drop-shadow-md" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg px-4 py-3 text-gray-100 bg-white/10 border border-white/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-white drop-shadow-md" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full rounded-lg px-4 py-3 text-gray-100 bg-white/10 border border-white/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            >
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-white drop-shadow-md" htmlFor="age">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min="0"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full rounded-lg px-4 py-3 text-gray-100 bg-white/10 border border-white/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              placeholder="Enter your age"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-white drop-shadow-md">City</label>
            <input
              type="text"
              value={userProfile.city || ""}
              readOnly
              className="w-full rounded-lg px-4 py-3 bg-white/10 text-gray-100 border border-white/20 shadow-inner"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-white drop-shadow-md">Role</label>
            <input
              type="text"
              value={userProfile.role || ""}
              readOnly
              className="w-full rounded-lg px-4 py-3 bg-white/10 text-gray-100 border border-white/20 shadow-inner"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-white drop-shadow-md">Email</label>
            <input
              type="email"
              value={userProfile.email || ""}
              readOnly
              className="w-full rounded-lg px-4 py-3 bg-white/10 text-gray-100 border border-white/20 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-700 via-blue-700 to-purple-600 text-white py-3 rounded-full shadow-lg hover:from-purple-800 hover:via-blue-800 hover:to-purple-700 transition-colors duration-300"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
          {message && (
            <p className={`mt-3 text-center ${message.includes("success") ? "text-green-400" : "text-red-400"} font-semibold`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserAccount;
