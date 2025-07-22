import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { getScholarship, createScholarship, updateScholarship, ScholarshipFormData } from '../services/scholarships';

const AdminScholarshipForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState<ScholarshipFormData>({
    title: '',
    source: '',
    location: '',
    amount: '',
    deadline: '',
    course: '',
    gpa: '',
    application_link: '',
    overview: '',
    scraped_at: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchScholarship();
    }
  }, [id, isEdit]);

  const fetchScholarship = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getScholarship(id!);
      
      setFormData({
        id: data.id || undefined,
        title: data.title || '',
        source: data.source || '',
        location: data.location || '',
        amount: data.amount || '',
        deadline: data.deadline ? data.deadline.split('T')[0] : '',
        course: data.course || '',
        gpa: data.gpa || '',
        application_link: data.application_link || '',
        overview: data.overview || '',
        scraped_at: data.scraped_at || '',
      });
    } catch (err: any) {
      setError('Failed to load scholarship details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ScholarshipFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.source || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const submitData = {
        ...formData,
        amount: formData.amount || null,
        deadline: formData.deadline || null,
        course: formData.course || null,
        gpa: formData.gpa || null,
        application_link: formData.application_link || null,
        overview: formData.overview || null,
      };

      if (isEdit && id) {
        await updateScholarship(parseInt(id), submitData);
        console.log('Scholarship updated successfully');
      } else {
        await createScholarship(submitData);
        console.log('Scholarship created successfully');
      }
      
      navigate('/admin/scholarships');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save scholarship');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/scholarships')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Scholarships
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Scholarship' : 'Add New Scholarship'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-full">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., $5,000 or ₹50,000"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => handleInputChange('course', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Computer Science, Medicine"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPA Requirement
                </label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange('gpa', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3.5, 85%"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Link
                </label>
                <input
                  type="url"
                  value={formData.application_link}
                  onChange={(e) => handleInputChange('application_link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                  disabled={saving}
                />
              </div>
            </div>

            {/* Overview field - full width */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overview
              </label>
              <textarea
                rows={4}
                value={formData.overview}
                onChange={(e) => handleInputChange('overview', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed overview or description of the scholarship..."
                disabled={saving}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/scholarships')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.title || !formData.source || !formData.location}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {saving ? 'Saving...' : (isEdit ? 'Update Scholarship' : 'Create Scholarship')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminScholarshipForm;