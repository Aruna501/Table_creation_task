import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      console.log('API Response:', response.data);
      return response.data; 
    } catch (error) {
      console.error('API Error:', error); 
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    filterByCategory: (state, action) => {
      const category = action.payload;
      state.filteredItems =
        category === ""
          ? state.allItems // Show all items if no category is selected
          : state.allItems.filter((product) => product.category === category);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { filterByCategory } = productsSlice.actions;

export default productsSlice.reducer;
