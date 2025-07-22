import { useState, useEffect } from 'react';
import { Clock, Bookmark as BookmarkIcon, MapPin, Building2 } from 'lucide-react';
import { getOpportunities } from '../services/opportunities';
import { applyToOpportunity } from '../services/opportunities';

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
  company: string;
  title: string;
  location: string;
  link?: string;
  id?: string;
  type?: string;
  description?: string;
  requirements?: string[];
  salary_range?: string;
  deadline?: string;
  created_at?: string;
  is_active?: boolean;
  match_percentage?: number;
  application_url?: string;
  skills_required?: string[];
  experience_level?: string;
  employment_type?: string;
}

// Utility to extract href from HTML anchor string
function extractHref(htmlString?: string) {
  if (!htmlString) return null;
  const match = htmlString.match(/href=['"]([^'"]+)['"]/);
  return match ? match[1] : null;
}

async function getAppliedOpportunities(): Promise<Set<string>> {
  try {
    const res = await fetch('/api/opportunities/applications/', { credentials: 'include' });
    const data = await res.json();
    if (data && data.applications) {
      return new Set(data.applications.map((a: any) => String(a.opportunity_id)));
    }
  } catch (e) { }
  return new Set();
}

export default function OpportunityList({ filters, title }: OpportunityListProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedOpportunities, setSavedOpportunities] = useState<Set<string>>(new Set());
  const [appliedOpportunities, setAppliedOpportunities] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const pageSize = isMobile ? 3 : 6;
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);


  useEffect(() => {
    setPage(1); // Reset to first page when filters change
  }, [filters]);

  useEffect(() => {
    fetchOpportunities();
  }, [filters, page]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    getAppliedOpportunities().then(setAppliedOpportunities);
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOpportunities(filters);
      // Accept both array and object with results property, filter for required fields
      let raw: Opportunity[] = Array.isArray(data) ? data : (data && Array.isArray(data.results) ? data.results : []);
      // Only keep opportunities with company, title, location, and link
      const filtered = raw.filter(
        (opp) => opp.company && opp.title && opp.location && opp.link
      );
      setOpportunities(filtered);
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

  const handleApplyClick = (opportunityId: string) => {
    setSelectedOpportunityId(opportunityId);
    setShowApplyModal(true);
    setApplyError(null);
  };

  const handleConfirmApply = async () => {
    if (!selectedOpportunityId) return;
    setApplyLoading(true);
    setApplyError(null);
    try {
      await applyToOpportunity(selectedOpportunityId);
      setAppliedOpportunities(prev => new Set(prev).add(selectedOpportunityId));
      setShowApplyModal(false);
    } catch (err: any) {
      setApplyError(err?.message || 'Failed to apply.');
    } finally {
      setApplyLoading(false);
    }
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

  // Pagination logic
  const totalPages = Math.ceil(opportunities.length / pageSize);
  const paginatedOpportunities = opportunities.slice((page - 1) * pageSize, page * pageSize);

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
        {paginatedOpportunities.map((opportunity, idx) => {
          // Use a fallback key if id is missing
          const key = opportunity.id || `${opportunity.company}-${opportunity.title}-${opportunity.location}-${(page - 1) * pageSize + idx}`;
          const isApplied = opportunity.id && appliedOpportunities.has(String(opportunity.id));
          return (
            <div key={key} className="bg-white rounded-xl shadow p-4 relative hover:shadow-lg transition-shadow">
              {/* Applied badge */}
              {opportunity.id && isApplied && (
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">Applied</div>
              )}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => opportunity.id && toggleSave(opportunity.id)}
                  className={`p-1 rounded ${opportunity.id && savedOpportunities.has(opportunity.id)
                    ? 'text-blue-500'
                    : 'text-gray-400 hover:text-blue-500'
                    }`}
                  disabled={!opportunity.id}
                >
                  <BookmarkIcon size={18} fill={opportunity.id && savedOpportunities.has(opportunity.id) ? 'currentColor' : 'border-blue'} />
                </button>
              </div>

              <div className="pr-8">
                <div className="text-lg font-bold mb-1 text-gray-800">{opportunity.title}</div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building2 size={14} className="mr-1" />
                  <span className="text-sm">{opportunity.company}</span>
                </div>

                {typeof opportunity.match_percentage === 'number' && (
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

                {opportunity.description && (
                  <div className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {opportunity.description}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    <span>
                      {opportunity.deadline ? `Closes in ${formatDeadline(opportunity.deadline)}` : 'No deadline'}
                    </span>
                  </div>
                  {opportunity.link ? (
                    <a
                      href={extractHref(opportunity.link) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white text-sm px-4 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      Apply
                    </a>
                  ) : (
                    <button
                      className="bg-gray-300 text-gray-600 text-sm px-4 py-1 rounded cursor-not-allowed"
                      disabled
                    >
                      No Link
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pagination Controls: Only Previous and Next */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded border ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded border ${page === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
          >
            Next
          </button>
        </div>
      )}
      {/* Apply Confirmation Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Application</h3>
            <p className="mb-4">Are you sure you want to apply for this opportunity?</p>
            {applyError && <div className="text-red-500 text-sm mb-2">{applyError}</div>}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setShowApplyModal(false)}
                disabled={applyLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleConfirmApply}
                disabled={applyLoading}
              >
                {applyLoading ? 'Applying...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
