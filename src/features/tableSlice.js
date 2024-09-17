import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: [],
  filterOptions: {
    name: true,
    username: true,
    email: true,
    phone: true,
    website: true,
    address: {
      street: true,
      suite: true,
      city: true,
      zipcode: true,
    },
    company: {
      name: true,
    },
  },
  loading: false,
  error: null,
};


const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        setData(state, action){
            state.data = action.payload
        },
        setFilterOptions: (state, action) => {
            state.filterOptions = action.payload;
          },
          setError: (state, action) => {
            state.error = action.payload;
          },
          setLoading: (state, action) => {
            state.loading = action.payload;
          },
    }
})

export const { setData, setFilterOptions, setError, setLoading } = tableSlice.actions;
export default tableSlice.reducer;
