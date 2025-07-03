import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Edit, ExternalLink, Building, MapPin, DollarSign, Calendar } from 'lucide-react';
import { LinkedInJobCrawler } from '../services/linkedinCrawler';

interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  jobUrl: string;
  datePosted: string;
  source: string;
  companyLogo: string;
  postedAgo: string;
}

interface JobPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (jobs: Job[]) => void;
}

export default function JobPreviewModal({ isOpen, onClose, onSave }: JobPreviewModalProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadJobsFromCache();
    }
  }, [isOpen]);

  const loadJobsFromCache = () => {
    try {
      const cachedData = LinkedInJobCrawler.getJobsFromLocalStorage();
      if (cachedData && cachedData.jobs) {
        setJobs(cachedData.jobs);
        setError(null);
      } else {
        setError('No cached jobs found. Please crawl jobs first.');
      }
    } catch (error) {
      setError('Failed to load cached jobs.');
      console.error('Error loading cached jobs:', error);
    }
  };

  const handleJobEdit = (index: number, field: keyof Job, value: string) => {
    const updatedJobs = [...jobs];
    updatedJobs[index] = { ...updatedJobs[index], [field]: value };
    setJobs(updatedJobs);
  };

  const handleDeleteJob = (index: number) => {
    const updatedJobs = jobs.filter((_, i) => i !== index);
    setJobs(updatedJobs);
  };

  const handleSaveChanges = () => {
    try {
      // Update localStorage with edited jobs
      LinkedInJobCrawler.updateJobsInLocalStorage(jobs);
      setError(null);
      alert('Changes saved to cache successfully!');
    } catch (error) {
      setError('Failed to save changes to cache.');
      console.error('Error saving changes:', error);
    }
  };

  const handleSaveToBackend = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Send jobs to backend
      await LinkedInJobCrawler.sendJobsToBackend(jobs);
      
      alert(`Successfully saved ${jobs.length} jobs to backend!`);
      onSave?.(jobs);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to save jobs to backend');
      console.error('Error saving to backend:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Job Preview & Editor</h2>
            <p className="text-gray-600 mt-1">Review and edit crawled jobs before saving to backend</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Jobs List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No jobs found in cache. Please crawl jobs first.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {editingJobId === index ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                              <input
                                type="text"
                                value={job.title}
                                onChange={(e) => handleJobEdit(index, 'title', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                              <input
                                type="text"
                                value={job.company}
                                onChange={(e) => handleJobEdit(index, 'company', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <input
                                type="text"
                                value={job.location}
                                onChange={(e) => handleJobEdit(index, 'location', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                              <input
                                type="text"
                                value={job.salary}
                                onChange={(e) => handleJobEdit(index, 'salary', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
                            <input
                              type="url"
                              value={job.jobUrl}
                              onChange={(e) => handleJobEdit(index, 'jobUrl', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={job.description}
                              onChange={(e) => handleJobEdit(index, 'description', e.target.value)}
                              rows={3}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Add job description..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingJobId(null)}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Done Editing
                            </button>
                            <button
                              onClick={() => setEditingJobId(null)}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                              <div className="flex items-center text-gray-600 mt-1">
                                <Building className="h-4 w-4 mr-1" />
                                <span>{job.company}</span>
                              </div>
                            </div>
                            {job.companyLogo && (
                              <img 
                                src={job.companyLogo} 
                                alt={`${job.company} logo`}
                                className="w-12 h-12 rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{job.postedAgo}</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                <span>{job.salary}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              <a 
                                href={job.jobUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 truncate"
                              >
                                View Job
                              </a>
                            </div>
                          </div>

                          {job.description && (
                            <div className="text-sm text-gray-700 mb-3">
                              <p className="line-clamp-3">{job.description}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {editingJobId !== index && (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setEditingJobId(index)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                          title="Edit job"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                          title="Delete job"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {jobs.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {jobs.length} job{jobs.length !== 1 ? 's' : ''} ready to save
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes to Cache
                </button>
                <button
                  onClick={handleSaveToBackend}
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save to Backend
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
