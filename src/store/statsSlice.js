import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobsApi } from '../services/api';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const fetchStats = createAsyncThunk(
  'stats/fetchStats',
  async ({ retries = 1, bust = false } = {}, { rejectWithValue }) => {
    let lastErr;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await jobsApi.getStats(bust || attempt > 1);
        return response.data;
      } catch (err) {
        lastErr = err;
        if (attempt < retries) await delay(attempt * 2000);
      }
    }
    return rejectWithValue(lastErr?.message);
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default statsSlice.reducer;
