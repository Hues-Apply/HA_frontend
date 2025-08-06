import React, { useState } from 'react';
import { CareerProfile } from '../hooks/useProfileData';
import { uploadDocument } from '../services/profile';

interface CareerProfileTabProps {
  careerProfile: CareerProfile;
  setCareerProfile: (profile: CareerProfile) => void;
  cvFile?: {
    filename?: string;
    uploadedAt?: string;
    hasCvInGcs?: boolean;
    downloadUrl?: string;
  };
  onCvUpload?: (cvData: any) => void;
  validationErrors?: string[];
}

const CareerProfileTab: React.FC<CareerProfileTabProps> = ({
  careerProfile,
  setCareerProfile,
  cvFile,
  onCvUpload,
  validationErrors = []
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await uploadDocument(file);
      if (response.success && onCvUpload) {
        onCvUpload(response);
      }
    } catch (error) {
      console.error('Failed to upload CV:', error);
      alert('Failed to upload CV. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFieldChange = (field: keyof CareerProfile, value: string) => {
    setCareerProfile({ ...careerProfile, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Validation Errors Display */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CV Upload Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">CV/Resume</h3>

        {cvFile?.filename ? (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{cvFile.filename}</p>
                {cvFile.uploadedAt && (
                  <p className="text-xs text-gray-500">
                    Uploaded {new Date(cvFile.uploadedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            {cvFile.downloadUrl && (
              <a
                href={cvFile.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View
              </a>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-2">Upload your CV/Resume</p>
            <p className="text-xs text-gray-500 mb-4">PDF, DOC, or DOCX files accepted</p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Choose File'}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Career Profile Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={careerProfile.industry}
              onChange={(e) => handleFieldChange('industry', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Technology, Healthcare, Finance"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={careerProfile.jobTitle}
              onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Software Engineer, Marketing Manager"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Summary <span className="text-red-500">*</span>
          </label>
          <textarea
            value={careerProfile.profileSummary}
            onChange={(e) => handleFieldChange('profileSummary', e.target.value)}
            rows={5}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write a brief summary of your professional background, skills, and career objectives..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {careerProfile.profileSummary.length}/2000 characters
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerProfileTab;
