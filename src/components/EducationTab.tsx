import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Education } from '../hooks/useProfileData';

interface EducationTabProps {
  education: Education[];
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>;
  addEducation: () => void;
  deleteEducationEntry: (id: string, index: number) => Promise<void>;
}

const EducationTab: React.FC<EducationTabProps> = ({ 
  education, 
  setEducation, 
  addEducation, 
  deleteEducationEntry 
}) => {
  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-4 relative">
          {education.length > 1 && (
            <button
              onClick={() => deleteEducationEntry(edu.id, index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Delete education entry"
            >
              <Trash2 size={16} />
            </button>
          )}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => {
                  const updated = [...education];
                  updated[index].degree = e.target.value;
                  setEducation(updated);
                }}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => {
                  const updated = [...education];
                  updated[index].school = e.target.value;
                  setEducation(updated);
                }}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={edu.startDate}
                onChange={(e) => {
                  const updated = [...education];
                  updated[index].startDate = e.target.value;
                  setEducation(updated);
                }}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={edu.endDate}
                onChange={(e) => {
                  const updated = [...education];
                  updated[index].endDate = e.target.value;
                  setEducation(updated);
                }}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={edu.isStudying}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={edu.isStudying}
                onChange={(e) => {
                  const updated = [...education];
                  updated[index].isStudying = e.target.checked;
                  setEducation(updated);
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">I am still studying</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Describe your extra curricular activities in college</label>
            <textarea
              value={edu.description}
              onChange={(e) => {
                const updated = [...education];
                updated[index].description = e.target.value;
                setEducation(updated);
              }}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addEducation}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        <Plus size={16} className="mr-1" />
        Add More Education
      </button>
    </div>
  );
};

export default EducationTab;
