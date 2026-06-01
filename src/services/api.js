import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
};

export const jobsApi = {
  getJobs: (params = {}, signal) =>
    api.get('/api/jobs', {
      params: { ...params, _t: Date.now() },
      headers: noCacheHeaders,
      signal,
    }),
  scrapeJobs: (payload) =>
    api.post('/api/scrape', payload, { timeout: 600000 }),
  getStats: () =>
    api.get('/api/stats', {
      params: { _t: Date.now() },
      headers: noCacheHeaders,
    }),
  clearJobs: () => api.delete('/api/jobs'),
};

export default api;
