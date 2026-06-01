import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from './jobsSlice';
import statsReducer from './statsSlice';
import filtersReducer from './filtersSlice';

const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    stats: statsReducer,
    filters: filtersReducer,
  },
});

export default store;
