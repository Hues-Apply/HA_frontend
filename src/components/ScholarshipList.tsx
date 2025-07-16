import { useState, useEffect } from 'react';
import { Clock, Bookmark as BookmarkIcon, MapPin, Building2, DollarSign } from 'lucide-react';
import { getScholarships } from '../services/scholarships';
import { useNavigate } from 'react-router-dom';

interface ScholarshipFilters {
  search?: string;
  type?: string;
  location?: string;
  ordering?: string;
  show_expired?: boolean;
  page?: number;
  page_size?: number;
}

interface ScholarshipListProps {
  filters: ScholarshipFilters;
  title: string;
}

interface Scholarship {
  id?: string | number;
  title: string;
  application_link?: string;
  source: string;
  amount?: string;
  deadline?: string;
  course?: string;
  gpa?: string;
  location: string;
  scraped_at?: string;
}

export default function ScholarshipList({ filters, title }: ScholarshipListProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedScholarships, setSavedScholarships] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPage(1); // Reset to first page when filters change
  }, [filters]);

  useEffect(() => {
    fetchScholarships();
  }, [filters, page]);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getScholarships({ ...filters, page });
      let raw: Scholarship[] = Array.isArray(data) ? data : (data && Array.isArray(data.results) ? data.results : []);
      // Only keep scholarships with source, title, and location
      const filtered = raw.filter(
        (sch) => sch.source && sch.title && sch.location
      );
      setScholarships(filtered);

      // Update pagination info
      if (!Array.isArray(data) && data) {
        setTotalCount(data.count || 0);
        setHasNext(!!data.next);
        setHasPrevious(!!data.previous);
      }
    } catch (err: any) {
      console.error('Failed to fetch scholarships:', err);
      setError(err.message || 'Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (scholarshipId: string) => {
    setSavedScholarships(prev => {
      const newSet = new Set(prev);
      if (newSet.has(scholarshipId)) {
        newSet.delete(scholarshipId);
      } else {
        newSet.add(scholarshipId);
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
            <p className="mb-4">Failed to load scholarships</p>
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={fetchScholarships}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Remove client-side pagination logic
  // const totalPages = Math.ceil(scholarships.length / pageSize);
  // const paginatedScholarships = scholarships.slice((page - 1) * pageSize, page * pageSize);

  if (scholarships.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-center py-10 text-gray-500">
            <p className="mb-4">No scholarships found</p>
            <p className="text-sm">Try adjusting your search filters or check back later for new scholarships.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scholarships.map((scholarship, idx) => {
          const key = scholarship.id || `${scholarship.source}-${scholarship.title}-${scholarship.location}-${idx}`;
          return (
            <div
              key={key}
              className="bg-white rounded-xl shadow p-4 relative hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => scholarship.id && navigate(`/dashboard/scholarships/${scholarship.id}`)}
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    scholarship.id && toggleSave(String(scholarship.id));
                  }}
                  className={`p-1 rounded ${scholarship.id && savedScholarships.has(String(scholarship.id))
                    ? 'text-blue-500'
                    : 'text-gray-400 hover:text-blue-500'
                    }`}
                  disabled={!scholarship.id}
                >
                  <BookmarkIcon size={18} fill={scholarship.id && savedScholarships.has(String(scholarship.id)) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="pr-8">
                <div className="text-lg font-bold mb-1 text-gray-800">{scholarship.title}</div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building2 size={14} className="mr-1" />
                  <span className="text-sm">{scholarship.source}</span>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-1" />
                    <span>{scholarship.location}</span>
                  </div>
                  {scholarship.amount && (
                    <div className="text-sm text-gray-600 flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      <span className="font-medium">Amount:</span> {scholarship.amount}
                    </div>
                  )}
                  {scholarship.course && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Course:</span> {scholarship.course}
                    </div>
                  )}
                  {scholarship.gpa && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">GPA:</span> {scholarship.gpa}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    <span>
                      {scholarship.deadline ? `Closes in ${formatDeadline(scholarship.deadline)}` : 'No deadline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Server-side Pagination Controls */}
      {(hasNext || hasPrevious) && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!hasPrevious}
            className={`px-3 py-1 rounded border ${!hasPrevious ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-green-600 hover:bg-green-50'}`}
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">
            Page {page} of {Math.ceil(totalCount / (filters.page_size || 20))}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNext}
            className={`px-3 py-1 rounded border ${!hasNext ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-green-600 hover:bg-green-50'}`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
