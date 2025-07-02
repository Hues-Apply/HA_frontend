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
  Clipboard,
  Camera,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../hooks/useProfileData';
import PersonalTab from '../components/PersonalTab';
import CareerProfileTab from '../components/CareerProfileTab';
import EducationTab from '../components/EducationTab';
import ExperienceTab from '../components/ExperienceTab';
import ProjectsTab from '../components/ProjectsTab';
import AITab from '../components/AITab';
import { SidebarLayout, SidebarItem } from '../components/SidebarLayout'

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
      <SidebarLayout profileData={profileData} personalInfo={personalInfo}>
      <SidebarItem icon={<Home size={20} />} text="Home" link="/" />
      <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" link="/dashboard" />
      <SidebarItem icon={<Brain size={20} />} text="My AI Matches" />
      <SidebarItem icon={<Bookmark size={20} />} text="Saved Jobs" />
      <SidebarItem icon={<TrendingUp size={20} />} text="Progress Tracker" />
      <SidebarItem icon={<User size={20} />} text="Profile" />
      <SidebarItem icon={<Settings size={20} />} text="Settings" link="/settings" />
      <SidebarItem icon={<HelpCircle size={20} />} text="Help Center" link="/help" />
      <SidebarItem
        icon={<LogOut size={20} />}
        text="Logout"
        link="#"
        onClick={logout}
      />
      </SidebarLayout>


      {/* Main Content */}
      <main className="flex-1 relative">
        {/* Header */}
      <div className="absolute top-0 left-0 w-full h-56 bg-gradient-to-r from-blue-600 to-blue-400 bg-stars z-0">
        <div className="relative z-10 px-12 pt-10">
          <h1 className="text-3xl font-semibold text-white">Welcome, I’m your AI buddy</h1>
          <p className="text-blue-100 mt-1 text-sm">Complete your profile</p>
        </div>


        <div className="flex left-2.5 mt-6 mx-6 gap-6">
          {/* Profile Sidebar */}
          <div className="w-72 bg-white rounded-xl shadow-sm p-6 border">
            {/* Profile Image */}
            <div className="text-center">
              <div className="relative w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-white shadow-md">
                {profileData?.profile_picture ? (
                  <img
                    src={profileData.profile_picture || '/hero/userprofile.svg'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-gray-500 w-full h-full flex items-center justify-center" />
                )}

                {/* Camera Icon Overlay */}
                <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
                  <Camera size={16} className="text-blue-600" />
                </div>
              </div>

              {/* Name & Title */}
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                {personalInfo.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'}
              </h3>
              <p className="text-sm text-gray-500">{careerProfile.jobTitle || 'Job Title'}</p>
            </div>

            {/* Stats */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Opportunities applied</span>
                <span className="font-medium text-orange-500">32</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Opportunities won</span>
                <span className="font-medium text-green-600">26</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Current Opportunities</span>
                <span className="font-medium text-blue-600">06</span>
              </div>
            </div>

            {/* View Profile Button */}
            <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium border border-blue-600 rounded-md hover:bg-blue-50 transition">
              View public profile
            </button>

            {/* Profile Link */}
            <div className="mt-4 bg-gray-100 text-blue-600 text-xs rounded-md p-2 flex items-center justify-between">
              <div className="truncate flex items-center">
                <ExternalLink size={12} className="mr-1" />
                https://www.abc...
              </div>
              <Clipboard size={12} className="ml-2 cursor-pointer" />
            </div>
          </div>


          {/* Profile Form */}
          <div className="flex-1 p-6 bg-white rounded-xl shadow-sm border">
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

        
      </div>

        
      </main>

    </div>
  );
}


