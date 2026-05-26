import { useState, useEffect } from 'react';
import { jobsApi } from '../services/api';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobsApi.getJobs(filters);
      setJobs(response.data);
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const scrapeJobs = async (keywords, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
      const response = await jobsApi.scrapeJobs({
        keywords: keywordArray,
        latest_only: options.latestOnly ?? true,
        days: options.days ?? 7
      });
      await fetchJobs();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    scrapeJobs,
  };
};
