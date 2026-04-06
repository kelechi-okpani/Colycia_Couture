import mongoose from 'mongoose';


const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: Array,
  shippingDetails: {
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    city: String,
    country: String,
    zipCode: String,
    deliveryMethod: String
  },
  totalAmount: Number,
  paymentStatus: { type: String, default: 'pending' }, // 'pending', 'paid', 'failed'
  stripeSessionId: String,
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);