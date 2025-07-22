import { useState, useEffect } from "react";
import { Clock, Bookmark as BookmarkIcon, MapPin, Building2, DollarSign, Star, Target } from "lucide-react";
import { useNavigate, useNavigation } from 'react-router-dom';
import { getScholarshipApplicationStatus, getAIMatchedScholarships, Scholarship, ScholarshipFilters, toggleSaveScholarship } from '../services/scholarships';

interface MatchedScholarship extends Scholarship {
  match_score?: number;
  matched_parameters?: string[];
  rank?: number;
}

interface RecommendedScholarshipsProps {
    className?: string;
}

export default function RecommendedScholarships({ className = ''}: RecommendedScholarshipsProps) {
    const [scholarships, setScholarships] = useState<MatchedScholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savedScholarships, setSavedScholarships] = useState<Set<string>>(new Set());
    const [appliedScholarships, setAppliedScholarships] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecommendedScholarships();
        fetchApplicationStatus();
    }, []);

    const fetchRecommendedScholarships = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getAIMatchedScholarships();

            const rankeData = data.results.map((scholarship, index) => ({
                ...scholarship,
                rank: (scholarship as any).rank || index + 1
            })) as MatchedScholarship[];

            setScholarships(rankeData);
        } catch (err: any) {
            console.error('Failed to fetch recommended scholarships.', error);
            setError(err.message || 'Failed to load recommendations.');
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicationStatus = async () => {
        try {
            const res = await getScholarshipApplicationStatus();
            
            if(res && res.applications) {
                setAppliedScholarships(new Set(
                    res.applications
                    .filter((a: any) => (a.scholarship?.id || a.sholarship_id) && a.applied)
                    .map((a: any) => String(a.scholarship?.id || a.scholarship_id))
                ));
            }
        } catch (error) {
            console.error('Failed to fetch application status. ', error);
        }
    };

    const toggleSave = async (scholarshipId: string) => {
        try {
            const result = await toggleSaveScholarship(scholarshipId);
            setSavedScholarships(prev => {
                const newSet = new Set(prev);
                if(result.is_saved) {
                    newSet.add(scholarshipId);
                } else {
                    newSet.delete(scholarshipId);
                }
                return newSet;
            });
        } catch (error) {
            console.error('Failed to toggle save status.', error);
        }
    };

    const formatDeadline = (deadline: string) => {
        const date = new Date(deadline);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if(diffDays < 0)
            return 'Expired';
    
        if(diffDays === 0)
            return 'Today';

        if(diffDays === 1)
            return 'Tomorrow';

        return `${diffDays} days`;
    };

    const getMatchColor = (score?: number) => {
        if(!score)
            return 'bg-gray-100 text-gray-600';

        if(score >= 80)
            return 'bg-green-100 text-green-700';

        if(score >= 60)
            return 'bg-red-100 text-red-700';
    };

    const getMatchLabel = (score?: number) => {
        if(!score)
            return 'No match date';

        if(score >= 80)
            return 'Excellent Match';

        if(score >= 60)
            return 'Good Match';

        return 'Fair Match';
    };

    if(loading) {
        return (
            <section className={`mb-10 ${className}`}>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Star className="mr-2 text-yellow-500" size={20} />
                    Recommended Scholarships
                </h2>
                
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

    if(error) {
        return(
            <section className={`mb-10 ${className}`}>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Star className="mr-2 text-yellow-500" size={20} />
                    Recommended Scholarships
                </h2>
                <div className="bg-white rounded-lg p-6 shadow-md">
                    <div className="text-center py-10 text-red-500">
                        <p className="mb-4">Failed to load recommendations</p>
                        <p className="text-sm text-gray-500">
                            {error}
                        </p>
                        <button
                            onClick={fetchRecommendedScholarships}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if(scholarships.length === 0) {
        return(
            <section className={`mb-10 ${className}`}>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Star className="mr-2 text-yellow-500" size={20} />
                    Recommended Scholarships
                </h2>
                <div className="bg-white rounded-lg p-6 shadow-md">
                    <div className="text-center py-10 text-gray-500">
                        <p className="mb-4">No recommendations available</p>
                        <p className="text-sm">Complete your profile to get personalized scholarship recommendations.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
    <section className={`mb-10 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Star className="mr-2 text-yellow-500" size={20} />
        Recommended Scholarships
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scholarships.map((scholarship, idx) => {
          const key = scholarship.id || `rec-${scholarship.source}-${scholarship.title}-${idx}`;
          return (
            <div
              key={key}
              className="bg-white rounded-xl shadow p-4 relative hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-yellow-500"
              onClick={() => scholarship.id && navigate(`/dashboard/scholarships/${scholarship.id}`)}
            >
              {/* Rank badge */}
              <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                #{scholarship.rank}
              </div>

              {/* Applied badge */}
              {scholarship.id && appliedScholarships.has(String(scholarship.id)) && (
                <div className="absolute top-3 left-12 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Applied
                </div>
              )}

              {/* Save button */}
              <div className="absolute top-3 right-3">
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

              <div className="pt-6 pr-8">
                {/* Match Score */}
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3 ${getMatchColor(scholarship.match_score)}`}>
                  <Target size={12} className="mr-1" />
                  {scholarship.match_score}% - {getMatchLabel(scholarship.match_score)}
                </div>

                {/* Title and Source */}
                <div className="text-lg font-bold mb-1 text-gray-800">{scholarship.title}</div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building2 size={14} className="mr-1" />
                  <span className="text-sm">{scholarship.source}</span>
                </div>

                {/* Basic Info */}
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

                {/* Matched Parameters */}
                {scholarship.matched_parameters && scholarship.matched_parameters.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-1">Matched on:</div>
                    <div className="flex flex-wrap gap-1">
                      {scholarship.matched_parameters.slice(0, 3).map((param, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                        >
                          {param}
                        </span>
                      ))}
                      {scholarship.matched_parameters.length > 3 && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          +{scholarship.matched_parameters.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Deadline */}
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
    </section>
    );
}
