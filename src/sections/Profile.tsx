import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Brain,
  Bookmark,
  TrendingUp,
  Settings,
  User,
  HelpCircle,
  LogOut,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  country: string;
  goal: string;
}

interface CareerProfile {
  industry: string;
  jobTitle: string;
  profileSummary: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  isStudying: boolean;
  description: string;
}

interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  description: string;
}

interface Project {
  id: string;
  projectTitle: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  projectLink: string;
  description: string;
}

interface AIPreferences {
  opportunities: string[];
  prioritizeBy: string[];
  salaryExpectation: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Personal');
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

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchProfileData();
  }, []);

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

        // Populate education from new structure
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

        // Populate experience from new structure
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

        // Populate projects from new structure
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

        // Populate AI preferences from new structure
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

  const tabs = ['Personal', 'Career Profile', 'Education', 'Experience', 'Projects', 'AI'];

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Save based on active tab
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
      
      // Refresh data
      await fetchProfileData();
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        // Create new education entry
        const response = await createEducation(educationData);
        // Update the ID in state
        edu.id = response.id.toString();
      } else if (!isNaN(Number(edu.id))) {
        // Update existing education entry
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
        // Create new experience entry
        const response = await createExperience(experienceData);
        // Update the ID in state
        exp.id = response.id.toString();
      } else if (!isNaN(Number(exp.id))) {
        // Update existing experience entry
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
        // Create new project entry
        const response = await createProject(projectData);
        // Update the ID in state
        project.id = response.id.toString();
      } else if (!isNaN(Number(project.id))) {
        // Update existing project entry
        await updateProject(Number(project.id), projectData);
      }
    }
  };

  const saveAIPreferences = async () => {
    // Save opportunities interest
    await updateOpportunitiesInterest({
      scholarships: aiPreferences.opportunities.includes('Scholarships'),
      jobs: aiPreferences.opportunities.includes('Jobs'),
      grants: aiPreferences.opportunities.includes('Grants'),
      internships: aiPreferences.opportunities.includes('Internships')
    });

    // Save recommendation priorities
    await updateRecommendationPriority({
      academic_background: aiPreferences.prioritizeBy.includes('My academic background'),
      work_experience: aiPreferences.prioritizeBy.includes('My work experience'),
      preferred_locations: aiPreferences.prioritizeBy.includes('My preferred locations'),
      others: aiPreferences.prioritizeBy.includes('Other'),
      additional_preferences: aiPreferences.salaryExpectation
    });
  };

  // Add/Delete functions for Education, Experience, and Projects
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
        // Delete from backend if it's an existing entry
        await deleteEducation(Number(id));
      }
      
      // Remove from local state
      const updated = education.filter((_, i) => i !== index);
      
      // Ensure at least one entry remains
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
        // Delete from backend if it's an existing entry
        await deleteExperience(Number(id));
      }
      
      // Remove from local state
      const updated = experience.filter((_, i) => i !== index);
      
      // Ensure at least one entry remains
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
        // Delete from backend if it's an existing entry
        await deleteProject(Number(id));
      }
      
      // Remove from local state
      const updated = projects.filter((_, i) => i !== index);
      
      // Ensure at least one entry remains
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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 mb-4">Failed to load profile data</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchProfileData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 border-r flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Hues Apply</h2>
          <nav className="space-y-2">
            <Link to="/" className="flex items-center text-black font-semibold gap-2 px-2 py-1 rounded hover:bg-gray-200">
              <Home size={18} /> Home
            </Link>
            <Link to="/dashboard" className="flex items-center text-black font-semibold gap-2 px-2 py-1 rounded hover:bg-gray-200">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <div className="flex items-center text-black font-semibold gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-200">
              <Brain size={18} /> My AI Matches
            </div>
            <div className="flex items-center text-black font-semibold gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-200">
              <Bookmark size={18} /> Saved jobs
            </div>
            <div className="flex items-center text-black font-semibold gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-200">
              <TrendingUp size={18} /> Progress tracker
            </div>
          </nav>
        </div>

        <div className="mb-10">
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <Link to="/settings" className="flex items-center gap-2 hover:text-blue-600">
              <Settings size={16} /> Settings
            </Link>
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-2 py-1 rounded">
              <User size={16} /> Profile
            </div>
            <Link to="/help" className="flex items-center gap-2 hover:text-blue-600">
              <HelpCircle size={16} /> Help Center
            </Link>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 hover:text-blue-600 w-full text-left"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm font-medium">
              {personalInfo.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'}
            </div>
            <div className="text-xs text-gray-500">{personalInfo.email || user?.email || 'email@example.com'}</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">Welcome, I'm your AI buddy</h1>
          <p className="text-blue-100">Complete your profile</p>
        </div>

        <div className="flex">
          {/* Profile Sidebar */}
          <div className="w-64 bg-white p-6 border-r">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {profileData?.profile_picture ? (
                  <img src={profileData.profile_picture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-500" />
                )}
              </div>
              <h3 className="font-semibold text-gray-800">
                {personalInfo.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'}
              </h3>
              <p className="text-sm text-gray-600">{careerProfile.jobTitle || 'Job Title'}</p>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-gray-600">Opportunities applied</span>
                <span className="float-right font-semibold text-yellow-600">32</span>
              </div>
              <div>
                <span className="text-gray-600">Opportunities won</span>
                <span className="float-right font-semibold text-green-600">26</span>
              </div>
              <div>
                <span className="text-gray-600">Current Opportunities</span>
                <span className="float-right font-semibold text-blue-600">06</span>
              </div>
            </div>

            <button className="w-full mt-6 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
              View public profile
            </button>

            <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-blue-600 flex items-center">
              <ExternalLink size={12} className="mr-1" />
              https://www.abc...
            </div>
          </div>

          {/* Profile Form */}
          <div className="flex-1 p-6">
            {/* Tab Navigation */}
            <div className="flex space-x-0 mb-6 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg p-6">
              {activeTab === 'Personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={personalInfo.name}
                        onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={personalInfo.country}
                        onChange={(e) => setPersonalInfo({...personalInfo, country: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                    <textarea
                      value={personalInfo.goal}
                      onChange={(e) => setPersonalInfo({...personalInfo, goal: e.target.value})}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'Career Profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <input
                        type="text"
                        value={careerProfile.industry}
                        onChange={(e) => setCareerProfile({...careerProfile, industry: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={careerProfile.jobTitle}
                        onChange={(e) => setCareerProfile({...careerProfile, jobTitle: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Summary</label>
                    <textarea
                      value={careerProfile.profileSummary}
                      onChange={(e) => setCareerProfile({...careerProfile, profileSummary: e.target.value})}
                      rows={5}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'Education' && (
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
              )}

              {activeTab === 'Experience' && (
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4 relative">
                      {experience.length > 1 && (
                        <button
                          onClick={() => deleteExperienceEntry(exp.id, index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          title="Delete experience entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                          <input
                            type="text"
                            value={exp.jobTitle}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[index].jobTitle = e.target.value;
                              setExperience(updated);
                            }}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                          <input
                            type="text"
                            value={exp.companyName}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[index].companyName = e.target.value;
                              setExperience(updated);
                            }}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[index].location = e.target.value;
                            setExperience(updated);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[index].startDate = e.target.value;
                              setExperience(updated);
                            }}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[index].endDate = e.target.value;
                              setExperience(updated);
                            }}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={exp.isCurrentlyWorking}
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={exp.isCurrentlyWorking}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[index].isCurrentlyWorking = e.target.checked;
                              setExperience(updated);
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">I am still working</span>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Describe What you learnt from this company</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[index].description = e.target.value;
                            setExperience(updated);
                          }}
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addExperience}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" />
                    Add More Experience
                  </button>
                </div>
              )}

              {activeTab === 'Projects' && (
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4 relative">
                      {projects.length > 1 && (
                        <button
                          onClick={() => deleteProjectEntry(project.id, index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          title="Delete project entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                        <input
                          type="text"
                          value={project.projectTitle}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[index].projectTitle = e.target.value;
                            setProjects(updated);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={project.startDate}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[index].startDate = e.target.value;
                              setProjects(updated);
                            }}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="date"
                            value={project.endDate}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[index].endDate = e.target.value;
                              setProjects(updated);
                            }}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={project.isCurrentlyWorking}
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={project.isCurrentlyWorking}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[index].isCurrentlyWorking = e.target.checked;
                              setProjects(updated);
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">I am still working on this project</span>
                        </label>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
                        <input
                          type="url"
                          value={project.projectLink}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[index].projectLink = e.target.value;
                            setProjects(updated);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Describe your project</label>
                        <textarea
                          value={project.description}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[index].description = e.target.value;
                            setProjects(updated);
                          }}
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addProject}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" />
                    Add More Projects
                  </button>
                </div>
              )}

              {activeTab === 'AI' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Select the opportunities you're interested with AI</h3>
                    <div className="space-y-2">
                      {['Scholarships', 'Jobs', 'Grants', 'Internships'].map((opportunity) => (
                        <label key={opportunity} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={aiPreferences.opportunities.includes(opportunity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAIPreferences({
                                  ...aiPreferences,
                                  opportunities: [...aiPreferences.opportunities, opportunity]
                                });
                              } else {
                                setAIPreferences({
                                  ...aiPreferences,
                                  opportunities: aiPreferences.opportunities.filter(o => o !== opportunity)
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{opportunity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Prioritize recommendation based on</h3>
                    <div className="space-y-2">
                      {['My academic background', 'My work experience', 'My preferred locations', 'Other'].map((priority) => (
                        <label key={priority} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={aiPreferences.prioritizeBy.includes(priority)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAIPreferences({
                                  ...aiPreferences,
                                  prioritizeBy: [...aiPreferences.prioritizeBy, priority]
                                });
                              } else {
                                setAIPreferences({
                                  ...aiPreferences,
                                  prioritizeBy: aiPreferences.prioritizeBy.filter(p => p !== priority)
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{priority}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional preferences</label>
                    <textarea
                      value={aiPreferences.salaryExpectation}
                      onChange={(e) => setAIPreferences({...aiPreferences, salaryExpectation: e.target.value})}
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button className="px-6 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                  Previous
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {activeTab === 'AI' ? 'Save' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
