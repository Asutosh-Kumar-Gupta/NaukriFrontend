import { createSelector } from '@reduxjs/toolkit';
import { filterJobs, sortJobs, getUniqueLocations } from '../utils/jobFilters';
import { JOBS_PER_PAGE } from '../constants';

const selectJobItems = (state) => state.jobs.items;
const selectFilters = (state) => state.filters;

export const selectFilteredSortedJobs = createSelector(
  [selectJobItems, selectFilters],
  (jobs, filters) => {
    const { searchTerm, locationFilter, minExperience, maxExperience, sortBy } = filters;
    const filtered = filterJobs(jobs, { searchTerm, locationFilter, minExperience, maxExperience });
    return sortJobs(filtered, sortBy);
  }
);

export const selectCurrentPageJobs = createSelector(
  [selectFilteredSortedJobs, (state) => state.filters.currentPage],
  (filteredJobs, currentPage) => {
    const last = currentPage * JOBS_PER_PAGE;
    const first = last - JOBS_PER_PAGE;
    return filteredJobs.slice(first, last);
  }
);

export const selectTotalPages = createSelector(
  [selectFilteredSortedJobs],
  (filteredJobs) => Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
);

export const selectUniqueLocations = createSelector(
  [selectJobItems],
  (jobs) => getUniqueLocations(jobs)
);

export const selectPaginationInfo = createSelector(
  [selectFilteredSortedJobs, (state) => state.filters.currentPage, selectTotalPages],
  (filteredJobs, currentPage, totalPages) => {
    const last = currentPage * JOBS_PER_PAGE;
    const first = last - JOBS_PER_PAGE;
    return {
      total: filteredJobs.length,
      from: first + 1,
      to: Math.min(last, filteredJobs.length),
      currentPage,
      totalPages,
    };
  }
);
