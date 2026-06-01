import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobsApi } from '../services/api';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await jobsApi.getJobs({ ...filters, _t: Date.now() });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const scrapeJobs = createAsyncThunk(
  'jobs/scrapeJobs',
  async ({ keywords, options = {} }, { dispatch, rejectWithValue }) => {
    try {
      const keywordArray = keywords.split(',').map((k) => k.trim()).filter(Boolean);
      const response = await jobsApi.scrapeJobs({
        keywords: keywordArray,
        latest_only: options.latestOnly ?? true,
        days: options.days ?? 7,
      });

      let lastErr;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await dispatch(fetchJobs()).unwrap();
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          if (attempt < 3) await delay(attempt * 2000);
        }
      }
      if (lastErr) return rejectWithValue(lastErr);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    scrapeStatus: 'idle',
    scrapeResult: null,
  },
  reducers: {
    clearScrapeResult(state) {
      state.scrapeResult = null;
      state.scrapeStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(scrapeJobs.pending, (state) => {
        state.scrapeStatus = 'loading';
        state.scrapeResult = null;
      })
      .addCase(scrapeJobs.fulfilled, (state, action) => {
        state.scrapeStatus = 'succeeded';
        state.scrapeResult = action.payload;
      })
      .addCase(scrapeJobs.rejected, (state, action) => {
        state.scrapeStatus = 'failed';
        state.scrapeResult = { success: false, message: 'Scraping failed. Please try again.' };
      });
  },
});

export const { clearScrapeResult } = jobsSlice.actions;
export default jobsSlice.reducer;
