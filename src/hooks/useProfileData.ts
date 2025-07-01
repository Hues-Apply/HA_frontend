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

// Interfaces
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
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    country: '',
    goal: ''
  });

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

  // Data fetching
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getComprehensiveProfile();
      
      if (response.success) {
        const profile = response.data;
        setProfileData(profile);
        
        // Populate personal info
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

        // Populate career profile
        setCareerProfile({
          industry: profile.career_profile?.industry || '',
          jobTitle: profile.career_profile?.job_title || '',
          profileSummary: profile.career_profile?.profile_summary || ''
        });

        // Populate education
        const educationData = profile.education_profiles?.map(edu => ({
          id: edu.id.toString(),
          degree: edu.degree || '',
          school: edu.school || '',
          startDate: edu.start_date || '',
          endDate: edu.end_date || '',
          isStudying: edu.is_currently_studying,
          description: edu.extra_curricular || ''
        })) || [];
        
        setEducation(educationData.length > 0 ? educationData : [{
          id: 'new',
          degree: '',
          school: '',
          startDate: '',
          endDate: '',
          isStudying: false,
          description: ''
        }]);

        // Populate experience
        const experienceData = profile.experience_profiles?.map(exp => ({
          id: exp.id.toString(),
          jobTitle: exp.job_title || '',
          companyName: exp.company_name || '',
          location: exp.location || '',
          startDate: exp.start_date || '',
          endDate: exp.end_date || '',
          isCurrentlyWorking: exp.is_currently_working,
          description: exp.description || ''
        })) || [];

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
      console.error('Failed to fetch profile data:', err);
      setError(err.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Save functions
  const savePersonalInfo = async () => {
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
  };

  const saveCareerProfile = async () => {
    await updateCareerProfile({
      industry: careerProfile.industry,
      job_title: careerProfile.jobTitle,
      profile_summary: careerProfile.profileSummary
    });
  };

  const saveEducation = async () => {
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
  };

  const saveExperience = async () => {
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
  };

  const saveProjects = async () => {
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
  };

  const saveAIPreferences = async () => {
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
  };

  // Add/Delete functions for Education
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
    } catch (error) {
      console.error('Failed to delete education entry:', error);
      alert('Failed to delete education entry. Please try again.');
    }
  };

  // Add/Delete functions for Experience
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
    } catch (error) {
      console.error('Failed to delete experience entry:', error);
      alert('Failed to delete experience entry. Please try again.');
    }
  };

  // Add/Delete functions for Projects
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
    } catch (error) {
      console.error('Failed to delete project entry:', error);
      alert('Failed to delete project entry. Please try again.');
    }
  };

  // Save function that handles all tabs
  const handleSave = async (activeTab: string) => {
    try {
      setLoading(true);
      
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
      
      alert('Profile saved successfully!');
      await fetchProfileData();
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
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
    careerProfile,
    education,
    experience,
    projects,
    aiPreferences,
    
    // Setters
    setPersonalInfo,
    setCareerProfile,
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
