import { useState, useEffect } from "react";
import { Opportunity, getOpportunities, OpportunitiesParams, trackOpportunityView } from "../services/opportunities";
import { Link } from "react-router-dom";

interface OpportunityListProps {
  filters?: OpportunitiesParams;
  title?: string;
}

export default function OpportunityList({ 
  filters = {}, 
  title = "Latest Opportunities"
}: OpportunityListProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  
  // Fetch opportunities with current filters and page
  const fetchOpportunitiesData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const result = await getOpportunities({
        ...filters,
        page: currentPage,
        page_size: 10
      });
      
      setOpportunities(result.results);
      setTotalCount(result.count);
      setNextPageUrl(result.next);
      setPrevPageUrl(result.previous);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
      setError("Failed to load opportunities. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Track opportunity view
  const handleOpportunityClick = async (id: number) => {
    try {
      await trackOpportunityView(id);
    } catch (error) {
      console.error("Failed to track view:", error);
      // Don't show error to user since tracking is non-critical
    }
  };
  
  // Fetch data when filters or page changes
  useEffect(() => {
    fetchOpportunitiesData();
  }, [currentPage, JSON.stringify(filters)]);
  
  // Handle pagination
  const handleNextPage = () => {
    if (nextPageUrl) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (prevPageUrl) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No opportunities found matching your criteria.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <div 
                key={opportunity.id} 
                className="border rounded-lg p-4 hover:shadow-md transition"
                onClick={() => handleOpportunityClick(opportunity.id)}
              >
                <Link to={`/opportunities/${opportunity.id}`} className="block">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                      <p className="text-gray-600">{opportunity.organization}</p>
                    </div>
                    <div className="text-sm">
                      {opportunity.is_remote ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Remote
                        </span>
                      ) : (
                        <span className="text-gray-600">{opportunity.location}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {opportunity.type}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                      {opportunity.category.name}
                    </span>
                    {opportunity.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag.slug} 
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex justify-between text-sm">
                    <p className="text-gray-500">
                      Posted by: {opportunity.posted_by}
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="text-red-500">
                        Deadline: {formatDate(opportunity.deadline)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {opportunities.length} of {totalCount} opportunities
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={!prevPageUrl}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!nextPageUrl}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
