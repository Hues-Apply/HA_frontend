import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, MapPin, User, Briefcase } from 'lucide-react';
import { getProfileCompletionStatus } from '../services/profile';

interface ProfileCompletionProps {
  className?: string;
  context?: 'general' | 'scholarship';
  isScholarshipPage?: boolean;
}

interface CompletionStatus {
  completion_percentage: number;
  missing_sections: string[];
  completed_sections: string[];
}

const ProfileCompletion = ({
  className = '',
  context = 'general',
  isScholarshipPage = false
}: ProfileCompletionProps) => {
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Determine if this is being used in scholarship context
  const isScholarshipContext = context === 'scholarship' || isScholarshipPage;

  useEffect(() => {
    const fetchCompletionStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Make actual API call
        const status = await getProfileCompletionStatus();
        setCompletionStatus(status);
      } catch (error) {
        console.error('Failed to fetch profile completion status:', error);
        setError('Failed to load profile completion status. Please try again later.');

        // Fallback to empty state if API fails
        setCompletionStatus({
          completion_percentage: 0,
          missing_sections: [],
          completed_sections: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletionStatus();
  }, []);

  const getScholarshipSpecificSections = (missingSections: string[]) => {
    const scholarshipRelevantSections: Record<string, { icon: any; label: string; priority: string }> = {
      'personal_info': { icon: User, label: 'Personal Information', priority: 'high' },
      'education': { icon: GraduationCap, label: 'Education', priority: 'high' },
      'experience': { icon: Briefcase, label: 'Experience', priority: 'medium' },
      'career_profile': { icon: MapPin, label: 'Career Profile', priority: 'medium' }
    };

    return missingSections
      .filter(section => scholarshipRelevantSections[section])
      .map(section => ({
        ...scholarshipRelevantSections[section],
        key: section
      }))
      .sort((a, _b) => a.priority === 'high' ? -1 : 1);
  };

  const getContextualContent = () => {
    if (isScholarshipContext) {
      return {
        title: 'Complete Profile for Better Scholarship Matches',
        description: 'Complete your profile to get more accurate scholarship recommendations and increase your chances of finding relevant opportunities.',
        buttonText: 'Complete Profile for Scholarships',
        urgencyText: 'Many scholarships require detailed academic and personal information'
      };
    }

    return {
      title: 'Complete Your Profile',
      description: 'Complete your profile to get better opportunity matches and increase your visibility to employers.',
      buttonText: 'Update Profile',
      urgencyText: null
    };
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-2 bg-gray-200 rounded mb-4"></div>
          <div className="h-3 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Profile Status</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
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

  const contextContent = getContextualContent();
  const scholarshipSections = isScholarshipContext ? getScholarshipSpecificSections(missing_sections) : [];

  const getColorByPercentage = (percentage: number) => {
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getBorderColor = () => {
    if (isScholarshipContext) {
      return completion_percentage < 50 ? 'border-orange-500' : 'border-blue-500';
    }
    return 'border-blue-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getBorderColor()} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{contextContent.title}</h3>
        <span className="text-2xl font-bold text-blue-600">{completion_percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${getColorByPercentage(completion_percentage)}`}
          style={{ width: `${completion_percentage}%` }}
          role="progressbar"
          aria-valuenow={completion_percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>

      <p className="text-gray-600 mb-4">
        {contextContent.description}
      </p>

      {/* Scholarship-specific urgency message */}
      {isScholarshipContext && contextContent.urgencyText && completion_percentage < 70 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <GraduationCap className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0" />
            <p className="text-orange-800 text-sm font-medium">
              {contextContent.urgencyText}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Missing Sections for Scholarship Context */}
      {isScholarshipContext && scholarshipSections.length > 0 ? (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Critical for scholarship matching:</h4>
          <div className="space-y-2">
            {scholarshipSections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.key}
                  className={`flex items-center px-3 py-2 rounded-lg border ${section.priority === 'high'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                    }`}
                >
                  <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">{section.label}</span>
                  {section.priority === 'high' && (
                    <span className="ml-auto text-xs font-bold">Required</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : missing_sections.length > 0 && (
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

      <button
        onClick={() => navigate('/profile')}
        className={`w-full py-2 px-4 rounded-md transition-colors ${isScholarshipContext
          ? 'bg-orange-500 hover:bg-orange-600 text-white'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
      >
        {contextContent.buttonText}
      </button>
    </div>
  );
};

export default ProfileCompletion;
