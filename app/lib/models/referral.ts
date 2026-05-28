import mongoose from 'mongoose';


const PartnerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false // Optional: Only if partners have standard user accounts
  },
  code: { 
    type: String, 
    required: [true, "Referral code is required"], 
    unique: true, 
    lowercase: true,
    trim: true 
  }, // e.g., "partnername"
  name: { type: String, required: true },
  commissionRate: { type: Number, default: 0 }
}, { timestamps: true });

// The Event Schema (Logs every click, form submission, and purchase)
const ReferralEventSchema = new mongoose.Schema({
  partnerCode: { type: String, required: true, index: true },
  eventType: { 
    type: String, 
    enum: ['visit', 'inquiry', 'booking'], 
    required: true 
  },
  revenue: { type: Number, default: 0 }, // 0 for visits/inquiries, total amount for bookings
  referenceId: { type: String }, // e.g., the Booking ID or Inquiry ID for cross-referencing
  ipAddress: { type: String } // Useful for filtering out duplicate clicks
}, { timestamps: true });

export const Partner = mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
export const ReferralEvent = mongoose.models.ReferralEvent || mongoose.model('ReferralEvent', ReferralEventSchema);