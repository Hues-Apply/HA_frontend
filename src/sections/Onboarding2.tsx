import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import { parseResumeFromPdf } from 'resume-parser-ts';
import type { Resume } from 'resume-parser-ts';
import { BASE_URL } from '../services/api';
import type { ParsedCVData } from '../services/profile';

const UploadComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const allowedFormats = ['application/pdf']; // resume-parser-ts only supports PDF

  // Transform resume-parser-ts data to our ParsedCVData structure
  const transformResumeData = (resume: Resume): ParsedCVData => {
    // Extract first and last name from full name
    const nameParts = resume.profile.name?.split(' ') || [];
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    return {
      personal_info: {
        first_name,
        last_name,
        email: resume.profile.email || '',
        phone: resume.profile.phone || '',
        address: resume.profile.location || '',
        linkedin: '', // Not provided by resume-parser-ts
        portfolio: resume.profile.url || ''
      },
      summary: resume.profile.summary || '',
      education: resume.educations.map(edu => ({
        institution: edu.school || '',
        degree: edu.degree || '',
        field_of_study: '', // Not specifically provided
        start_date: '', // Parse from date if needed
        end_date: edu.date || '',
        gpa: edu.gpa || '',
        description: edu.descriptions.join(' ') || ''
      })),
      experience: resume.workExperiences.map(exp => ({
        company: exp.company || '',
        position: exp.jobTitle || '',
        start_date: '', // Parse from date if needed
        end_date: exp.date || '',
        is_current: false, // Would need to parse from date
        description: exp.descriptions.join(' ') || '',
        achievements: exp.descriptions || []
      })),
      skills: resume.skills.featuredSkills.map(skill => skill.skill) || [],
      certifications: [], // Not provided by resume-parser-ts
      languages: [] // Not provided by resume-parser-ts
    };
  };

  // Upload document file to backend
  const uploadDocumentFile = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('cv_file', file);

    const response = await fetch(`${BASE_URL}/api/profile/personal/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Document upload failed');
    }

    return response.json();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; if (selectedFile && allowedFormats.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Unsupported file format. Please upload PDF files only.');
    }
  };
  const handleContinue = async () => {
    if (!file) {
      setError('Please select a file to continue.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Step 1: Parse CV on frontend using resume-parser-ts
      const fileUrl = URL.createObjectURL(file);
      let parsedResume: Resume;

      try {
        parsedResume = await parseResumeFromPdf(fileUrl);
      } catch (parseError) {
        console.error('CV parsing failed:', parseError);
        // If parsing fails, create empty structure
        parsedResume = {
          profile: { name: '', email: '', phone: '', url: '', summary: '', location: '' },
          workExperiences: [],
          educations: [],
          projects: [],
          skills: { featuredSkills: [], descriptions: [] },
          custom: { descriptions: [] }
        };
      } finally {
        // Clean up the object URL
        URL.revokeObjectURL(fileUrl);
      }

      // Step 2: Transform parsed data to our structure
      const parsedCVData = transformResumeData(parsedResume);

      // Step 3: Upload document file to backend
      await uploadDocumentFile(file);

      // Step 4: Store parsed data for review step
      localStorage.setItem('parsedCVData', JSON.stringify(parsedCVData));

      // Step 5: Navigate to review step
      navigate('/onboarding/review', { replace: true });
    } catch (error: any) {
      console.error('Upload failed:', error);
      setError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    // Navigate directly to dashboard if user skips CV upload
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#edf6fd]">
      <h1 className="text-2xl font-bold text-[#56a8f5] absolute top-8 left-8">Hues Apply</h1>
      <div className="bg-white rounded-xl border-2 border-[#56a8f5] shadow-md p-10 w-[400px]">
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-2">Upload relevant document to<br />create your profile</h2>
        <div className="flex items-center mb-1">
          <div className="h-1 w-1/2 bg-blue-500 rounded-l-full"></div>
          <div className="h-1 w-1/2 bg-purple-300 rounded-r-full"></div>
        </div>
        <div className="flex justify-end mb-4">
          <span className="text-xs text-gray-500">Step 2/2</span>
        </div>
        <div className="relative bg-[#f0f6fd] border border-dashed border-gray-400 rounded-lg p-6 text-center h-40 flex flex-col items-center justify-center">
          <UploadCloud className="text-gray-500 mb-2" size={40} />
          <p className="text-sm font-medium text-gray-700">Drag & Drop Files</p>
          <p className="text-xs text-gray-500">Or click to browse your files</p>          <p className="text-xs text-gray-500 mt-1">Supported formats: PDF only</p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="opacity-0 w-full h-full absolute top-0 left-0 cursor-pointer"
          />
        </div>
        {file && <p className="mt-2 text-sm text-green-600">Selected file: {file.name}</p>}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <button
          className="mt-6 w-full bg-[#56a8f5] text-white font-medium py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleContinue}
          disabled={!file || isUploading}
        >
          {isUploading ? 'Parsing & Uploading...' : 'Continue'}
        </button>

        <button
          className="mt-3 w-full text-gray-600 text-sm hover:text-gray-800 transition"
          onClick={handleSkip}
          disabled={isUploading}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default UploadComponent;
