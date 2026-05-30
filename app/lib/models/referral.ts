import mongoose from "mongoose";

/* -----------------------------
   PARTNER SCHEMA
------------------------------ */
const PartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    commissionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

/* -----------------------------
   REFERRAL EVENT SCHEMA
------------------------------ */
const ReferralEventSchema = new mongoose.Schema(
  {
    partnerCode: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    visitorId: {
      type: String,
      required: true,
      index: true,
    },

    eventType: {
      type: String,
      enum: [
        "visit",
        "product_view",
        "add_to_cart",
        "checkout",
        "purchase",
      ],
      required: true,
      index: true,
    },

    revenue: {
      type: Number,
      default: 0,
    },

    orderId: {
      type: String,
      index: true,
      sparse: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

/* -----------------------------
   🔥 IMPORTANT INDEXES
------------------------------ */

// Prevent duplicate PURCHASE per order
ReferralEventSchema.index(
  { orderId: 1, eventType: 1 },
  {
    unique: true,
    partialFilterExpression: {
      eventType: "purchase",
    },
  }
);

// Prevent spam visits (same visitor same partner same day)
ReferralEventSchema.index(
  { partnerCode: 1, visitorId: 1, eventType: 1, createdAt: 1 }
);

// Analytics optimization
ReferralEventSchema.index({
  partnerCode: 1,
  eventType: 1,
  createdAt: -1,
});

/* -----------------------------
   EXPORT MODELS
------------------------------ */

export const Partner =
  mongoose.models.Partner ||
  mongoose.model("Partner", PartnerSchema);

export const ReferralEvent =
  mongoose.models.ReferralEvent ||
  mongoose.model(
    "ReferralEvent",
    ReferralEventSchema
  );