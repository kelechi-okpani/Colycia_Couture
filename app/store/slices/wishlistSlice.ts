import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './productSlice';

interface WishlistState {
  items: Product[];
  loading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// --- Persistence Helpers ---

const STORAGE_KEY = 'colycia_wishlist';

const loadWishlistFromStorage = (): Product[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading wishlist from storage", e);
      }
    }
  }
  return [];
};

const saveWishlistToStorage = (items: Product[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

// --- Initial State ---


const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
  loading: false,
  error: null,
  status: 'idle' 
};

// --- Async Thunks ---

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchAll',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/wishlist?userId=${userId}`);
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || "Failed to fetch wishlist");
      return data; 
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleWishlistApi = createAsyncThunk(
  'wishlist/toggle',
  async ({ userId, productId }: { userId: string; productId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userId, productId }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || "Toggle failed");
      return data; 
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Slice ---

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
      saveWishlistToStorage([]); // Clear storage too
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        saveWishlistToStorage(state.items); // Sync storage with API result
      })
      .addCase(fetchWishlist.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(toggleWishlistApi.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.items = action.payload;
        saveWishlistToStorage(state.items); // Sync storage after toggle
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;