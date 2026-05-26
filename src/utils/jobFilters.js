export const filterJobs = (jobs, filters) => {
  const { searchTerm, locationFilter, minExperience, maxExperience } = filters;
  
  let filtered = jobs;
  
  if (searchTerm) {
    filtered = filtered.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (locationFilter) {
    filtered = filtered.filter(job =>
      job.location.toLowerCase().includes(locationFilter.toLowerCase())
    );
  }
  
  if (minExperience || maxExperience) {
    filtered = filtered.filter(job => {
      if (!job.experience || job.experience === 'N/A') return false;
      
      const expMatch = job.experience.match(/(\d+)-to-(\d+)-years/);
      if (!expMatch) return false;
      
      const jobMinExp = parseInt(expMatch[1]);
      const jobMaxExp = parseInt(expMatch[2]);
      
      const filterMin = minExperience ? parseInt(minExperience) : 0;
      const filterMax = maxExperience ? parseInt(maxExperience) : 50;
      
      return jobMaxExp >= filterMin && jobMinExp <= filterMax;
    });
  }
  
  return filtered;
};

export const sortJobs = (jobs, sortBy) => {
  const sortedJobs = [...jobs];

  const getPostedTime = (job) => {
    if (!job.posted || job.posted === 'N/A') return 0;

    const parsedTime = new Date(job.posted).getTime();
    return Number.isNaN(parsedTime) ? 0 : parsedTime;
  };

  switch (sortBy) {
    case 'posted-oldest':
      return sortedJobs.sort((a, b) => getPostedTime(a) - getPostedTime(b));
    case 'title-asc':
      return sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
    case 'company-asc':
      return sortedJobs.sort((a, b) => a.company.localeCompare(b.company));
    case 'posted-newest':
    default:
      return sortedJobs.sort((a, b) => getPostedTime(b) - getPostedTime(a));
  }
};

export const getUniqueLocations = (jobs) => {
  return [...new Set(jobs.map(job => job.location))];
};
