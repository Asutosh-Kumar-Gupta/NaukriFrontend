import React from 'react';
import { useSelector } from 'react-redux';
import { TrendingUp, MapPin, Clock, Building, ChevronUp, ChevronDown } from 'lucide-react';
import { getLocationDistribution, getExperienceDistribution, getTopCompanies } from '../utils/analytics';
import { selectUniqueLocations } from '../store/selectors';

const Analytics = ({ showAnalytics, setShowAnalytics }) => {
  const jobs = useSelector((state) => state.jobs.items);
  const uniqueLocations = useSelector(selectUniqueLocations);

  if (jobs.length === 0) return null;

  const locationDistribution = getLocationDistribution(jobs);
  const experienceDistribution = getExperienceDistribution(jobs);
  const topCompanies = getTopCompanies(jobs);

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
            <><ChevronUp className="w-4 h-4 mr-1" />Minimize</>
          ) : (
            <><ChevronDown className="w-4 h-4 mr-1" />Expand</>
          )}
        </button>
      </div>

      {showAnalytics && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DistributionCard
              title="Top Locations"
              icon={<MapPin className="w-4 h-4 mr-2 text-blue-600" />}
              theme="blue"
              data={locationDistribution}
              total={jobs.length}
            />
            <DistributionCard
              title="Experience Levels"
              icon={<Clock className="w-4 h-4 mr-2 text-green-600" />}
              theme="green"
              data={experienceDistribution}
              total={jobs.length}
            />
            <DistributionCard
              title="Top Hiring Companies"
              icon={<Building className="w-4 h-4 mr-2 text-purple-600" />}
              theme="purple"
              data={topCompanies}
              total={jobs.length}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryTile label="Most Popular Location" value={locationDistribution[0]?.[0] || 'N/A'} />
            <SummaryTile label="Common Experience" value={experienceDistribution[0]?.[0] || 'N/A'} />
            <SummaryTile label="Top Recruiter" value={topCompanies[0]?.[0] || 'N/A'} />
            <SummaryTile label="Market Diversity" value={`${uniqueLocations.length} cities`} />
          </div>
        </>
      )}
    </div>
  );
};

const themeMap = {
  blue: { bg: 'from-blue-50 to-blue-100', bar: 'bg-blue-200', fill: 'bg-blue-600', text: 'text-blue-600' },
  green: { bg: 'from-green-50 to-green-100', bar: 'bg-green-200', fill: 'bg-green-600', text: 'text-green-600' },
  purple: { bg: 'from-purple-50 to-purple-100', bar: 'bg-purple-200', fill: 'bg-purple-600', text: 'text-purple-600' },
};

const DistributionCard = React.memo(({ title, icon, theme, data, total }) => {
  const { bg, bar, fill, text } = themeMap[theme];
  return (
    <div className={`bg-gradient-to-br ${bg} rounded-lg p-4`}>
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
        {icon}{title}
      </h3>
      <div className="space-y-2">
        {data.map(([label, count]) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-sm text-gray-700 truncate">{label}</span>
            <div className="flex items-center">
              <div className={`w-16 h-2 ${bar} rounded-full mr-2`}>
                <div className={`h-2 ${fill} rounded-full`} style={{ width: `${(count / total) * 100}%` }} />
              </div>
              <span className={`text-xs font-medium ${text}`}>{count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const SummaryTile = React.memo(({ label, value }) => (
  <div className="bg-white rounded-lg p-3 border border-gray-200">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
));

export default Analytics;
