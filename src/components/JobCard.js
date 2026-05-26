import React from 'react';
import { Building, MapPin, Calendar, Clock, ExternalLink } from 'lucide-react';

const formatPostedDate = (posted) => {
  if (!posted || posted === 'N/A') return null;

  const parsedDate = new Date(posted);
  if (Number.isNaN(parsedDate.getTime())) return posted;

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const JobCard = ({ job, index }) => {
  const postedDate = formatPostedDate(job.posted);

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1 group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
              <Building className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">{job.company}</span>
            </div>
            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
              <MapPin className="w-4 h-4 mr-2 text-green-500" />
              <span>{job.location}</span>
            </div>
            {postedDate && (
              <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                <span>{postedDate}</span>
              </div>
            )}
            {job.experience && job.experience !== 'N/A' && (
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                <span className="font-medium">{job.experience}</span>
              </div>
            )}
          </div>
        </div>
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ml-4"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Job
        </a>
      </div>
    </div>
  );
};

export default JobCard;
