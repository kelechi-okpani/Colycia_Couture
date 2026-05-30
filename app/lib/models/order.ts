import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        image: String,
      },
    ],

    shippingDetails: {
      firstName: String,
      lastName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      country: { type: String, default: 'Nigeria' },
      zipCode: String,
      deliveryMethod: {
        type: String,
        enum: ['Standard', 'Express', 'Pickup'],
        default: 'Standard',
      },
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },

    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },

    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // -----------------------------
    // 🔥 REFERRAL TRACKING (NEW)
    // -----------------------------
    referral: {
      partnerCode: {
        type: String,
        index: true,
        default: null,
      },
      visitorId: {
        type: String,
        default: null,
      },
    },

    // -----------------------------
    // 💰 COMMISSION TRACKING
    // -----------------------------
    commission: {
      rate: { type: Number, default: 0 },
      amount: { type: Number, default: 0 },
      paid: { type: Boolean, default: false },
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model('Order', OrderSchema);

  

// import mongoose from 'mongoose';

// const OrderSchema = new mongoose.Schema({
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User',
//     required: true 
//   },
//   items: [{
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//     name: { type: String, required: true }, // Snapshot of name at time of purchase
//     price: { type: Number, required: true }, // Snapshot of price at time of purchase
//     quantity: { type: Number, required: true },
//     size: { type: String, required: true },
//     image: { type: String }
//   }],
//   shippingDetails: {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     phone: { type: String, required: true },
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     state: { type: String, required: true }, // Added State for Nigerian shipping
//     country: { type: String, default: 'Nigeria' },
//     zipCode: String,
//     deliveryMethod: { type: String, enum: ['Standard', 'Express', 'Pickup'], default: 'Standard' }
//   },
//   totalAmount: { 
//     type: Number, 
//     required: true 
//   },
//   paymentStatus: { 
//     type: String, 
//     enum: ['pending', 'paid', 'failed', 'refunded'], 
//     default: 'pending' 
//   },
//   orderStatus: {
//     type: String,
//     enum: ['processing', 'shipped', 'delivered', 'cancelled'],
//     default: 'processing'
//   },
//   stripeSessionId: { 
//     type: String, 
//     unique: true, 
//     sparse: true // Allows nulls while keeping unique constraint for existing IDs
//   },
// }, { timestamps: true });

// export default mongoose.models.Order || mongoose.model('Order', OrderSchema);