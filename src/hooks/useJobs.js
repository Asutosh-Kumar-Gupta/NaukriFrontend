import { useState, useEffect } from 'react';
import { jobsApi } from '../services/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobsApi.getJobs({ ...filters, _t: Date.now() });
      setJobs(response.data);
    } catch (err) {
      setError(err.message);
      // Don't wipe existing jobs on a transient network error
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

      // Retry fetching jobs up to 3 times — the backend may be briefly
      // busy right after a long scrape commit, or a transient network
      // error may have occurred.
      let lastErr;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const jobsResponse = await jobsApi.getJobs({ _t: Date.now() });
          setJobs(jobsResponse.data);
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          if (attempt < 3) await delay(attempt * 2000);
        }
      }
      if (lastErr) setError(lastErr.message);

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
