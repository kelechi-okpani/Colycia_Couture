import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import { getSession } from "next-auth/react";

interface UserProfile {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  cart?: any[];
  wishlist?: any[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface UserState {
  profile: UserProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  status: "idle",
  error: null,
};

/**
 * Fetch authenticated user profile
 */
export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>("user/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    // Get active NextAuth session
    const session = await getSession();

    if (!session?.user) {
      return rejectWithValue("No active session");
    }

    const userId = (session.user as any).id;

    if (!userId) {
      return rejectWithValue("User ID not found");
    }

    // Fetch profile from API
    const response = await fetch(
      `/api/auth/profile?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(
        data?.error || "Failed to fetch profile"
      );
    }

    return {
      ...data,
      _id: String(data._id),
      id: String(data._id),
    };
  } catch (error: any) {
    return rejectWithValue(
      error?.message || "Something went wrong"
    );
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUser: (
      state,
      action: PayloadAction<UserProfile | null>
    ) => {
      state.profile = action.payload;
      state.status = "succeeded";
      state.error = null;
    },

    clearUser: (state) => {
      state.profile = null;
      state.status = "idle";
      state.error = null;
    },

    syncUserActivity: (
      state,
      action: PayloadAction<{
        cart?: any[];
        wishlist?: any[];
      }>
    ) => {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      // Success
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        state.error = null;
      })

      // Failed
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.profile = null;
        state.error =
          action.payload || "Failed to fetch user profile";
      });
  },
});

export const {
  setUser,
  clearUser,
  syncUserActivity,
} = userSlice.actions;

export default userSlice.reducer;


// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { getSession } from "next-auth/react";

// interface UserState {
//   profile: any | null;
//   status: "idle" | "loading" | "failed";
//   error: string | null;
// }

// const initialState: UserState = {
//   profile: null,
//   status: "idle",
//   error: null,
// };

// /**
//  * Fetch logged-in user's profile from DB
//  */
// export const fetchUserProfile = createAsyncThunk(
//   "user/fetchProfile",
//   async (_, { rejectWithValue }) => {
//     try {
//       const session = await getSession();

//       if (!session?.user) {
//         return rejectWithValue("No active session");
//       }

//       const userId = (session.user as any).id;

//       const res = await fetch(`/api/auth/profile?userId=${userId}`);

//       console.log(res, "data....")

//       const data = await res.json();

//       console.log(data, "data....")

//       if (!res.ok) {
//         return rejectWithValue(data.error || "Failed to fetch profile");
//       }

//       return {
//         ...data,
//         _id: data._id.toString(),
//         id: data._id.toString(),
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const userSlice = createSlice({
//   name: "user",
//   initialState,

//   reducers: {
//     setUser: (state, action: PayloadAction<any>) => {
//       state.profile = action.payload;
//     },

//     clearUser: (state) => {
//       state.profile = null;
//     },

//     syncUserActivity: (
//       state,
//       action: PayloadAction<{ cart?: any[]; wishlist?: any[] }>
//     ) => {
//       if (state.profile) {
//         state.profile = {
//           ...state.profile,
//           ...action.payload,
//         };
//       }
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })

//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.status = "idle";
//         state.profile = action.payload;
//       })

//       .addCase(fetchUserProfile.rejected, (state, action: any) => {
//         state.status = "failed";
//         state.error = action.payload;
//         state.profile = null;
//       });
//   },
// });

// export const { setUser, clearUser, syncUserActivity } = userSlice.actions;

// export default userSlice.reducer;

// // import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// // interface UserState {
// //   profile: any | null;
// //   status: 'idle' | 'loading' | 'failed';
// // }

// // const initialState: UserState = {
// //   profile: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('colycia_user') || 'null') : null,
// //   status: 'idle',
// // };

// // const userSlice = createSlice({
// //   name: 'user',
// //   initialState,
// //   reducers: {
// //     setUser: (state, action: PayloadAction<any>) => {
// //       state.profile = action.payload;
// //       // localStorage.setItem('colycia_user', JSON.stringify(action.payload));
// //     },
// //     clearUser: (state) => {
// //       state.profile = null;
// //       // localStorage.removeItem('colycia_user');
// //     },
// //     // Call this specifically when the cart or wishlist is updated via API
// //     syncUserActivity: (state, action: PayloadAction<{ cart?: any[]; wishlist?: any[] }>) => {
// //       if (state.profile) {
// //         state.profile = { ...state.profile, ...action.payload };
// //         // localStorage.setItem('colycia_user', JSON.stringify(state.profile));
// //       }
// //     },
// //   },
// // });

// // export const { setUser, clearUser, syncUserActivity } = userSlice.actions;
// // export default userSlice.reducer;