import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MapPin, Briefcase, RefreshCw, Users, TrendingUp, Clock, X, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

import { useJobs } from './hooks/useJobs';
import { useStats } from './hooks/useStats';
import { filterJobs, sortJobs, getUniqueLocations } from './utils/jobFilters';
import { getAverageExperience } from './utils/analytics';
import JobCard from './components/JobCard';
import Analytics from './components/Analytics';
import { JOBS_PER_PAGE, DEFAULT_KEYWORDS } from './constants';

function App() {
  const { jobs, loading, scrapeJobs, fetchJobs } = useJobs();
  const { stats, fetchStats } = useStats();
  
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');
  const [sortBy, setSortBy] = useState('posted-newest');
  const [scrapeKeywords, setScrapeKeywords] = useState(DEFAULT_KEYWORDS);
  const keywordsInitialized = useRef(false);
  const [latestOnly, setLatestOnly] = useState(true);
  const [latestDays, setLatestDays] = useState(7);
  const [scraping, setScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAnalytics, setShowAnalytics] = useState(true);

  useEffect(() => {
    if (!keywordsInitialized.current && stats?.last_scraped_keywords) {
      setScrapeKeywords(stats.last_scraped_keywords);
      keywordsInitialized.current = true;
    }
  }, [stats]);

  useEffect(() => {
    const filtered = filterJobs(jobs, {
      searchTerm,
      locationFilter,
      minExperience,
      maxExperience
    });
    setFilteredJobs(sortJobs(filtered, sortBy));
    setCurrentPage(1);
  }, [searchTerm, locationFilter, minExperience, maxExperience, sortBy, jobs]);

  const handleScraping = async () => {
    setScraping(true);
    setScrapeResult(null);
    try {
      const result = await scrapeJobs(scrapeKeywords, {
        latestOnly,
        days: Number(latestDays) || 7
      });
      setScrapeResult(result);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      keywordsInitialized.current = true;
      fetchStats({ retries: 3, bust: true });
    } catch (error) {
      setScrapeResult({ success: false, message: 'Scraping failed. Please try again.' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
    setScraping(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setMinExperience('');
    setMaxExperience('');
    setSortBy('posted-newest');
    setCurrentPage(1);
  };

  const indexOfLastJob = currentPage * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex-shrink-0">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Job Scraper Dashboard
                </h1>
                <p className="text-sm text-gray-500">Find your next opportunity</p>
              </div>
            </div>
            <div className="flex space-x-3 self-end sm:self-auto">
              <button
                onClick={fetchJobs}
                disabled={loading}
                className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <RefreshCw className={`w-4 h-4 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleScraping}
                disabled={scraping}
                className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 relative overflow-hidden"
              >
                {scraping && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 animate-pulse" />
                )}
                <div className="relative flex items-center">
                  <Search className={`w-4 h-4 sm:mr-2 ${scraping ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{scraping ? 'Scraping Jobs...' : 'Start Scraping'}</span>
                  <span className="sm:hidden">{scraping ? 'Scraping...' : 'Scrape'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showSuccess && scrapeResult && (
        <div className={`fixed top-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 p-4 rounded-lg shadow-lg transition-all duration-500 transform ${
          scrapeResult.success 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              scrapeResult.success ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {scrapeResult.success ? (
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {scrapeResult.success ? 'Scraping Completed!' : 'Scraping Failed'}
              </p>
              <p className="text-xs mt-1">{scrapeResult.message}</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6 transition-all duration-300 hover:shadow-xl">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Search className="w-4 h-4 mr-2 text-blue-600" />
              Scraping Keywords
            </label>
            <input
              type="text"
              value={scrapeKeywords}
              onChange={(e) => setScrapeKeywords(e.target.value)}
              placeholder="python, backend, software engineer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <label className="inline-flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={latestOnly}
                onChange={(e) => setLatestOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2">Latest postings only</span>
            </label>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Last</span>
              <input
                type="number"
                value={latestDays}
                onChange={(e) => setLatestDays(e.target.value)}
                disabled={!latestOnly}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                min="1"
                max="30"
              />
              <span>days</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search jobs or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                >
                  <option value="">All Locations</option>
                  {getUniqueLocations(jobs).map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <div className="relative flex-1 group">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="number"
                    placeholder="Min years"
                    value={minExperience}
                    onChange={(e) => setMinExperience(e.target.value)}
                    className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    min="0"
                    max="50"
                  />
                </div>
                <span className="flex items-center text-gray-400 font-medium">to</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Max years"
                    value={maxExperience}
                    onChange={(e) => setMaxExperience(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    min="0"
                    max="50"
                  />
                </div>
              </div>
              <div className="relative group">
                <ArrowUpDown className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                >
                  <option value="posted-newest">Newest Posted</option>
                  <option value="posted-oldest">Oldest Posted</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="company-asc">Company A-Z</option>
                </select>
              </div>
            </div>
            <button
              onClick={resetFilters}
              className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Jobs</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{jobs.length}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">Available positions</span>
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Filtered Results</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{filteredJobs.length}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Filter className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">Matching criteria</span>
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Locations</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{getUniqueLocations(jobs).length}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">Cities available</span>
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Avg Experience</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{getAverageExperience(jobs)}</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">Years required</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <Analytics 
          jobs={jobs} 
          showAnalytics={showAnalytics} 
          setShowAnalytics={setShowAnalytics} 
        />

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              </div>
              <p className="text-lg font-medium text-gray-700">Loading jobs...</p>
              <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the latest opportunities</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-700">No jobs found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria or scrape new jobs</p>
            </div>
          ) : (
            <>
              {currentJobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}
              
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Previous</span>
                  </button>

                  <div className="hidden sm:flex space-x-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      const isCurrentPage = pageNumber === currentPage;

                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              isCurrentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }

                      if (
                        (pageNumber === currentPage - 2 && currentPage > 3) ||
                        (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <span key={pageNumber} className="px-3 py-2 text-gray-500">
                            ...
                          </span>
                        );
                      }

                      return null;
                    })}
                  </div>

                  <span className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="text-center text-sm text-gray-600 mt-4">
                Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
              </div>
            </>
          )}
        </div>
      </div>
      
      <footer className="mt-16 bg-white/50 backdrop-blur-sm border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Built with ❤️ using React & FastAPI</p>
            <p className="text-sm text-gray-500 mt-1">Scraping jobs from Naukri.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
