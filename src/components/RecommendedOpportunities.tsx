import { useState, useEffect } from 'react';
import { getAIMatches } from '../services/opportunities';
import { Opportunity } from '../services/opportunities';

interface RecommendedOpportunitiesProps {
  className?: string;
  filters?: any;
  title?: string;
}

export default function RecommendedOpportunities({
  className = '',
  filters = {},
  title = 'Recommended for You'
}: RecommendedOpportunitiesProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedOpportunities, setSavedOpportunities] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchRecommendedOpportunities();
    fetchSavedOpportunities();
  }, [filters]);

  const fetchRecommendedOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAIMatches(filters);
      setOpportunities(response.results || []);
    } catch (err) {
      setError('Failed to load recommended opportunities');
      console.error('Error fetching recommended opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedOpportunities = async () => {
    try {
      // This would typically call an API to get saved opportunities
      // For now, we'll use localStorage as a fallback
      const saved = sessionStorage.getItem('savedOpportunities');
      if (saved) {
        setSavedOpportunities(new Set(JSON.parse(saved)));
      }
    } catch (err) {
      console.error('Error fetching saved opportunities:', err);
    }
  };

  const toggleSave = async (opportunityId: string) => {
    try {
      const newSaved = new Set(savedOpportunities);
      if (newSaved.has(opportunityId)) {
        newSaved.delete(opportunityId);
      } else {
        newSaved.add(opportunityId);
      }
      setSavedOpportunities(newSaved);
      sessionStorage.setItem('savedOpportunities', JSON.stringify([...newSaved]));
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const handleApply = async (opportunityId: string) => {
    try {
      // This would typically call an API to apply
      console.log('Applying to opportunity:', opportunityId);
      // You can implement the actual apply logic here
    } catch (err) {
      console.error('Error applying to opportunity:', err);
    }
  };



  const getMatchColor = (percentage?: number) => {
    if (!percentage) return 'text-gray-500';
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="text-center text-gray-500">
          <p>{error}</p>
          <button
            onClick={fetchRecommendedOpportunities}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="text-center text-gray-500">
          <p>No recommendations available yet.</p>
          <p className="text-sm mt-1">Complete your profile to get personalized recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900 line-clamp-2">
                {opportunity.title}
              </h4>
              <button
                onClick={() => toggleSave(opportunity.id)}
                className={`ml-2 p-1 rounded-full hover:bg-gray-100 ${savedOpportunities.has(opportunity.id) ? 'text-blue-600' : 'text-gray-400'
                  }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-2">{opportunity.company}</p>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {opportunity.location}
                </span>
                {opportunity.salary_range && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {opportunity.salary_range}
                  </span>
                )}
              </div>

              {opportunity.match_percentage && (
                <span className={`text-sm font-medium ${getMatchColor(opportunity.match_percentage)}`}>
                  {opportunity.match_percentage}% match
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {opportunity.skills_required?.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {skill}
                  </span>
                ))}
                {opportunity.skills_required && opportunity.skills_required.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{opportunity.skills_required.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleApply(opportunity.id)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

