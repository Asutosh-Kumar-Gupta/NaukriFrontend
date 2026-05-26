export const getAverageExperience = (jobs) => {
  const experiences = jobs.map(job => {
    if (!job.experience || job.experience === 'N/A') return null;
    const match = job.experience.match(/(\d+)-to-(\d+)-years/);
    if (!match) return null;
    return (parseInt(match[1]) + parseInt(match[2])) / 2;
  }).filter(exp => exp !== null);
  
  if (experiences.length === 0) return '0';
  const avg = experiences.reduce((sum, exp) => sum + exp, 0) / experiences.length;
  return `${avg.toFixed(1)}y`;
};

export const getLocationDistribution = (jobs) => {
  const locationCounts = {};
  jobs.forEach(job => {
    const location = job.location || 'Unknown';
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });
  return Object.entries(locationCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
};

export const getExperienceDistribution = (jobs) => {
  const expRanges = {
    '0-2 years': 0,
    '3-5 years': 0,
    '6-10 years': 0,
    '10+ years': 0
  };
  
  jobs.forEach(job => {
    if (!job.experience || job.experience === 'N/A') return;
    const match = job.experience.match(/(\d+)-to-(\d+)-years/);
    if (!match) return;
    
    const minExp = parseInt(match[1]);
    const maxExp = parseInt(match[2]);
    const avgExp = (minExp + maxExp) / 2;
    
    if (avgExp <= 2) expRanges['0-2 years']++;
    else if (avgExp <= 5) expRanges['3-5 years']++;
    else if (avgExp <= 10) expRanges['6-10 years']++;
    else expRanges['10+ years']++;
  });
  
  return Object.entries(expRanges)
    .filter(([,count]) => count > 0)
    .sort(([,a], [,b]) => b - a);
};

export const getTopCompanies = (jobs) => {
  const companyCounts = {};
  jobs.forEach(job => {
    const company = job.company || 'Unknown';
    companyCounts[company] = (companyCounts[company] || 0) + 1;
  });
  return Object.entries(companyCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
};

export const getUniqueLocations = (jobs) => {
  return [...new Set(jobs.map(job => job.location))];
};