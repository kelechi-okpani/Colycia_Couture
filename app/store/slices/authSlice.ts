import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getSession, signIn, signOut } from 'next-auth/react';
import { CartItem } from './cartSlice';
import { Product } from './productSlice';

interface AuthState {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    cart: CartItem[];
    wishlist: Product[];
    [key: string]: any; // For any other DB fields
  } | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// Helper: Persist user state to local storage for page refreshes
const loadUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('colycia_user');
      return (saved && saved !== "undefined") ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Corrupted localStorage found, clearing...");
      localStorage.removeItem('colycia_user');
      return null;
    }
  }
  return null;
};



const initialState: AuthState = {
  // user: loadUserFromStorage(),
  user: null,
  loading: false,
  error: null,
  successMessage: null,
};

/**
 * LOGIN: Authenticates with NextAuth, then immediately fetches 
 * the full user document from MongoDB to populate cart/wishlist.
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      });

      if (result?.error) return rejectWithValue(result.error);

      // Fetch the actual user data from your custom profile API
      // session.user typically only has email/name; we want the DB arrays.
      const session = await getSession();
      if (!session?.user) return rejectWithValue("Session authentication failed");

      const userId = (session.user as any).id;
      const res = await fetch(`/api/auth/profile?userId=${userId}`);
      
      const dbUser = await res.json();

      if (!res.ok) return rejectWithValue(dbUser.error || "Failed to sync profile");

      // Format the ID for consistency (matching your console log)
      return { ...dbUser, 
        _id: dbUser._id.toString(),
        id: dbUser._id.toString(),
        // id: dbUser._id
       }; 
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * SIGNUP: Creates user in DB and returns the new user object.
 */
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData: any, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || "Signup failed");
      
      return data.user; 
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * LOGOUT: Clears NextAuth session and LocalStorage.
 */
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await signOut({ redirect: false });
  if (typeof window !== 'undefined') {
    localStorage.removeItem('colycia_user');
  }
});

// --- Other Thunks (Forgot/Reset) ---
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email: string, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error || "Request failed");
    return data;
  } catch (err: any) { return rejectWithValue(err.message); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    // Used to keep the auth.user object in sync when cart/wishlist actions happen
    syncUserArrays: (state, action: PayloadAction<{ cart?: any[], wishlist?: any[] }>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('colycia_user', JSON.stringify(state.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
        // if (typeof window !== 'undefined') {
        //   localStorage.setItem('colycia_user', JSON.stringify(action.payload));
        // }
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.successMessage = null;
      })
      // Signup
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Account created! Please log in.";
      })
      // Global Matchers for Auth Loading/Errors
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload || "An unexpected error occurred";
        }
      );
  },
});

export const { clearMessages, syncUserArrays } = authSlice.actions;
export default authSlice.reducer;