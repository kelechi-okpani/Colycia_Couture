import mongoose, { Schema, model, models, Document, Types } from 'mongoose';

// 1. Define the Interface extending Document for better 'this' typing
export interface IWishlist extends Document {
  userId: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema:any = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "User ID is required for a wishlist"],
      unique: true, // This acts as the primary index
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 2. Middleware Fix: Use a standard function to keep 'this' context
// Middleware: Ensure no duplicate product IDs are pushed into the array
WishlistSchema.pre('save', function (this: IWishlist, next: (err?: any) => void) {
  if (this.isModified('products') && this.products) {
    // We use Array.from to ensure we are working with a clean array
    const uniqueIds = Array.from(
      new Set(this.products.map((id) => id.toString()))
    );
    // Assign back to ensure uniqueness (assuming you want to update the array)
    this.products = uniqueIds.map(id => new mongoose.Types.ObjectId(id));
  }
  next(); // Call next to proceed with save
});

// 3. Prevent Model Re-declaration errors in Next.js
const Wishlist = models.Wishlist || model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;