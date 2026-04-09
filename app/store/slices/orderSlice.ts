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

// const persistedData = loadOrdersFromStorage();
// const initialState: OrderState = {
//   orders: persistedData.orders || [],
//   currentOrder: persistedData.currentOrder || null,
//   status: 'idle',
//   error: null,
// };

const persistedData = null

const initialState: OrderState = {
  orders:  [],
  currentOrder: null,
  status: 'idle',
  error: null,
};

// --- 2. Async Thunks (Same as provided) ---


export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status, adminId }: { orderId: string; status: string; adminId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminId }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error);
      return data.order; // Return the updated order object
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async ({ userId, isAdmin }: { userId?: string; isAdmin?: boolean }, { rejectWithValue }) => {
    if (!userId) return rejectWithValue("No user ID provided");

    try {
      // We pass userId even for admins so the server can verify the role
      const res = await fetch(`/api/orders?userId=${userId}`);
      const data = await res.json();

      if (!res.ok) return rejectWithValue(data.error || "Failed to fetch orders");

      // Extract the orders array from your { success: true, orders: [] } response
      return data.orders; 
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// export const fetchOrders = createAsyncThunk(
//   'orders/fetchAll',
//   async ({ userId, isAdmin }: { userId?: string; isAdmin?: boolean }, { rejectWithValue }) => {
//     // GUARD: If not admin and no userId, don't even call the API
//     if (!isAdmin && !userId) {
//       return rejectWithValue("No user ID provided");
//     }

//     try {
//       const url = isAdmin 
//         ? '/api/orders?isAdmin=true' 
//         : `/api/orders?userId=${userId}`;
        
//       const res = await fetch(url);

//       // Handle non-JSON responses (prevents the "unexpected character" error)
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({ error: "Server Error" }));
//         return rejectWithValue(errorData.error || "Failed to fetch orders");
//       }

//       return await res.json();
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );


// export const fetchOrderById = createAsyncThunk(
//   'orders/fetchOne',
//   async (orderId: string, { rejectWithValue }) => {
//     try {
//       const res = await fetch(`/api/orders/${orderId}`);
//       const data = await res.json();
      
//       if (!res.ok) return rejectWithValue(data.error || "Order not found");
//       return data;
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// --- 3. Slice ---

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      // saveOrdersToStorage(state);
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
        // saveOrdersToStorage(state); // Save fetched list
      })
      .addCase(fetchOrders.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload; // Update the list in real-time
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload; // Update detailed view if open
        }
        // saveOrdersToStorage(state);
      });
      // Fetch Single Order
      // .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
      //   state.currentOrder = action.payload;
      //   saveOrdersToStorage(state); // Save current detailed view
      // });
  },
});

export const { clearCurrentOrder, resetOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;