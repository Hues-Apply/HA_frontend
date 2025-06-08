import { useState, useEffect } from "react";
import { RecommendedOpportunity, getRecommendedOpportunities, OpportunitiesParams, trackOpportunityView } from "../services/opportunities";
import { Link } from "react-router-dom";

interface RecommendedOpportunitiesProps {
  filters?: OpportunitiesParams;
}

export default function RecommendedOpportunities({ filters = {} }: RecommendedOpportunitiesProps) {
  const [opportunities, setOpportunities] = useState<RecommendedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch recommended opportunities
  useEffect(() => {
    const fetchRecommended = async () => {
      setLoading(true);
      setError("");
      
      try {
        const result = await getRecommendedOpportunities({
          ...filters,
          page_size: 5,
          ordering: '-score'
        });
        
        setOpportunities(result.results);
      } catch (err) {
        console.error("Failed to fetch recommended opportunities:", err);
        setError("Failed to load recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommended();
  }, [JSON.stringify(filters)]);
  
  // Track opportunity view
  const handleOpportunityClick = async (id: number) => {
    try {
      await trackOpportunityView(id);
    } catch (error) {
      console.error("Failed to track view:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
        <div className="text-center py-8 text-gray-500">
          No recommendations available yet. Complete your profile to get personalized recommendations.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
      
      <div className="space-y-4">
        {opportunities.map((item) => {
          const opportunity = item.opportunity;
          
          return (
            <div 
              key={opportunity.id} 
              className="border rounded-lg p-4 hover:shadow-md transition relative"
              onClick={() => handleOpportunityClick(opportunity.id)}
            >
              <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {Math.round(item.score * 100)}% match
              </div>
              
              <Link to={`/opportunities/${opportunity.id}`} className="block">
                <h3 className="font-semibold text-lg pr-24">{opportunity.title}</h3>
                <p className="text-gray-600">{opportunity.organization}</p>
                
                {item.match_reasons.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">Why we recommended this:</p>
                    <ul className="list-disc list-inside text-sm text-gray-500 ml-2">
                      {item.match_reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-gray-500">
                    {opportunity.location} {opportunity.is_remote ? '(Remote)' : ''}
                  </span>
                  <span className="text-blue-600 font-medium">
                    View details →
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <Link to="/recommendations" className="text-blue-500 hover:underline">
          View all recommendations
        </Link>
      </div>
    </div>
  );
}
