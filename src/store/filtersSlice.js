import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_KEYWORDS, JOBS_PER_PAGE } from '../constants';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    searchTerm: '',
    locationFilter: '',
    minExperience: '',
    maxExperience: '',
    sortBy: 'posted-newest',
    currentPage: 1,
    scrapeKeywords: DEFAULT_KEYWORDS,
    latestOnly: true,
    latestDays: 7,
    showAnalytics: true,
    showSuccessToast: false,
  },
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setLocationFilter(state, action) {
      state.locationFilter = action.payload;
      state.currentPage = 1;
    },
    setMinExperience(state, action) {
      state.minExperience = action.payload;
      state.currentPage = 1;
    },
    setMaxExperience(state, action) {
      state.maxExperience = action.payload;
      state.currentPage = 1;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setScrapeKeywords(state, action) {
      state.scrapeKeywords = action.payload;
    },
    setLatestOnly(state, action) {
      state.latestOnly = action.payload;
    },
    setLatestDays(state, action) {
      state.latestDays = action.payload;
    },
    setShowAnalytics(state, action) {
      state.showAnalytics = action.payload;
    },
    setShowSuccessToast(state, action) {
      state.showSuccessToast = action.payload;
    },
    resetFilters(state) {
      state.searchTerm = '';
      state.locationFilter = '';
      state.minExperience = '';
      state.maxExperience = '';
      state.sortBy = 'posted-newest';
      state.currentPage = 1;
    },
  },
});

export const {
  setSearchTerm,
  setLocationFilter,
  setMinExperience,
  setMaxExperience,
  setSortBy,
  setCurrentPage,
  setScrapeKeywords,
  setLatestOnly,
  setLatestDays,
  setShowAnalytics,
  setShowSuccessToast,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
