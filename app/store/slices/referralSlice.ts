import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

export interface ReferralData {
  partnerCode: string;
  partnerName: string;
  commissionRate: number;

  visits: number;
  uniqueVisitors: number;

  productViews: number;
  addToCart: number;
  checkouts: number;
  purchases: number;

  totalRevenue: number;
  commissionEarned: number;

  conversionRate: number;


  
  visitToCartRate: number;
  cartToCheckoutRate: number;
  checkoutToPurchaseRate: number;

}

interface ReferralState {
  data: ReferralData[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReferralState = {
  data: [],
  status: "idle",
  error: null,
};

export const fetchReferralStats = createAsyncThunk<
  ReferralData[],
  void,
  { rejectValue: string }
>(
  "referrals/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "/api/admin/referrals"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to fetch referral data"
        );
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.message
      );
    }
  }
);

const referralSlice = createSlice({
  name: "referrals",
  initialState,

  reducers: {
    clearReferralData: (state) => {
      state.data = [];
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchReferralStats.pending,
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )

      .addCase(
        fetchReferralStats.fulfilled,
        (
          state,
          action: PayloadAction<
            ReferralData[]
          >
        ) => {
          state.status = "succeeded";
          state.data = action.payload;
        }
      )

      .addCase(
        fetchReferralStats.rejected,
        (state, action) => {
          state.status = "failed";
          state.error =
            (action.payload as string) ||
            "Something went wrong";
        }
      );
  },
});

export const {
  clearReferralData,
} = referralSlice.actions;

export default referralSlice.reducer;