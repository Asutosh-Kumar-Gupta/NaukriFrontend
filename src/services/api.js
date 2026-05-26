import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const jobsApi = {
  getJobs: (params = {}) => api.get('/api/jobs', { params }),
  scrapeJobs: (payload) => api.post('/api/scrape', payload),
  getStats: () => api.get('/api/stats'),
  clearJobs: () => api.delete('/api/jobs'),
};

export default api;
