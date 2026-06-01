import { useState, useEffect } from 'react';
import { jobsApi } from '../services/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async ({ retries = 1 } = {}) => {
    setLoading(true);
    setError(null);
    let lastErr;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await jobsApi.getStats();
        setStats(response.data);
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        if (attempt < retries) await delay(attempt * 2000);
      }
    }
    if (lastErr) setError(lastErr.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};