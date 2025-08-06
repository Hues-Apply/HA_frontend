import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Plus, Search, Trash2, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import { getScholarships } from '../services/scholarships';

interface Scholarship {
  id?: string | number;
  title: string;
  source: string;
  amount?: string;
  deadline?: string;
  location: string;
  course?: string;
  gpa?: string;
  scraped_at?: string;
  application_link?: string;
}

const AdminScholarshipsList: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [deleting, setDeleting] = useState<string | number | null>(null);
  const navigate = useNavigate();

  const pageSize = 20;

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    fetchScholarships();
  }, [page, searchTerm]);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching scholarships with:', { searchTerm, page, pageSize });
      
      const data = await getScholarships({
        search: searchTerm || undefined, 
        page,
        page_size: pageSize,
        show_expired: true
      });
      
      console.log('Received data:', data);
      
      let scholarshipsList: Scholarship[] = [];
      
      if (Array.isArray(data)) {
        scholarshipsList = data;
        setTotalCount(data.length);
        setHasNext(false);
        setHasPrevious(false);
      } else if (data && typeof data === 'object') {
        scholarshipsList = Array.isArray(data.results) ? data.results : [];
        setTotalCount(data.count || 0);
        setHasNext(!!data.next);
        setHasPrevious(!!data.previous);
      }
      
      const validScholarships = scholarshipsList.filter(
        (scholarship) => scholarship && scholarship.title && scholarship.source && scholarship.location
      );
      
      setScholarships(validScholarships);
      
    } catch (err: any) {
      console.error('Failed to fetch scholarships:', err);
      setError(err.message || 'Failed to load scholarships. Please check your API connection.');
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) {
      return;
    }
    
    try {
      setDeleting(id);
      
      const response = await fetch(`/api/scholarships/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }
      
      // Remove from local state immediately
      setScholarships(prev => prev.filter(s => s.id !== id));
      
      console.log('Scholarship deleted:', id);
      
    } catch (err: any) {
      console.error('Failed to delete scholarship:', err);
      alert('Failed to delete scholarship: ' + err.message);
      // Refresh data on error to ensure consistency
      await fetchScholarships();
    } finally {
      setDeleting(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const isExpired = (deadline?: string) => {
    if (!deadline) return false;
    try {
      return new Date(deadline) < new Date();
    } catch {
      return false;
    }
  };

  const handleViewDetails = (scholarship: Scholarship) => {
    if (scholarship.id) {
      navigate(`/dashboard/scholarships/${scholarship.id}`);
    } else {
      alert('Cannot view details - scholarship ID not available');
    }
  };

  const handleEdit = (scholarship: Scholarship) => {
    if (scholarship.id) {
      navigate(`/admin/scholarships/edit/${scholarship.id}`);
    } else {
      alert('Cannot edit - scholarship ID not available');
    }
  };

  if (loading && scholarships.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded mb-6 w-1/2"></div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="space-y-4 p-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Scholarships List
            {totalCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({totalCount} total)
              </span>
            )}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={fetchScholarships}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => navigate('/admin/scholarships/new')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add New
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg mb-6 p-4">
          <div className="flex items-center">
            <AlertCircle className="text-red-600 mr-3" size={20} />
            <div className="flex-1">
              <h3 className="text-red-800 font-medium">Error Loading Scholarships</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchScholarships}
              className="ml-4 px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && scholarships.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-blue-700 text-sm">
            Refreshing data...
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title & Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scholarships.map((scholarship, index) => {
                const key = scholarship.id || `scholarship-${index}`;
                const expired = isExpired(scholarship.deadline);
                
                return (
                  <tr key={key} className={`hover:bg-gray-50 ${expired ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {scholarship.title}
                          {expired && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Expired
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{scholarship.source}</div>
                        {!scholarship.id && (
                          <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded mt-1 inline-block">
                            No ID - Limited Actions
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{scholarship.location}</div>
                        {scholarship.amount && (
                          <div className="text-gray-600">Amount: {scholarship.amount}</div>
                        )}
                        {scholarship.course && (
                          <div className="text-gray-600">Course: {scholarship.course}</div>
                        )}
                        {scholarship.gpa && (
                          <div className="text-gray-600">GPA: {scholarship.gpa}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className={expired ? 'text-red-600 font-medium' : ''}>
                        {formatDate(scholarship.deadline)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(scholarship.scraped_at)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleViewDetails(scholarship)}
                          className="text-blue-600 hover:text-blue-900 p-1 disabled:opacity-50"
                          title="View Details"
                          disabled={!scholarship.id}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(scholarship)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 disabled:opacity-50"
                          title="Edit"
                          disabled={!scholarship.id}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => scholarship.id && handleDelete(scholarship.id)}
                          className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                          title="Delete"
                          disabled={!scholarship.id || deleting === scholarship.id}
                        >
                          {deleting === scholarship.id ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* No Data State */}
        {scholarships.length === 0 && !loading && !error && (
          <div className="text-center py-12 text-gray-500">
            <div className="mb-4">
              <Search size={48} className="mx-auto text-gray-300" />
            </div>
            <p className="text-lg mb-2">No scholarships found</p>
            <p className="text-sm mb-4">
              {searchTerm ? 
                `No results for "${searchTerm}". Try different search terms.` : 
                'Add your first scholarship to get started.'
              }
            </p>
            <button
              onClick={() => navigate('/admin/scholarships/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add First Scholarship
            </button>
          </div>
        )}

        {/* Pagination */}
        {(hasNext || hasPrevious || scholarships.length > 0) && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!hasPrevious || loading}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    !hasPrevious || loading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasNext || loading}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    !hasNext || loading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span>
                    {totalCount > 0 && (
                      <>
                        {' '}of <span className="font-medium">{Math.ceil(totalCount / pageSize)}</span>
                        {' '}(<span className="font-medium">{totalCount}</span> total scholarships)
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={!hasPrevious || loading}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        !hasPrevious || loading
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={!hasNext || loading}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        !hasNext || loading
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScholarshipsList;
