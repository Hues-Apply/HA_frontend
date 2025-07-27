import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { GraduationCap, MapPin, Award, User } from 'lucide-react';
import { getProfileCompletionStatus } from '../services/profile';

interface ProfileCompletionProps {
  className?: string;
  context?: 'general' | 'scholarship'; // Add context prop
  isScholarshipPage?: boolean; // Legacy prop support
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
  const navigate = useNavigate();

  // Determine if this is being used in scholarship context
  const isScholarshipContext = context === 'scholarship' || isScholarshipPage;

  useEffect(() => {
    const fetchCompletionStatus = async () => {
      try {
        // This would be your actual API call
        // const status = await getProfileCompletionStatus();
        
        // Mock data for demonstration
        const status = {
          completion_percentage: 65,  
          missing_sections: ['education', 'experience', 'personal_info'],
          completed_sections: ['career_profile', 'projects']
        };
        
        setCompletionStatus(status);
      } catch (error) {
        console.error('Failed to fetch profile completion status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletionStatus();
  }, []);

  const getScholarshipSpecificSections = (missingSections: string[]) => {
    // Map scholarship-relevant sections
    const scholarshipRelevantSections = {
      'personal_info': { icon: User, label: 'Personal Information', priority: 'high' },
      'education': { icon: GraduationCap, label: 'Education Details', priority: 'high' },
      'experience': { icon: Award, label: 'Experience', priority: 'medium' },
      'career_profile': { icon: MapPin, label: 'Career Profile', priority: 'medium' }
    };

    return missingSections
      .filter(section => scholarshipRelevantSections[section])
      .map(section => ({
        ...scholarshipRelevantSections[section],
        key: section
      }))
      .sort((a, b) => a.priority === 'high' ? -1 : 1);
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
                  className={`flex items-center px-3 py-2 rounded-lg border ${
                    section.priority === 'high' 
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
        className={`w-full py-2 px-4 rounded-md transition-colors ${
          isScholarshipContext 
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