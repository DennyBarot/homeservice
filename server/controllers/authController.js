import User from '../models/User.js'; 
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcryptjs';

const register = async (req, res, next) => {
  const { name, email, password, city, role, category } = req.body;
  if (!name || !email || !password || !role  ) {
    return res.status(400).json({ errMessage: "All fields are required." });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ errMessage: "User already exists" });
  }
  const profileImage = null;
  // Remove explicit hashing here to avoid double hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ 
    name, 
    email,
    password: hashedPassword, 
    city,
    role,
    category,
    profileImage,
  });

  const tokenData = {
    _id: newUser?._id
  };

  const token = jwt.sign({ _id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res
  .status(200)
  .cookie('token', token, {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
  })
  .json({
    success: true,
    responseData: {
      newUser,
      token,
    },
  });
};



const login = async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return next(400, "Email and password are required.");
  }

  const user = await User.findOne({ email });
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return next(400, "enter valid email or password");
  }

  const tokenData = {
    _id: user?._id,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES, 
  });

  try {
    res.status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
    })
    .json({
      success: true,
      responseData: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Cookie setting error:", error); // Logging the error
    return res.status(500).json({ errMessage: "Error setting cookie. Please check your server setup." });
  }
};

import fs from 'fs';
import path from 'path';

const updateProfile = async (req, res, next) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    const userId = req.user._id;
    const { name, description, phoneNumber, gender, age } = req.body;
    let profileImage;

    if (req.file) {
      profileImage = `/uploads/${req.file.filename}`;
    }

    const updateData = {
      name,
      description,
      gender,
      age,
    };

    if (phoneNumber && phoneNumber.trim() !== '') {
      updateData.phoneNumber = phoneNumber;
    }

    if (profileImage) {
      updateData.profileImage = profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    next(error);
  }
};

const logout = async (req, res, next) => {
  res.status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout successful!",
    });
};

const getProvidersByCategory = async (req, res, next) => {
  const { category } = req.params;
  const { city } = req.query;
  try {
    let query = { role: 'provider' };
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (city) {
      const cityNormalized = city.trim().toLowerCase();
      query.city = { $regex: new RegExp(`^${cityNormalized}$`, 'i') };
    }
    console.log('Query for providers:', query);
    const providers = await User.find(query).select('-password');
    console.log('Providers found:', providers.length);
    if (!providers || providers.length === 0) {
      return res.status(404).json({ message: 'No providers found for this category and city' });
    }
    // Include averageRating and totalRatings in response
    const providersWithRatings = providers.map(provider => ({
      ...provider.toObject(),
      averageRating: provider.averageRating || 0,
      totalRatings: provider.totalRatings || 0,
    }));
    res.json({ success: true, providers: providersWithRatings });
  } catch (error) {
    console.error('Error fetching providers by category and city:', error);
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id; // req.user set by authenticate middleware
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userObj = user.toObject();
    if (userObj.age === undefined) {
      userObj.age = null;
    }
    
    res.json({ user: userObj });
  } catch (error) {
    console.error('Error fetching current user:', error);
    console.error(error.stack);
    next(error);
  }
};

const getAllProviders = async (req, res, next) => {
  try {
    const providers = await User.find({ role: 'provider' }).select('-password');
    res.json({ success: true, providers });
  } catch (error) {
    console.error('Error fetching all providers:', error);
    next(error);
  }
};

import mongoose from 'mongoose';

const getProviderById = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid provider ID' });
  }
  try {
    const provider = await User.findOne({ _id: id, role: 'provider' }).select('-password');
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    // Include averageRating and totalRatings in response
    const providerObj = provider.toObject();
    providerObj.averageRating = provider.averageRating || 0;
    providerObj.totalRatings = provider.totalRatings || 0;
    res.json({ success: true, provider: providerObj });
  } catch (error) {
    console.error('Error fetching provider by ID:', error);
    next(error);
  }
};



const rateProvider = async (req, res, next) => {
  const { id } = req.params;
  const { rating } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid provider ID' });
  }

  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
  }

  try {
    const provider = await User.findOne({ _id: id, role: 'provider' });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Check if user has already rated
    const existingRatingIndex = provider.ratings.findIndex(r => r.userId.toString() === userId.toString());

    if (existingRatingIndex !== -1) {
      // Update existing rating
      provider.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      provider.ratings.push({ userId, rating });
    }

    // Recalculate averageRating and totalRatings
    const totalRatings = provider.ratings.length;
    const sumRatings = provider.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumRatings / totalRatings;

    provider.averageRating = averageRating;
    provider.totalRatings = totalRatings;

    await provider.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      averageRating,
      totalRatings,
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    next(error);
  }
};

export { register, login, updateProfile, logout, getCurrentUser, getProvidersByCategory, getAllProviders, getProviderById, rateProvider };
