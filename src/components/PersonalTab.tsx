import React, { useState, useEffect } from 'react';
import { PersonalInfo } from '../hooks/useProfileData';
import { validatePersonalInfo, sanitizeInput } from '../utils/validation';

interface PersonalTabProps {
  personalInfo: PersonalInfo;
  setPersonalInfo: (info: PersonalInfo) => void;
  validationErrors?: string[];
}

const PersonalTab: React.FC<PersonalTabProps> = ({
  personalInfo,
  setPersonalInfo,
  validationErrors = []
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Real-time validation on field change
  const handleFieldChange = (field: keyof PersonalInfo, value: string) => {
    const sanitizedValue = sanitizeInput(value);

    setPersonalInfo({ ...personalInfo, [field]: sanitizedValue });

    // Mark field as touched
    setTouchedFields((prev: Record<string, boolean>) => ({ ...prev, [field]: true }));

    // Clear field error if user is typing
    if (fieldErrors[field]) {
      setFieldErrors((prev: Record<string, string>) => ({ ...prev, [field]: '' }));
    }
  };

  // Validate field on blur
  const handleFieldBlur = (field: keyof PersonalInfo) => {
    const validation = validatePersonalInfo(personalInfo);
    const fieldError = validation.errors.find(error =>
      error.toLowerCase().includes(field.toLowerCase())
    );

    if (fieldError && touchedFields[field]) {
      setFieldErrors((prev: Record<string, string>) => ({ ...prev, [field]: fieldError }));
    } else {
      setFieldErrors((prev: Record<string, string>) => ({ ...prev, [field]: '' }));
    }
  };

  // Clear validation errors when component receives new data
  useEffect(() => {
    if (validationErrors.length === 0) {
      setFieldErrors({});
    }
  }, [validationErrors]);

  const getFieldError = (field: keyof PersonalInfo): string => {
    return fieldErrors[field] || '';
  };

  const isFieldValid = (field: keyof PersonalInfo): boolean => {
    return !fieldErrors[field] || fieldErrors[field] === '';
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            onBlur={() => handleFieldBlur('name')}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${touchedFields.name && !isFieldValid('name')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
              }`}
            placeholder="Enter your full name"
          />
          {touchedFields.name && !isFieldValid('name') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            onBlur={() => handleFieldBlur('email')}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${touchedFields.email && !isFieldValid('email')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
              }`}
            placeholder="Enter your email address"
          />
          {touchedFields.email && !isFieldValid('email') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            onBlur={() => handleFieldBlur('phone')}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${touchedFields.phone && !isFieldValid('phone')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
              }`}
            placeholder="Enter your phone number"
          />
          {touchedFields.phone && !isFieldValid('phone') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.country}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            onBlur={() => handleFieldBlur('country')}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${touchedFields.country && !isFieldValid('country')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
              }`}
            placeholder="Enter your country"
          />
          {touchedFields.country && !isFieldValid('country') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('country')}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Career Goal
        </label>
        <textarea
          value={personalInfo.goal}
          onChange={(e) => handleFieldChange('goal', e.target.value)}
          onBlur={() => handleFieldBlur('goal')}
          rows={3}
          className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${touchedFields.goal && !isFieldValid('goal')
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300'
            }`}
          placeholder="Describe your career goals and aspirations..."
        />
        {touchedFields.goal && !isFieldValid('goal') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('goal')}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {personalInfo.goal.length}/1000 characters
        </p>
      </div>
    </div>
  );
};

export default PersonalTab;
