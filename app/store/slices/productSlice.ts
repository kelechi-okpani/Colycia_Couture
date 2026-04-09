import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  createdAt: number;
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  sizes: string[];
}

interface ProductState {
  items: Product[];
  currentProduct: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// --- Persistence Helpers ---

const STORAGE_KEY = 'colycia_products';

const loadProductsFromStorage = (): Partial<ProductState> => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading products from storage", e);
      }
    }
  }
  return { items: [], currentProduct: null };
};

const saveProductsToStorage = (state: ProductState) => {
  if (typeof window !== 'undefined') {
    // Only persist the data, not the status or error states
    const dataToSave = {
      items: state.items,
      currentProduct: state.currentProduct,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }
};

// --- Initial State ---

// const persistedData = loadProductsFromStorage();

// const initialState: ProductState = {
//   items: persistedData.items || [],
//   currentProduct: persistedData.currentProduct || null,
//   status: 'idle',
//   error: null,
// };

const initialState: ProductState = {
  items: [],
  currentProduct: null,
  status: 'idle',
  error: null,
};

// --- Async Thunks ---

export const fetchProducts = createAsyncThunk('shop/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/shop');
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error || "Failed to fetch products");
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchProductById = createAsyncThunk(
  'shop/fetchOne', 
  async (id: string, { rejectWithValue }) => {
    try {
      // Ensure this matches your folder: app/api/shop/[id]/route.ts
      const res = await fetch(`/api/shop/${id}`);
      
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.error || "Product not found");
      }
      
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


export const createProduct = createAsyncThunk(
  'products/create',
  async (productData: any, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || "Failed to create product");
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
)


// --- Slice ---

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      // saveProductsToStorage(state);
    }
  },
  extraReducers: (builder) => {
    builder

     .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.items.unshift(action.payload);
        // saveProductsToStorage(state);
      })
      // Fetch All
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        // saveProductsToStorage(state); // Persist shop list
      })
      .addCase(fetchProducts.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch One
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.currentProduct = action.payload;
        // saveProductsToStorage(state); // Persist specific product detail
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;