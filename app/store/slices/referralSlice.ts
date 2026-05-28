import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ReferralData {
  partnerCode: string;
  partnerName: string;
  commissionRate: number;
  visitors: number;
  inquiries: number;
  bookings: number;
  inquiryConvRate: number;
  bookingConvRate: number;
  totalRevenue: number;
}

interface ReferralState {
  data: ReferralData[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReferralState = {
  data: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch dashboard stats
export const fetchReferralStats = createAsyncThunk(
  'referrals/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/admin/referrals');
      if (!response.ok) {
        throw new Error('Failed to fetch referral data');
      }
      const data = await response.json();
      return data as ReferralData[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const referralSlice = createSlice({
  name: 'referrals',
  initialState,
  reducers: {
    clearReferralData: (state) => {
      state.data = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferralStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchReferralStats.fulfilled, (state, action: PayloadAction<ReferralData[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchReferralStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearReferralData } = referralSlice.actions;
export default referralSlice.reducer;