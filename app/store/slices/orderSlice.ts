import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// --- Interfaces (Same as provided) ---
interface ShippingDetails {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  deliveryMethod: 'Standard' | 'Express' | 'Pickup';
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface Order {
  _id: string;
  userId: any; 
  items: OrderItem[];
  shippingDetails: ShippingDetails;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// --- 1. Persistence Helpers ---

const STORAGE_KEY = 'colycia_orders';

const loadOrdersFromStorage = (): Partial<OrderState> => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing orders from storage", e);
      }
    }
  }
  return { orders: [], currentOrder: null };
};

const saveOrdersToStorage = (state: OrderState) => {
  if (typeof window !== 'undefined') {
    // We save the data but reset status/error to avoid starting in a "loading" state on refresh
    const dataToSave = {
      orders: state.orders,
      currentOrder: state.currentOrder,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }
};

// --- Initial State ---

const persistedData = loadOrdersFromStorage();

const initialState: OrderState = {
  orders: persistedData.orders || [],
  currentOrder: persistedData.currentOrder || null,
  status: 'idle',
  error: null,
};

// --- 2. Async Thunks (Same as provided) ---

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async ({ userId, isAdmin }: { userId?: string; isAdmin?: boolean }, { rejectWithValue }) => {
    try {
      const url = isAdmin 
        ? '/api/orders?isAdmin=true' 
        : `/api/orders?userId=${userId}`;
        
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) return rejectWithValue(data.error || "Failed to fetch orders");
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOne',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      
      if (!res.ok) return rejectWithValue(data.error || "Order not found");
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// --- 3. Slice ---

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      saveOrdersToStorage(state);
    },
    resetOrderStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.status = 'succeeded';
        state.orders = action.payload;
        saveOrdersToStorage(state); // Save fetched list
      })
      .addCase(fetchOrders.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch Single Order
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.currentOrder = action.payload;
        saveOrdersToStorage(state); // Save current detailed view
      });
  },
});

export const { clearCurrentOrder, resetOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;