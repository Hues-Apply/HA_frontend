import { useState } from 'react';
import {
  User,
  ExternalLink,
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

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Personal');
  const { user } = useAuth();

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
      <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-md w-full">
          <p className="text-red-600 mb-4">Failed to load profile data</p>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <button
            onClick={fetchProfileData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const ProfileSidebar = ({ className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm p-4 sm:p-6 border-0 ${className}`}>
      {/* Profile Image */}
      <div className="text-center">
        <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-full mx-auto overflow-hidden border-4 border-white shadow-md">
          {profileData?.profile_picture ? (
            <img
              src={profileData.profile_picture || '/hero/userprofile.svg'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <User size={32} className="text-gray-500" />
            </div>
          )}

          {/* Camera Icon Overlay */}
          <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
            <Camera size={14} className="text-blue-600" />
          </div>
        </div>

        {/* Name & Title */}
        <h3 className="mt-3 sm:mt-4 font-semibold text-base sm:text-lg text-gray-900">
          {personalInfo.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">{careerProfile.jobTitle || 'Job Title'}</p>
      </div>

      {/* Stats */}
      <div className="mt-6 sm:mt-12 space-y-3 sm:space-y-5 text-xs sm:text-sm">
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
      <button className="w-full mt-6 sm:mt-32 py-2 text-xs sm:text-sm text-black font-medium border border-gray-600 rounded-md hover:bg-gray-50 transition">
        View public profile
      </button>

      {/* Profile Link */}
      <div className="mt-3 sm:mt-4 bg-gray-100 text-blue-600 text-xs rounded-md p-2 flex items-center justify-between">
        <div className="truncate flex items-center">
          <ExternalLink size={10} className="mr-1 flex-shrink-0" />
          <span className="truncate">https://www.abc...</span>
        </div>
        <Clipboard size={10} className="ml-2 cursor-pointer flex-shrink-0" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden relative px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero/path-to-star-texture.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-r"></div>
        <div className="relative z-10">
          <h1 className="text-xl font-semibold text-white">Welcome, I'm your AI buddy</h1>
          <p className="text-blue-100 text-sm">Complete your profile</p>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Layout */}
        <div className="hidden lg:block lg:w-full">
          {/* Desktop Header */}
          <div className="h-56 relative bg-gradient-to-r from-blue-600 to-blue-400 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero/path-to-star-texture.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-r"></div>
            <div className="relative z-10 px-12 pt-10">
              <h1 className="text-3xl font-semibold text-white">Welcome, I'm your AI buddy</h1>
              <p className="text-blue-100 mt-1 text-sm">Complete your profile</p>
            </div>

            {/* Desktop Content */}
            <div className="flex mx-6 mt-16 gap-6 relative">
              {/* Desktop Sidebar */}
              <div className="w-80 flex-shrink-0">
                <ProfileSidebar />
              </div>

              {/* Desktop Profile Form */}
              <div className="flex-1 p-6 bg-white rounded-xl shadow-sm border-0">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 -mb-px text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
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
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t">
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
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden w-full">
          <div className="p-4 space-y-4">
            {/* Mobile Profile Sidebar */}
            <ProfileSidebar />

            {/* Mobile Profile Form */}
            <div className="bg-white rounded-xl shadow-sm border-0">
              {/* Mobile Tab Navigation */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto pb-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Tab Content */}
              <div className="p-4">
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

                {/* Mobile Action Buttons */}
                <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => handleSave(activeTab)}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (activeTab === 'AI' ? 'Save' : 'Next')}
                  </button>
                  <button className="w-full px-6 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                    Previous
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
