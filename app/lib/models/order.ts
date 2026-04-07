import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true }, // Snapshot of name at time of purchase
    price: { type: Number, required: true }, // Snapshot of price at time of purchase
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    image: { type: String }
  }],
  shippingDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true }, // Added State for Nigerian shipping
    country: { type: String, default: 'Nigeria' },
    zipCode: String,
    deliveryMethod: { type: String, enum: ['Standard', 'Express', 'Pickup'], default: 'Standard' }
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  stripeSessionId: { 
    type: String, 
    unique: true, 
    sparse: true // Allows nulls while keeping unique constraint for existing IDs
  },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);