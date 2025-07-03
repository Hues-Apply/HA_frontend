import { useState } from 'react';
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
  ExternalLink,
  Edit,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../hooks/useProfileData';
import PersonalTab from '../components/PersonalTab';
import CareerProfileTab from '../components/CareerProfileTab';
import EducationTab from '../components/EducationTab';
import ExperienceTab from '../components/ExperienceTab';
import ProjectsTab from '../components/ProjectsTab';
import AITab from '../components/AITab';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Personal');
  const { user, logout } = useAuth();

  // Use the custom hook for all profile data and logic
  const {
    loading,
    error,
    profileData,
    personalInfo,
    careerProfile,
    education,
    experience,
    projects,
    aiPreferences,
    setPersonalInfo,
    setCareerProfile,
    setEducation,
    setExperience,
    setProjects,
    setAIPreferences,
    fetchProfileData,
    handleSave,
    addEducation,
    deleteEducationEntry,
    addExperience,
    deleteExperienceEntry,
    addProject,
    deleteProjectEntry
  } = useProfileData();

  const tabs = ['Personal', 'Career Profile', 'Education', 'Experience', 'Projects', 'AI'];

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
            <Link to="/admin" className="flex items-center text-black font-semibold gap-2 px-2 py-1 rounded hover:bg-gray-200">
              <Settings size={18} /> Admin Panel
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
                <PersonalTab 
                  personalInfo={personalInfo}
                  setPersonalInfo={setPersonalInfo}
                />
              )}

              {activeTab === 'Career Profile' && (
                <CareerProfileTab 
                  careerProfile={careerProfile}
                  setCareerProfile={setCareerProfile}
                />
              )}

              {activeTab === 'Education' && (
                <EducationTab
                  education={education}
                  setEducation={setEducation}
                  addEducation={addEducation}
                  deleteEducationEntry={deleteEducationEntry}
                />
              )}

              {activeTab === 'Experience' && (
                <ExperienceTab
                  experience={experience}
                  setExperience={setExperience}
                  addExperience={addExperience}
                  deleteExperienceEntry={deleteExperienceEntry}
                />
              )}

              {activeTab === 'Projects' && (
                <ProjectsTab
                  projects={projects}
                  setProjects={setProjects}
                  addProject={addProject}
                  deleteProjectEntry={deleteProjectEntry}
                />
              )}

              {activeTab === 'AI' && (
                <AITab
                  aiPreferences={aiPreferences}
                  setAIPreferences={setAIPreferences}
                />
              )}

              {/* Action Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button className="px-6 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                  Previous
                </button>
                <button 
                  onClick={() => handleSave(activeTab)}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (activeTab === 'AI' ? 'Save' : 'Next')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
