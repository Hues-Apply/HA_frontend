import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateParsedProfile, type ParsedCVData } from '../services/profile';

const OnboardingReview = () => {
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load parsed data from localStorage
    const storedData = sessionStorage.getItem('parsedCVData');
    if (storedData) {
      try {
        setParsedData(JSON.parse(storedData));
      } catch (err) {
        setError('Failed to load parsed data');
        // Redirect back to upload if no valid data
        navigate('/onboarding/step-2', { replace: true });
      }
    } else {
      // No parsed data available, redirect to upload
      navigate('/onboarding/step-2', { replace: true });
    }
  }, [navigate]);

  const handleFieldChange = (section: keyof ParsedCVData, field: string, value: any) => {
    if (!parsedData) return;
    
    setParsedData(prev => {
      if (!prev) return prev;
      
      if (section === 'personal_info') {
        return {
          ...prev,
          personal_info: {
            ...prev.personal_info,
            [field]: value
          }
        };
      } else if (section === 'skills') {
        return {
          ...prev,
          skills: value
        };
      } else if (section === 'summary') {
        return {
          ...prev,
          summary: value
        };
      }
      
      return prev;
    });
  };

  const handleArrayFieldChange = (section: 'education' | 'experience' | 'certifications' | 'languages', index: number, field: string, value: any) => {
    if (!parsedData) return;
    
    setParsedData(prev => {
      if (!prev) return prev;
      
      const updatedArray = [...prev[section]];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value
      };
      
      return {
        ...prev,
        [section]: updatedArray
      };
    });
  };

  const handleConfirm = async () => {
    if (!parsedData) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Save the reviewed data to backend
      await updateParsedProfile(parsedData);
      
      // Clear localStorage
      sessionStorage.removeItem('parsedCVData');
      
      // Navigate to success page and then dashboard
      navigate('/onboarding/complete', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to save profile data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!parsedData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-center mb-2">Review Your Profile Information</h1>
          <p className="text-center text-gray-600 mb-6">Please review and edit the information extracted from your CV</p>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  value={parsedData.personal_info.first_name || ''}
                  onChange={(e) => handleFieldChange('personal_info', 'first_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  value={parsedData.personal_info.last_name || ''}
                  onChange={(e) => handleFieldChange('personal_info', 'last_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={parsedData.personal_info.email || ''}
                  onChange={(e) => handleFieldChange('personal_info', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={parsedData.personal_info.phone || ''}
                  onChange={(e) => handleFieldChange('personal_info', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Professional Summary</h2>
            <textarea
              value={parsedData.summary || ''}
              onChange={(e) => handleFieldChange('summary', '', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Add a professional summary..."
            />
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Skills</h2>
            <textarea
              value={parsedData.skills.join(', ')}
              onChange={(e) => handleFieldChange('skills', '', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter skills separated by commas..."
            />
          </div>

          {/* Education */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Education</h2>
            {parsedData.education.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Work Experience</h2>
            {parsedData.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleArrayFieldChange('experience', index, 'position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={exp.description || ''}
                    onChange={(e) => handleArrayFieldChange('experience', index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => navigate('/onboarding/step-2')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Back to Upload
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Saving...' : 'Confirm & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingReview;
