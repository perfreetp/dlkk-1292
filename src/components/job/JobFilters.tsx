import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cities, industries } from '../../utils/mockData';
import { useJobStore } from '../../stores/jobStore';
import { Button } from '../common/Button';

export const JobFilters: React.FC = () => {
  const { filters, setFilters, clearFilters } = useJobStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = filters.city || filters.industry || filters.keyword;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索职位、公司..."
            value={filters.keyword || ''}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => setIsExpanded(!isExpanded)}
          className="sm:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          筛选
          {hasActiveFilters && (
            <span className="ml-2 w-2 h-2 bg-accent rounded-full"></span>
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 animate-fadeIn">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
            <select
              value={filters.city || ''}
              onChange={(e) => setFilters({ ...filters, city: e.target.value || undefined })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            >
              <option value="">全部城市</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">行业</label>
            <select
              value={filters.industry || ''}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value || undefined })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            >
              <option value="">全部行业</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600">当前筛选：</span>
          {filters.city && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
              {filters.city}
              <button
                onClick={() => setFilters({ ...filters, city: undefined })}
                className="ml-1 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.industry && (
            <span className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
              {filters.industry}
              <button
                onClick={() => setFilters({ ...filters, industry: undefined })}
                className="ml-1 hover:text-purple-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.keyword && (
            <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
              "{filters.keyword}"
              <button
                onClick={() => setFilters({ ...filters, keyword: '' })}
                className="ml-1 hover:text-green-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="ml-auto text-sm text-gray-500 hover:text-gray-700"
          >
            清除全部
          </button>
        </div>
      )}
    </div>
  );
};
