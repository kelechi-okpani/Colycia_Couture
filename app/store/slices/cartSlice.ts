// store/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string; // Made required for clothing logic
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // Check for item with same ID AND same Size
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      // Recalculate total
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity, 
        0
      );
    },

    // Updated to take an object so we remove the specific size variant
    removeFromCart: (state, action: PayloadAction<{ id: number; size: string }>) => {
      state.items = state.items.filter(
        (item) => !(item.id === action.payload.id && item.size === action.payload.size)
      );
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity, 
        0
      );
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; size: string; quantity: number }>) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.size === action.payload.size
      );
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity, 
        0
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;