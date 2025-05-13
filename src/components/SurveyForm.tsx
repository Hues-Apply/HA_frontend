import React, { useState, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';

interface SurveyFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
  initialData: {
    name: string;
    email: string;
    phone: string;
  };
}

const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmit, onBack, initialData }) => {
  // Using Formspree for form submissions
  const [formspreeState, handleFormspreeSubmit] = useForm("xblozqod");
  const [formData, setFormData] = useState({
    // Initial data passed from first form
    ...initialData,
    
    // Demographic & Profile Data
    location: '',
    userCategory: '',
    
    // Educational & Career Preferences
    fieldOfStudy: '',
    graduationYear: '',
    areasOfInterest: [] as string[],
    
    // Behavioral & Referral Insights
    referralSource: '',
    biggestChallenge: '',
    
    // Optional Engagement
    preferredChannel: '',
    betaTester: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        areasOfInterest: [...formData.areasOfInterest, value],
      });
    } else {
      setFormData({
        ...formData,
        areasOfInterest: formData.areasOfInterest.filter(item => item !== value),
      });
    }
  };

  // When Formspree submission succeeds, call the onSubmit prop
  useEffect(() => {
    if (formspreeState.succeeded) {
      onSubmit(formData);
    }
  }, [formspreeState.succeeded, formData, onSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send the complete data (initial + survey) to Formspree
    handleFormspreeSubmit({
      ...formData,
      formType: "combined"
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Help Us Know You Better</h2>
        <p className="text-gray-600 mb-8">This information helps us personalize your experience and match you with the right opportunities.</p>
        
        {/* Demographic & Profile Data */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#4B9CD3] mb-4">Demographic & Profile</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                Current Location (City, Country)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B9CD3]"
                placeholder="e.g., Accra, Ghana"
              />
            </div>
            
            <div>
              <label htmlFor="userCategory" className="block text-gray-700 font-medium mb-2">
                User Category
              </label>
              <select
                id="userCategory"
                name="userCategory"
                value={formData.userCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B9CD3]"
              >
                <option value="">Select your category</option>
                <option value="Student">Student</option>
                <option value="Graduate">Graduate</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Educational & Career Preferences */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#4B9CD3] mb-4">Educational & Career Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="fieldOfStudy" className="block text-gray-700 font-medium mb-2">
                Field of Study or Industry
              </label>
              <input
                type="text"
                id="fieldOfStudy"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B9CD3]"
                placeholder="e.g., Computer Science, Healthcare"
              />
            </div>
            
            <div>
              <label htmlFor="graduationYear" className="block text-gray-700 font-medium mb-2">
                Year of Graduation or Experience Level
              </label>
              <input
                type="text"
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B9CD3]"
                placeholder="e.g., 2023 or 5+ years"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Areas of Interest
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Scholarships', 'Internships', 'Jobs', 'Career Coaching'].map(area => (
                <div key={area} className="flex items-center">
                  <input
                    type="checkbox"
                    id={area.toLowerCase()}
                    name="areasOfInterest"
                    value={area}
                    checked={formData.areasOfInterest.includes(area)}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-[#4B9CD3] focus:ring-[#4B9CD3] border-gray-300 rounded"
                  />
                  <label htmlFor={area.toLowerCase()} className="ml-2 text-sm text-gray-700">
                    {area}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Behavioral & Referral Insights */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#4B9CD3] mb-4">Behavioral & Referral Insights</h3>
          
          <div className="mb-6">
            <label htmlFor="referralSource" className="block text-gray-700 font-medium mb-2">
              How Did You Hear About Us?
            </label>
            <select
              id="referralSource"
              name="referralSource"
              value={formData.referralSource}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B9CD3]"
            >
              <option value="">Select an option</option>
              <option value="Social Media">Social Media</option>
              <option value="Search Engine">Search Engine</option>
              <option value="Friend">Friend or Colleague</option>
              <option value="Event">Event or Conference</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="biggestChallenge" className="block text-gray-700 font-medium mb-2">
              What's Your Biggest Application Challenge?
            </label>
            <textarea
              id="biggestChallenge"
              name="biggestChallenge"
              value={formData.biggestChallenge}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B9CD3]"
              placeholder="e.g., Finding relevant opportunities, writing application essays, etc."
            ></textarea>
          </div>
        </div>
        
        {/* Optional Engagement */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#4B9CD3] mb-4">Optional Engagement Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="preferredChannel" className="block text-gray-700 font-medium mb-2">
                Preferred Communication Channel
              </label>
              <select
                id="preferredChannel"
                name="preferredChannel"
                value={formData.preferredChannel}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B9CD3]"
              >
                <option value="">Select a channel</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="SMS">SMS</option>
              </select>
            </div>
            
            <div className="flex items-center h-full pt-8">
              <input
                type="checkbox"
                id="betaTester"
                name="betaTester"
                checked={formData.betaTester}
                onChange={handleChange}
                className="w-4 h-4 text-[#4B9CD3] focus:ring-[#4B9CD3] border-gray-300 rounded"
              />
              <label htmlFor="betaTester" className="ml-2 text-gray-700">
                I would like to participate in beta testing
              </label>
            </div>
          </div>
        </div>

        {formspreeState.errors && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            <p className="font-medium">There was a problem submitting your form.</p>
            <ValidationError errors={formspreeState.errors} />
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-lg border border-[#4B9CD3] text-[#4B9CD3] font-medium hover:bg-[#4B9CD30f] transition-colors duration-300"
          >
            Back
          </button>
          {formspreeState.submitting ? (
            <button
              type="button"
              disabled
              className="px-8 py-3 bg-[#7EB4DB] text-white font-medium rounded-lg cursor-not-allowed"
            >
              Submitting...
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-3 bg-[#4B9CD3] text-white font-medium rounded-lg hover:bg-[#3D84FF] transition-colors duration-300"
            >
              Complete Registration
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;
