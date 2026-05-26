export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const JOBS_PER_PAGE = 10;

export const EXPERIENCE_RANGES = {
  '0-2 years': { min: 0, max: 2 },
  '3-5 years': { min: 3, max: 5 },
  '6-10 years': { min: 6, max: 10 },
  '10+ years': { min: 10, max: 50 }
};

export const DEFAULT_KEYWORDS = 'python, backend, software engineer';