import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    default: "" 
  },
  category: { 
    type: String, 
    required: true,
    uppercase: true,
    enum: [
          'AGBADA', 
          'SHIRTS', 
          'SUITS', 
          'CASUAL', 
          'DANSIKI', 
          'FEMALE', 
          'KAFTAN',
    ],
    
  },
  // Primary image for the shop grid
  image: { 
    type: String, 
    required: true 
  },
  // Gallery images for the product detail page
  gallery: { 
    type: [String], 
    default: [] 
  },
  // Available sizes
  sizes: { 
    type: [String], 
    default: ["S", "M", "L", "XL", "XXL"] 
  },
}, { timestamps: true });

// Check if the model exists before exporting to prevent Next.js HMR errors
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);