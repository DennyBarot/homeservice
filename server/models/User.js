import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  password: { type: String, required: true },
  city: { type: String },
  role: { type: String, enum: ['user', 'provider'], default: 'user' },
  category: { type: String },
  age: { type: Number, min: 0 },
  gender: { type: String, enum: ['female', 'male', 'other', 'prefer_not_say'] },
  description: { type: String },
  phoneNumber: { type: String, unique: true, sparse: true },
  profileImage: { type: String },

  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },

  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true, min: 1, max: 5 },
    }
  ],
},{timeStamps:true});


const User = mongoose.model('User', userSchema);
export default User;