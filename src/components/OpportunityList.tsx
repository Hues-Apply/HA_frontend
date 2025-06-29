import { useState, useEffect } from 'react';
import { Clock, Bookmark as BookmarkIcon, MapPin, Building2 } from 'lucide-react';
import { getOpportunities } from '../services/opportunities';

interface OpportunityFilters {
  search?: string;
  type?: string;
  location?: string;
  ordering?: string;
  show_expired?: boolean;
}

interface OpportunityListProps {
  filters: OpportunityFilters;
  title: string;
}

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary_range: string;
  deadline: string;
  created_at: string;
  is_active: boolean;
  match_percentage?: number;
}

export default function OpportunityList({ filters, title }: OpportunityListProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedOpportunities, setSavedOpportunities] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOpportunities();
  }, [filters]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOpportunities(filters);
      setOpportunities(data.results || []);
    } catch (err: any) {
      console.error('Failed to fetch opportunities:', err);
      setError(err.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (opportunityId: string) => {
    setSavedOpportunities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(opportunityId)) {
        newSet.delete(opportunityId);
      } else {
        newSet.add(opportunityId);
      }
      return newSet;
    });
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const getMatchColor = (percentage?: number) => {
    if (!percentage) return 'bg-gray-100 text-gray-600';
    if (percentage >= 80) return 'bg-green-100 text-green-700';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  if (loading) {
    return (
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-center py-10 text-red-500">
            <p className="mb-4">Failed to load opportunities</p>
            <p className="text-sm text-gray-500">{error}</p>
            <button 
              onClick={fetchOpportunities}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (opportunities.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-center py-10 text-gray-500">
            <p className="mb-4">No opportunities found</p>
            <p className="text-sm">Try adjusting your search filters or check back later for new opportunities.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="bg-white rounded-xl shadow p-4 relative hover:shadow-lg transition-shadow">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => toggleSave(opportunity.id)}
                className={`p-1 rounded ${
                  savedOpportunities.has(opportunity.id) 
                    ? 'text-blue-500' 
                    : 'text-gray-400 hover:text-blue-500'
                }`}
              >
                <BookmarkIcon size={18} fill={savedOpportunities.has(opportunity.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <div className="pr-8">
              <div className="text-lg font-bold mb-1 text-gray-800">{opportunity.title}</div>
              <div className="flex items-center text-gray-600 mb-2">
                <Building2 size={14} className="mr-1" />
                <span className="text-sm">{opportunity.company}</span>
              </div>
              
              {opportunity.match_percentage && (
                <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-3 ${getMatchColor(opportunity.match_percentage)}`}>
                  {opportunity.match_percentage}% Match
                </div>
              )}
              
              <div className="space-y-1 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={14} className="mr-1" />
                  <span>{opportunity.location}</span>
                </div>
                {opportunity.salary_range && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Salary:</span> {opportunity.salary_range}
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-700 mb-3 line-clamp-2">
                {opportunity.description}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  <span>Closes in {formatDeadline(opportunity.deadline)}</span>
                </div>
                <button className="bg-blue-500 text-white text-sm px-4 py-1 rounded hover:bg-blue-600 transition-colors">
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
