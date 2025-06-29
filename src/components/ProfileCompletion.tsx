import { useState, useEffect } from 'react';
import { getProfileCompletionStatus } from '../services/profile';

interface ProfileCompletionProps {
  className?: string;
}

interface CompletionStatus {
  completion_percentage: number;
  missing_sections: string[];
  completed_sections: string[];
}

const ProfileCompletion = ({ className = '' }: ProfileCompletionProps) => {
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompletionStatus = async () => {
      try {
        const status = await getProfileCompletionStatus();
        setCompletionStatus(status);
      } catch (error) {
        console.error('Failed to fetch profile completion status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletionStatus();
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!completionStatus) {
    return null;
  }

  const { completion_percentage, missing_sections } = completionStatus;

  // Don't show if profile is complete
  if (completion_percentage >= 100) {
    return null;
  }

  const getColorByPercentage = (percentage: number) => {
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Complete Your Profile</h3>
        <span className="text-2xl font-bold text-blue-600">{completion_percentage}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className={`h-3 rounded-full transition-all duration-300 ${getColorByPercentage(completion_percentage)}`}
          style={{ width: `${completion_percentage}%` }}
        ></div>
      </div>

      <p className="text-gray-600 mb-4">
        Complete your profile to get better opportunity matches and increase your visibility to employers.
      </p>

      {/* Missing Sections */}
      {missing_sections.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Missing sections:</h4>
          <div className="flex flex-wrap gap-2">
            {missing_sections.map((section, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
              >
                {section.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
          </div>
        </div>
      )}

      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
        Update Profile
      </button>
    </div>
  );
};

export default ProfileCompletion;
