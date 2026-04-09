import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// GET: Fetch cart
export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/cart?userId=${userId}`);
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || 'Failed to fetch');
      return data; 
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// POST: Sync actions
export const syncCartAction = createAsyncThunk(
  'cart/syncAction',
  async (
    payload: { 
      userId: string; 
      productId?: string; 
      quantity?: number; 
      size?: string; 
      action: 'add' | 'remove' | 'update' | 'clear' 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || 'Failed to sync');
      return data; 
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.items = [];
      state.loading = false; // Always reset loading on clear
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Pending (Explicitly for this slice's thunks)
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Handle Fulfilled (Explicitly for this slice's thunks)
      // .addMatcher(
      //   (action) => action.type.startsWith('cart/') && action.type.endsWith('/fulfilled'),
      //   (state, action: PayloadAction<CartItem[]>) => {
      //     state.loading = false;
      //     state.items = action.payload;
      //   }
      // )

      // Handle Fulfilled
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/fulfilled'),
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          
          // Check if payload has a 'cart' property (from syncCartAction) 
          // or is the array itself (if fetchCart returns the array directly)
          if (action.payload && action.payload.cart) {
            state.items = action.payload.cart;
          } else if (Array.isArray(action.payload)) {
            state.items = action.payload;
          } else {
            // Fallback if data structure is unexpected
            console.warn("Unexpected cart data format:", action.payload);
          }
        }
      )

      // Handle Rejected (Explicitly for this slice's thunks)
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload || "An unexpected error occurred";
        }
      )
   
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;