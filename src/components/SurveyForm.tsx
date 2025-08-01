import React, { useState } from 'react';

interface SurveyFormProps {
  onComplete?: (data: SurveyData) => void;
  onCancel?: () => void;
  className?: string;
}

interface SurveyData {
  careerGoals: string[];
  preferredIndustries: string[];
  experienceLevel: string;
  educationLevel: string;
  salaryExpectation: string;
  preferredLocation: string;
  remotePreference: string;
  skills: string[];
  additionalInfo: string;
}

interface FormErrors {
  careerGoals?: string;
  preferredIndustries?: string;
  experienceLevel?: string;
  educationLevel?: string;
  salaryExpectation?: string;
  preferredLocation?: string;
  remotePreference?: string;
  general?: string;
}

const CAREER_GOALS = [
  'Find a full-time job',
  'Get an internship',
  'Change careers',
  'Advance in current field',
  'Start a business',
  'Work remotely',
  'Work abroad',
  'Return to workforce'
];

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Marketing',
  'Sales',
  'Engineering',
  'Design',
  'Consulting',
  'Non-profit',
  'Government',
  'Manufacturing',
  'Retail',
  'Media',
  'Other'
];

const EXPERIENCE_LEVELS = [
  'Entry Level (0-2 years)',
  'Mid Level (3-5 years)',
  'Senior Level (6-10 years)',
  'Executive Level (10+ years)',
  'Student/Recent Graduate',
  'Career Changer'
];

const EDUCATION_LEVELS = [
  'High School',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD/Doctorate',
  'Professional Certification',
  'Self-taught'
];

const SALARY_RANGES = [
  'Under $30,000',
  '$30,000 - $50,000',
  '$50,000 - $75,000',
  '$75,000 - $100,000',
  '$100,000 - $150,000',
  'Over $150,000',
  'Negotiable'
];

const REMOTE_PREFERENCES = [
  'On-site only',
  'Hybrid (part remote, part on-site)',
  'Remote only',
  'Flexible'
];

export default function SurveyForm({ onComplete, onCancel, className = '' }: SurveyFormProps) {
  const [formData, setFormData] = useState<SurveyData>({
    careerGoals: [],
    preferredIndustries: [],
    experienceLevel: '',
    educationLevel: '',
    salaryExpectation: '',
    preferredLocation: '',
    remotePreference: '',
    skills: [],
    additionalInfo: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [customSkill, setCustomSkill] = useState('');

  const totalSteps = 4;

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (formData.careerGoals.length === 0) {
          newErrors.careerGoals = 'Please select at least one career goal';
        }
        if (formData.preferredIndustries.length === 0) {
          newErrors.preferredIndustries = 'Please select at least one industry';
        }
        break;
      case 2:
        if (!formData.experienceLevel) {
          newErrors.experienceLevel = 'Please select your experience level';
        }
        if (!formData.educationLevel) {
          newErrors.educationLevel = 'Please select your education level';
        }
        break;
      case 3:
        if (!formData.salaryExpectation) {
          newErrors.salaryExpectation = 'Please select your salary expectation';
        }
        if (!formData.remotePreference) {
          newErrors.remotePreference = 'Please select your remote work preference';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMultiSelect = (field: keyof SurveyData, value: string) => {
    const currentValues = formData[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    setFormData(prev => ({ ...prev, [field]: newValues }));

    // Clear field-specific error
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSingleSelect = (field: keyof SurveyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific error
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
      setCustomSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onComplete) {
        onComplete(formData);
      }
    } catch (error) {
      setErrors({ general: 'Failed to submit survey. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">What are your career goals?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CAREER_GOALS.map((goal) => (
            <label key={goal} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.careerGoals.includes(goal)}
                onChange={() => handleMultiSelect('careerGoals', goal)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">{goal}</span>
            </label>
          ))}
        </div>
        {errors.careerGoals && (
          <p className="mt-1 text-sm text-red-600">{errors.careerGoals}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">What industries interest you?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INDUSTRIES.map((industry) => (
            <label key={industry} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.preferredIndustries.includes(industry)}
                onChange={() => handleMultiSelect('preferredIndustries', industry)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">{industry}</span>
            </label>
          ))}
        </div>
        {errors.preferredIndustries && (
          <p className="mt-1 text-sm text-red-600">{errors.preferredIndustries}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">What's your experience level?</h3>
        <div className="space-y-3">
          {EXPERIENCE_LEVELS.map((level) => (
            <label key={level} className="flex items-center">
              <input
                type="radio"
                name="experienceLevel"
                value={level}
                checked={formData.experienceLevel === level}
                onChange={(e) => handleSingleSelect('experienceLevel', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">{level}</span>
            </label>
          ))}
        </div>
        {errors.experienceLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.experienceLevel}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">What's your highest education level?</h3>
        <div className="space-y-3">
          {EDUCATION_LEVELS.map((level) => (
            <label key={level} className="flex items-center">
              <input
                type="radio"
                name="educationLevel"
                value={level}
                checked={formData.educationLevel === level}
                onChange={(e) => handleSingleSelect('educationLevel', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">{level}</span>
            </label>
          ))}
        </div>
        {errors.educationLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.educationLevel}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">What's your salary expectation?</h3>
        <div className="space-y-3">
          {SALARY_RANGES.map((range) => (
            <label key={range} className="flex items-center">
              <input
                type="radio"
                name="salaryExpectation"
                value={range}
                checked={formData.salaryExpectation === range}
                onChange={(e) => handleSingleSelect('salaryExpectation', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">{range}</span>
            </label>
          ))}
        </div>
        {errors.salaryExpectation && (
          <p className="mt-1 text-sm text-red-600">{errors.salaryExpectation}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">What's your remote work preference?</h3>
        <div className="space-y-3">
          {REMOTE_PREFERENCES.map((preference) => (
            <label key={preference} className="flex items-center">
              <input
                type="radio"
                name="remotePreference"
                value={preference}
                checked={formData.remotePreference === preference}
                onChange={(e) => handleSingleSelect('remotePreference', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">{preference}</span>
            </label>
          ))}
        </div>
        {errors.remotePreference && (
          <p className="mt-1 text-sm text-red-600">{errors.remotePreference}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred location</h3>
        <input
          type="text"
          value={formData.preferredLocation}
          onChange={(e) => handleSingleSelect('preferredLocation', e.target.value)}
          placeholder="e.g., New York, NY or Remote"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">What skills do you have?</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="Add a skill"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional information</h3>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
          placeholder="Tell us anything else that might help us find the right opportunities for you..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {errors.general}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onCancel || handlePrevious}
          disabled={currentStep === 1}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </button>

        <div className="flex gap-3">
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                'Submit Survey'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

