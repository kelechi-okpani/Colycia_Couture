import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, "First name is required"],
    trim: true 
  },
  lastName: { 
    type: String, 
    required: [true, "Last name is required"],
    trim: true 
  },  
  
phone: {
  type: String,
  required: [true, "Phone number is required"],
  trim: true,
      minlength: [11, "Phone number must be at least 11 digits"],
    maxlength: [15, "Phone number is too long"],
},

  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false // Automatically hides password from API responses for security
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  cart: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product',
      required: true
    },
    quantity: { 
      type: Number, 
      default: 1,
      min: [1, "Quantity cannot be less than 1"]
    },
    size: {
      type: String,
      required: true // Required for clothing inventory logic
    }
  }],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// Prevent model overwrite error during Next.js Hot Module Replacement
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;