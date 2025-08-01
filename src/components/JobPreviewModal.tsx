import { useEffect } from 'react';
import { X, MapPin, Building2, Clock, DollarSign, ExternalLink } from 'lucide-react';

interface JobPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    salary_range?: string;
    deadline?: string;
    link?: string;
    requirements?: string[];
    skills_required?: string[];
    experience_level?: string;
    employment_type?: string;
  } | null;
}

const JobPreviewModal = ({ isOpen, onClose, job }: JobPreviewModalProps) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Job Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Job Title and Company */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex items-center text-gray-600 mb-2">
              <Building2 size={16} className="mr-2" />
              <span className="font-medium">{job.company}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2" />
              <span>{job.location}</span>
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {job.salary_range && (
              <div className="flex items-center text-gray-600">
                <DollarSign size={16} className="mr-2" />
                <span><strong>Salary:</strong> {job.salary_range}</span>
              </div>
            )}
            {job.experience_level && (
              <div className="text-gray-600">
                <strong>Experience:</strong> {job.experience_level}
              </div>
            )}
            {job.employment_type && (
              <div className="text-gray-600">
                <strong>Type:</strong> {job.employment_type}
              </div>
            )}
            {job.deadline && (
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-2" />
                <span><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills_required && job.skills_required.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {job.link && (
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ExternalLink size={16} className="mr-2" />
              Apply Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPreviewModal;
