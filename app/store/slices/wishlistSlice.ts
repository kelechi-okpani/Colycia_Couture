// store/slices/wishlistSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const toggleWishlistApi = createAsyncThunk(
  'wishlist/toggle',
  async ({ userId, productId }: { userId: string; productId: string }) => {
    const res = await fetch('/api/user/wishlist', {
      method: 'POST',
      body: JSON.stringify({ userId, productId }),
    });
    return res.json();
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], loading: false },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(toggleWishlistApi.fulfilled, (state, action) => {
      state.items = action.payload; // Payload is the updated array of products
    });
  },
});

export const { setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;