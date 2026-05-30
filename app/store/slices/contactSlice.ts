import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface ContactMessage {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt?: string;
}

interface ContactState {
  data: ContactMessage[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  submitStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ContactState = {
  data: [],
  status: "idle",
  error: null,
  submitStatus: "idle",
};

/* ---------------- SUBMIT CONTACT ---------------- */
export const submitContact = createAsyncThunk(
  "contact/submit",
  async (payload: ContactMessage, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------------- FETCH CONTACTS ---------------- */
export const fetchContacts = createAsyncThunk(
  "contact/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/admin/contact");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContacts.fulfilled, (state, action: PayloadAction<ContactMessage[]>) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      /* SUBMIT */
      .addCase(submitContact.pending, (state) => {
        state.submitStatus = "loading";
      })
      .addCase(submitContact.fulfilled, (state) => {
        state.submitStatus = "succeeded";
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export default contactSlice.reducer;