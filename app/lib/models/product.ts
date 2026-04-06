import mongoose from 'mongoose';


const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: { type: String, enum: ['AGBADA', 'KAFTANS', 'SHIRTS', 'SUITS'] },
  images: [String],
  sizes: [String], // ["S", "M", "L", "XL", "XXL"]
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);