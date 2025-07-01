import React from 'react';
import { CareerProfile } from '../hooks/useProfileData';

interface CareerProfileTabProps {
  careerProfile: CareerProfile;
  setCareerProfile: React.Dispatch<React.SetStateAction<CareerProfile>>;
}

const CareerProfileTab: React.FC<CareerProfileTabProps> = ({ careerProfile, setCareerProfile }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <input
            type="text"
            value={careerProfile.industry}
            onChange={(e) => setCareerProfile({...careerProfile, industry: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input
            type="text"
            value={careerProfile.jobTitle}
            onChange={(e) => setCareerProfile({...careerProfile, jobTitle: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Summary</label>
        <textarea
          value={careerProfile.profileSummary}
          onChange={(e) => setCareerProfile({...careerProfile, profileSummary: e.target.value})}
          rows={5}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default CareerProfileTab;
