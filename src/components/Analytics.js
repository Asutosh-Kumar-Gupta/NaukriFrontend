import React from 'react';
import { TrendingUp, MapPin, Clock, Building, ChevronUp, ChevronDown } from 'lucide-react';
import { getLocationDistribution, getExperienceDistribution, getTopCompanies, getUniqueLocations } from '../utils/analytics';

const Analytics = ({ jobs, showAnalytics, setShowAnalytics }) => {
  if (jobs.length === 0) return null;

  const locationDistribution = getLocationDistribution(jobs);
  const experienceDistribution = getExperienceDistribution(jobs);
  const topCompanies = getTopCompanies(jobs);
  const uniqueLocations = getUniqueLocations(jobs);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
          Job Market Analytics
        </h2>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {showAnalytics ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Minimize
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Expand
            </>
          )}
        </button>
      </div>
      
      {showAnalytics && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                Top Locations
              </h3>
              <div className="space-y-2">
                {locationDistribution.map(([location, count]) => (
                  <div key={location} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 truncate">{location}</span>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-blue-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
                          style={{ width: `${(count / jobs.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-blue-600">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-green-600" />
                Experience Levels
              </h3>
              <div className="space-y-2">
                {experienceDistribution.map(([range, count]) => (
                  <div key={range} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{range}</span>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-green-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-green-600 rounded-full" 
                          style={{ width: `${(count / jobs.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-green-600">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Building className="w-4 h-4 mr-2 text-purple-600" />
                Top Hiring Companies
              </h3>
              <div className="space-y-2">
                {topCompanies.map(([company, count]) => (
                  <div key={company} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 truncate">{company}</span>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-purple-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-purple-600 rounded-full" 
                          style={{ width: `${(count / jobs.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-purple-600">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500">Most Popular Location</p>
              <p className="font-semibold text-gray-800">{locationDistribution[0]?.[0] || 'N/A'}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500">Common Experience</p>
              <p className="font-semibold text-gray-800">{experienceDistribution[0]?.[0] || 'N/A'}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500">Top Recruiter</p>
              <p className="font-semibold text-gray-800">{topCompanies[0]?.[0] || 'N/A'}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500">Market Diversity</p>
              <p className="font-semibold text-gray-800">{uniqueLocations.length} cities</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;