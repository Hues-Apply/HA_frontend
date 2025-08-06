import { useState, useEffect } from 'react';
import {
  getComprehensiveProfile,
  updatePersonalInfo,
  updateCareerProfile,
  createEducation,
  updateEducation,
  deleteEducation,
  createExperience,
  updateExperience,
  deleteExperience,
  createProject,
  updateProject,
  deleteProject,
  updateOpportunitiesInterest,
  updateRecommendationPriority
} from '../services/profile';
import {
  validatePersonalInfo,
  validateCareerProfile,
  validateEducation,
  validateExperience,
  validateProject,
  sanitizeInput
} from '../utils/validation';

// Enhanced error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Enhanced interfaces with validation
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  country: string;
  goal: string;
}

export interface CareerProfile {
  industry: string;
  jobTitle: string;
  profileSummary: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  isStudying: boolean;
  description: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  description: string;
}

export interface Project {
  id: string;
  projectTitle: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  projectLink: string;
  description: string;
}

export interface AIPreferences {
  opportunities: string[];
  prioritizeBy: string[];
  salaryExpectation: string;
}

export const useProfileData = () => {
  // Helper function to convert date strings to yyyy-MM-dd format
  const parseDate = (dateString: string): string => {
    if (!dateString) return '';

    // If already in yyyy-MM-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Handle formats like "October 2015", "July 2019", etc.
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const parts = dateString.trim().split(' ');
    if (parts.length === 2) {
      const monthName = parts[0];
      const year = parts[1];
      const monthIndex = monthNames.indexOf(monthName);

      if (monthIndex !== -1 && /^\d{4}$/.test(year)) {
        // Use the first day of the month as default
        const month = (monthIndex + 1).toString().padStart(2, '0');
        return `${year}-${month}-01`;
      }
    }

    // If we can't parse it, return empty string
    return '';
  };

  // Enhanced state management with validation errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [profileData, setProfileData] = useState<any>(null);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    country: '',
    goal: ''
  });

  const [cvFile, setCvFile] = useState<{
    filename?: string;
    uploadedAt?: string;
    hasCvInGcs?: boolean;
    downloadUrl?: string;
  }>({});

  const [careerProfile, setCareerProfile] = useState<CareerProfile>({
    industry: '',
    jobTitle: '',
    profileSummary: ''
  });

  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [aiPreferences, setAIPreferences] = useState<AIPreferences>({
    opportunities: [],
    prioritizeBy: [],
    salaryExpectation: ''
  });

  // Enhanced error handling function
  const handleApiError = (error: any, context: string): ApiError => {
    console.error(`API Error in ${context}:`, error);

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return {
            code: 'VALIDATION_ERROR',
            message: data.error || 'Invalid data provided',
            details: data.details || data
          };
        case 401:
          return {
            code: 'AUTHENTICATION_ERROR',
            message: 'Please log in again to continue'
          };
        case 403:
          return {
            code: 'PERMISSION_ERROR',
            message: 'You do not have permission to perform this action'
          };
        case 404:
          return {
            code: 'NOT_FOUND_ERROR',
            message: 'The requested resource was not found'
          };
        case 500:
          return {
            code: 'SERVER_ERROR',
            message: 'Server error. Please try again later'
          };
        default:
          return {
            code: 'UNKNOWN_ERROR',
            message: data.error || 'An unexpected error occurred'
          };
      }
    } else if (error.request) {
      // Network error
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection and try again'
      };
    } else {
      // Other error
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred'
      };
    }
  };

  // Enhanced validation function
  const validateTabData = (activeTab: string): { isValid: boolean; errors: Record<string, string[]> } => {
    const errors: Record<string, string[]> = {};

    switch (activeTab) {
      case 'Personal':
        const personalValidation = validatePersonalInfo(personalInfo);
        if (!personalValidation.isValid) {
          errors.personal = personalValidation.errors;
        }
        break;

      case 'Career Profile':
        const careerValidation = validateCareerProfile(careerProfile);
        if (!careerValidation.isValid) {
          errors.career = careerValidation.errors;
        }
        break;

      case 'Education':
        const educationErrors: string[] = [];
        education.forEach((edu, index) => {
          const eduValidation = validateEducation(edu);
          if (!eduValidation.isValid) {
            educationErrors.push(`Education ${index + 1}: ${eduValidation.errors.join(', ')}`);
          }
        });
        if (educationErrors.length > 0) {
          errors.education = educationErrors;
        }
        break;

      case 'Experience':
        const experienceErrors: string[] = [];
        experience.forEach((exp, index) => {
          const expValidation = validateExperience(exp);
          if (!expValidation.isValid) {
            experienceErrors.push(`Experience ${index + 1}: ${expValidation.errors.join(', ')}`);
          }
        });
        if (experienceErrors.length > 0) {
          errors.experience = experienceErrors;
        }
        break;

      case 'Projects':
        const projectErrors: string[] = [];
        projects.forEach((project, index) => {
          const projectValidation = validateProject(project);
          if (!projectValidation.isValid) {
            projectErrors.push(`Project ${index + 1}: ${projectValidation.errors.join(', ')}`);
          }
        });
        if (projectErrors.length > 0) {
          errors.projects = projectErrors;
        }
        break;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Enhanced input sanitization
  const sanitizeInputValue = (value: string): string => {
    return sanitizeInput(value);
  };

  // Enhanced setter functions with sanitization
  const setPersonalInfoWithSanitization = (info: PersonalInfo) => {
    setPersonalInfo({
      name: sanitizeInputValue(info.name),
      email: sanitizeInputValue(info.email),
      phone: sanitizeInputValue(info.phone),
      country: sanitizeInputValue(info.country),
      goal: sanitizeInputValue(info.goal)
    });
  };

  const setCareerProfileWithSanitization = (profile: CareerProfile) => {
    setCareerProfile({
      industry: sanitizeInputValue(profile.industry),
      jobTitle: sanitizeInputValue(profile.jobTitle),
      profileSummary: sanitizeInputValue(profile.profileSummary)
    });
  };

  // Data fetching with enhanced error handling
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      setValidationErrors({});

      const response = await getComprehensiveProfile();

      if (response.success) {
        const profile = response.data;
        setProfileData(profile);

        // Populate personal info with sanitization
        const formattedGoals = profile.user_goals
          ? profile.user_goals
            .sort((a, b) => a.priority - b.priority)
            .map(goal => `${goal.priority}. ${goal.goal_display}`)
            .join('\n')
          : profile.goal || '';

        setPersonalInfo({
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          email: profile.email || '',
          phone: profile.phone_number || '',
          country: profile.country || '',
          goal: formattedGoals
        });

        // Populate CV file information
        setCvFile({
          filename: profile.cv_filename,
          uploadedAt: profile.cv_uploaded_at,
          hasCvInGcs: profile.has_cv_in_gcs,
          downloadUrl: profile.cv_download_url
        });

        // Populate career profile
        setCareerProfile({
          industry: profile.career_profile?.industry || '',
          jobTitle: profile.career_profile?.job_title || '',
          profileSummary: profile.career_profile?.profile_summary || ''
        });

        // Populate education with enhanced parsing
        const educationData = profile.parsed_profile_data?.education?.map((edu, index) => {
          let startDate = edu.start_date || '';
          let endDate = edu.end_date || '';

          if (endDate && endDate.includes(' - ')) {
            const dateParts = endDate.split(' - ');
            startDate = dateParts[0]?.trim() || '';
            endDate = dateParts[1]?.trim() || '';
          }

          return {
            id: `existing_${index}`,
            degree: edu.degree || '',
            school: edu.institution || '',
            startDate: parseDate(startDate),
            endDate: parseDate(endDate),
            isStudying: false,
            description: edu.description || ''
          };
        }) || [];

        setEducation(educationData.length > 0 ? educationData : [{
          id: 'new',
          degree: '',
          school: '',
          startDate: '',
          endDate: '',
          isStudying: false,
          description: ''
        }]);

        // Populate experience with enhanced parsing
        const experienceData = profile.parsed_profile_data?.experience?.map((exp, index) => {
          let startDate = exp.start_date || '';
          let endDate = exp.end_date || '';

          if (endDate && endDate.includes(' – ')) {
            const dateParts = endDate.split(' – ');
            startDate = dateParts[0]?.trim() || '';
            endDate = dateParts[1]?.trim() || '';
          }

          return {
            id: `existing_${index}`,
            jobTitle: exp.position || '',
            companyName: exp.company || '',
            location: '',
            startDate: parseDate(startDate),
            endDate: parseDate(endDate),
            isCurrentlyWorking: exp.is_current || false,
            description: exp.description || ''
          };
        }) || [];

        setExperience(experienceData.length > 0 ? experienceData : [{
          id: 'new',
          jobTitle: '',
          companyName: '',
          location: '',
          startDate: '',
          endDate: '',
          isCurrentlyWorking: false,
          description: ''
        }]);

        // Populate projects
        const projectsData = profile.project_profiles?.map(project => ({
          id: project.id.toString(),
          projectTitle: project.project_title || '',
          startDate: project.start_date || '',
          endDate: project.end_date || '',
          isCurrentlyWorking: project.is_currently_working,
          projectLink: project.project_link || '',
          description: project.description || ''
        })) || [];

        setProjects(projectsData.length > 0 ? projectsData : [{
          id: 'new',
          projectTitle: '',
          startDate: '',
          endDate: '',
          isCurrentlyWorking: false,
          projectLink: '',
          description: ''
        }]);

        // Populate AI preferences
        const opportunities = [];
        if (profile.opportunities_interest?.scholarships) opportunities.push('Scholarships');
        if (profile.opportunities_interest?.jobs) opportunities.push('Jobs');
        if (profile.opportunities_interest?.grants) opportunities.push('Grants');
        if (profile.opportunities_interest?.internships) opportunities.push('Internships');

        const prioritizeBy = [];
        if (profile.recommendation_priority?.academic_background) prioritizeBy.push('My academic background');
        if (profile.recommendation_priority?.work_experience) prioritizeBy.push('My work experience');
        if (profile.recommendation_priority?.preferred_locations) prioritizeBy.push('My preferred locations');
        if (profile.recommendation_priority?.others) prioritizeBy.push('Other');

        setAIPreferences({
          opportunities,
          prioritizeBy,
          salaryExpectation: profile.recommendation_priority?.additional_preferences || ''
        });
      }
    } catch (err: any) {
      const apiError = handleApiError(err, 'fetchProfileData');
      setError(apiError.message);
      console.error('Failed to fetch profile data:', apiError);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced save functions with error handling
  const savePersonalInfo = async () => {
    try {
      const nameParts = personalInfo.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await updatePersonalInfo({
        first_name: firstName,
        last_name: lastName,
        email: personalInfo.email,
        phone_number: personalInfo.phone,
        country: personalInfo.country,
        goal: personalInfo.goal
      });
    } catch (err: any) {
      const apiError = handleApiError(err, 'savePersonalInfo');
      throw apiError;
    }
  };

  const saveCareerProfile = async () => {
    try {
      await updateCareerProfile({
        industry: careerProfile.industry,
        job_title: careerProfile.jobTitle,
        profile_summary: careerProfile.profileSummary
      });
    } catch (err: any) {
      const apiError = handleApiError(err, 'saveCareerProfile');
      throw apiError;
    }
  };

  const saveEducation = async () => {
    try {
      for (const edu of education) {
        const educationData = {
          degree: edu.degree,
          school: edu.school,
          start_date: edu.startDate,
          end_date: edu.isStudying ? undefined : edu.endDate,
          is_currently_studying: edu.isStudying,
          extra_curricular: edu.description
        };

        if (edu.id === 'new' || edu.id.startsWith('temp_')) {
          const response = await createEducation(educationData);
          edu.id = response.id.toString();
        } else if (!isNaN(Number(edu.id))) {
          await updateEducation(Number(edu.id), educationData);
        }
      }
    } catch (err: any) {
      const apiError = handleApiError(err, 'saveEducation');
      throw apiError;
    }
  };

  const saveExperience = async () => {
    try {
      for (const exp of experience) {
        const experienceData = {
          job_title: exp.jobTitle,
          company_name: exp.companyName,
          location: exp.location,
          start_date: exp.startDate,
          end_date: exp.isCurrentlyWorking ? undefined : exp.endDate,
          is_currently_working: exp.isCurrentlyWorking,
          description: exp.description
        };

        if (exp.id === 'new' || exp.id.startsWith('temp_')) {
          const response = await createExperience(experienceData);
          exp.id = response.id.toString();
        } else if (!isNaN(Number(exp.id))) {
          await updateExperience(Number(exp.id), experienceData);
        }
      }
    } catch (err: any) {
      const apiError = handleApiError(err, 'saveExperience');
      throw apiError;
    }
  };

  const saveProjects = async () => {
    try {
      for (const project of projects) {
        const projectData = {
          project_title: project.projectTitle,
          start_date: project.startDate,
          end_date: project.isCurrentlyWorking ? undefined : project.endDate,
          is_currently_working: project.isCurrentlyWorking,
          project_link: project.projectLink,
          description: project.description
        };

        if (project.id === 'new' || project.id.startsWith('temp_')) {
          const response = await createProject(projectData);
          project.id = response.id.toString();
        } else if (!isNaN(Number(project.id))) {
          await updateProject(Number(project.id), projectData);
        }
      }
    } catch (err: any) {
      const apiError = handleApiError(err, 'saveProjects');
      throw apiError;
    }
  };

  const saveAIPreferences = async () => {
    try {
      await updateOpportunitiesInterest({
        scholarships: aiPreferences.opportunities.includes('Scholarships'),
        jobs: aiPreferences.opportunities.includes('Jobs'),
        grants: aiPreferences.opportunities.includes('Grants'),
        internships: aiPreferences.opportunities.includes('Internships')
      });

      await updateRecommendationPriority({
        academic_background: aiPreferences.prioritizeBy.includes('My academic background'),
        work_experience: aiPreferences.prioritizeBy.includes('My work experience'),
        preferred_locations: aiPreferences.prioritizeBy.includes('My preferred locations'),
        others: aiPreferences.prioritizeBy.includes('Other'),
        additional_preferences: aiPreferences.salaryExpectation
      });
    } catch (err: any) {
      const apiError = handleApiError(err, 'saveAIPreferences');
      throw apiError;
    }
  };

  // Enhanced Add/Delete functions with error handling
  const addEducation = () => {
    const newEducation: Education = {
      id: `temp_${Date.now()}`,
      degree: '',
      school: '',
      startDate: '',
      endDate: '',
      isStudying: false,
      description: ''
    };
    setEducation([...education, newEducation]);
  };

  const deleteEducationEntry = async (id: string, index: number) => {
    try {
      if (id !== 'new' && !id.startsWith('temp_') && !isNaN(Number(id))) {
        await deleteEducation(Number(id));
      }

      const updated = education.filter((_, i) => i !== index);

      if (updated.length === 0) {
        updated.push({
          id: 'new',
          degree: '',
          school: '',
          startDate: '',
          endDate: '',
          isStudying: false,
          description: ''
        });
      }

      setEducation(updated);
    } catch (err: any) {
      const apiError = handleApiError(err, 'deleteEducationEntry');
      console.error('Failed to delete education entry:', apiError);
      throw apiError;
    }
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: `temp_${Date.now()}`,
      jobTitle: '',
      companyName: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentlyWorking: false,
      description: ''
    };
    setExperience([...experience, newExperience]);
  };

  const deleteExperienceEntry = async (id: string, index: number) => {
    try {
      if (id !== 'new' && !id.startsWith('temp_') && !isNaN(Number(id))) {
        await deleteExperience(Number(id));
      }

      const updated = experience.filter((_, i) => i !== index);

      if (updated.length === 0) {
        updated.push({
          id: 'new',
          jobTitle: '',
          companyName: '',
          location: '',
          startDate: '',
          endDate: '',
          isCurrentlyWorking: false,
          description: ''
        });
      }

      setExperience(updated);
    } catch (err: any) {
      const apiError = handleApiError(err, 'deleteExperienceEntry');
      console.error('Failed to delete experience entry:', apiError);
      throw apiError;
    }
  };

  const addProject = () => {
    const newProject: Project = {
      id: `temp_${Date.now()}`,
      projectTitle: '',
      startDate: '',
      endDate: '',
      isCurrentlyWorking: false,
      projectLink: '',
      description: ''
    };
    setProjects([...projects, newProject]);
  };

  const deleteProjectEntry = async (id: string, index: number) => {
    try {
      if (id !== 'new' && !id.startsWith('temp_') && !isNaN(Number(id))) {
        await deleteProject(Number(id));
      }

      const updated = projects.filter((_, i) => i !== index);

      if (updated.length === 0) {
        updated.push({
          id: 'new',
          projectTitle: '',
          startDate: '',
          endDate: '',
          isCurrentlyWorking: false,
          projectLink: '',
          description: ''
        });
      }

      setProjects(updated);
    } catch (err: any) {
      const apiError = handleApiError(err, 'deleteProjectEntry');
      console.error('Failed to delete project entry:', apiError);
      throw apiError;
    }
  };

  // Enhanced save function that handles all tabs with validation
  const handleSave = async (activeTab: string) => {
    try {
      setLoading(true);
      setValidationErrors({}); // Clear previous validation errors

      const { isValid, errors } = validateTabData(activeTab);
      if (!isValid) {
        setValidationErrors(errors);
        setError('Please fix the validation errors before saving.');
        setLoading(false);
        return;
      }

      switch (activeTab) {
        case 'Personal':
          await savePersonalInfo();
          break;
        case 'Career Profile':
          await saveCareerProfile();
          break;
        case 'Education':
          await saveEducation();
          break;
        case 'Experience':
          await saveExperience();
          break;
        case 'Projects':
          await saveProjects();
          break;
        case 'AI':
          await saveAIPreferences();
          break;
      }

      await fetchProfileData();
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      setError(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  return {
    // State
    loading,
    error,
    profileData,
    personalInfo,
    cvFile,
    careerProfile,
    education,
    experience,
    projects,
    aiPreferences,
    validationErrors,

    // Setters
    setPersonalInfo: setPersonalInfoWithSanitization,
    setCvFile,
    setCareerProfile: setCareerProfileWithSanitization,
    setEducation,
    setExperience,
    setProjects,
    setAIPreferences,

    // Functions
    fetchProfileData,
    handleSave,
    addEducation,
    deleteEducationEntry,
    addExperience,
    deleteExperienceEntry,
    addProject,
    deleteProjectEntry
  };
};
