import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  profile: any | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: UserState = {
  profile: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('colycia_user') || 'null') : null,
  status: 'idle',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
      localStorage.setItem('colycia_user', JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.profile = null;
      localStorage.removeItem('colycia_user');
    },
    // Call this specifically when the cart or wishlist is updated via API
    syncUserActivity: (state, action: PayloadAction<{ cart?: any[]; wishlist?: any[] }>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
        localStorage.setItem('colycia_user', JSON.stringify(state.profile));
      }
    },
  },
});

export const { setUser, clearUser, syncUserActivity } = userSlice.actions;
export default userSlice.reducer;