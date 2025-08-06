import { useState, useEffect } from 'react';
import { X, Download, FileText, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Building2, Calendar, ExternalLink, BookOpen } from 'lucide-react';
import { getUserProfileById } from '../services/profile';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userBasicInfo: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_new_user: boolean;
    created_at: string;
    google_data?: {
      name: string;
      picture: string;
    };
  };
}

interface UserProfileData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  country: string;
  date_joined: string;
  profile_picture?: string;
  phone_number?: string;
  goal?: string;
  cv_filename?: string;
  cv_uploaded_at?: string;
  has_cv_in_gcs?: boolean;
  cv_download_url?: string;
  career_profile?: {
    industry: string;
    job_title: string;
    profile_summary: string;
  };
  education_profiles?: Array<{
    id: number;
    degree: string;
    school: string;
    start_date: string;
    end_date?: string;
    is_currently_studying: boolean;
    extra_curricular: string;
  }>;
  experience_profiles?: Array<{
    id: number;
    job_title: string;
    company_name: string;
    location: string;
    start_date: string;
    end_date?: string;
    is_currently_working: boolean;
    description: string;
  }>;
  project_profiles?: Array<{
    id: number;
    project_title: string;
    start_date: string;
    end_date?: string;
    is_currently_working: boolean;
    project_link: string;
    description: string;
  }>;
  opportunities_interest?: {
    scholarships: boolean;
    jobs: boolean;
    grants: boolean;
    internships: boolean;
  };
  recommendation_priority?: {
    academic_background: boolean;
    work_experience: boolean;
    preferred_locations: boolean;
    others: boolean;
    additional_preferences: string;
  };
  parsed_profile_data?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    portfolio?: string;
    summary?: string;
    education?: Array<{
      institution?: string;
      degree?: string;
      field_of_study?: string;
      start_date?: string;
      end_date?: string;
      gpa?: string;
      description?: string;
    }>;
    experience?: Array<{
      company?: string;
      position?: string;
      start_date?: string;
      end_date?: string;
      is_current?: boolean;
      description?: string;
      achievements?: string[];
    }>;
    skills?: string[];
    certifications?: Array<{
      name: string;
      issuer: string;
      issue_date?: string;
      expiry_date?: string;
      credential_id?: string;
    }>;
    languages?: Array<{
      language: string;
      proficiency: string;
    }>;
    projects?: Array<{
      name?: string;
      title?: string;
      start_date?: string;
      end_date?: string;
      url?: string;
      description?: string;
      technologies?: string[];
    }>;
    confidence_score?: number;
    completion_percentage?: number;
    missing_sections?: string[];
    completed_sections?: string[];
  };
  user_goals?: Array<{
    goal: string;
    goal_display: string;
    priority: number;
  }>;
}

const UserDetailsModal = ({ isOpen, onClose, userId, userBasicInfo }: UserDetailsModalProps) => {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cv' | 'education' | 'experience' | 'projects' | 'skills'>('overview');

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserProfileById(userId);

      if (response.success) {
        setProfileData(response.data);
      } else {
        setError('Failed to load user profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load user profile');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCV = () => {
    if (profileData?.cv_download_url) {
      window.open(profileData.cv_download_url, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {userBasicInfo.google_data?.picture ? (
              <img
                className="h-12 w-12 rounded-full"
                src={userBasicInfo.google_data.picture}
                alt={`${userBasicInfo.first_name} ${userBasicInfo.last_name}`}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {userBasicInfo.first_name?.[0]}{userBasicInfo.last_name?.[0]}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {userBasicInfo.first_name} {userBasicInfo.last_name}
              </h2>
              <p className="text-sm text-gray-500">ID: {userBasicInfo.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user details...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { key: 'overview', label: 'Overview', icon: User },
                  { key: 'cv', label: 'CV/Resume', icon: FileText },
                  { key: 'education', label: 'Education', icon: GraduationCap },
                  { key: 'experience', label: 'Experience', icon: Briefcase },
                  { key: 'projects', label: 'Projects', icon: Building2 },
                  { key: 'skills', label: 'Skills', icon: BookOpen }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Mail size={16} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-gray-900">{userBasicInfo.email}</p>
                        </div>
                      </div>
                      {profileData?.phone_number && (
                        <div className="flex items-center space-x-3">
                          <Phone size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p className="text-gray-900">{profileData.phone_number}</p>
                          </div>
                        </div>
                      )}
                      {profileData?.country && (
                        <div className="flex items-center space-x-3">
                          <MapPin size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Country</p>
                            <p className="text-gray-900">{profileData.country}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <Calendar size={16} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Joined</p>
                          <p className="text-gray-900">{formatDate(userBasicInfo.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Career Profile */}
                  {profileData?.career_profile && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Profile</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        {profileData.career_profile.industry && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Industry</p>
                            <p className="text-gray-900">{profileData.career_profile.industry}</p>
                          </div>
                        )}
                        {profileData.career_profile.job_title && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Job Title</p>
                            <p className="text-gray-900">{profileData.career_profile.job_title}</p>
                          </div>
                        )}
                        {profileData.career_profile.profile_summary && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Profile Summary</p>
                            <p className="text-gray-900">{profileData.career_profile.profile_summary}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Goals */}
                  {profileData?.user_goals && profileData.user_goals.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals</h3>
                      <div className="space-y-2">
                        {profileData.user_goals
                          .sort((a, b) => a.priority - b.priority)
                          .map((goal, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                                {goal.priority}
                              </span>
                              <p className="text-gray-900">{goal.goal_display}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Opportunities Interest */}
                  {profileData?.opportunities_interest && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(profileData.opportunities_interest).map(([key, value]) => (
                          value && (
                            <span
                              key={key}
                              className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full capitalize"
                            >
                              {key}
                            </span>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'cv' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">CV/Resume</h3>
                    {profileData?.cv_filename ? (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <FileText size={20} className="text-blue-500" />
                            <div>
                              <p className="font-medium text-gray-900">{profileData.cv_filename}</p>
                              {profileData.cv_uploaded_at && (
                                <p className="text-sm text-gray-500">
                                  Uploaded: {formatDate(profileData.cv_uploaded_at)}
                                </p>
                              )}
                            </div>
                          </div>
                          {profileData.cv_download_url && (
                            <button
                              onClick={handleDownloadCV}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              <Download size={16} />
                              <span>Download CV</span>
                            </button>
                          )}
                        </div>
                        {profileData.has_cv_in_gcs && (
                          <p className="text-sm text-green-600">✓ CV is available for download</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No CV uploaded yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Education (from CV)</h3>
                  {profileData?.parsed_profile_data?.education && profileData.parsed_profile_data.education.length > 0 ? (
                    <div className="space-y-4">
                      {profileData.parsed_profile_data.education.map((edu: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{edu.degree || edu.institution}</h4>
                            <span className="text-sm text-gray-500">
                              {edu.start_date && formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : 'Present'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{edu.institution || edu.school}</p>
                          {edu.field_of_study && (
                            <p className="text-sm text-gray-500 mb-2">Field: {edu.field_of_study}</p>
                          )}
                          {edu.gpa && (
                            <p className="text-sm text-gray-500 mb-2">GPA: {edu.gpa}</p>
                          )}
                          {edu.description && (
                            <p className="text-sm text-gray-700">{edu.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <GraduationCap size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No education information found in CV</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'experience' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience (from CV)</h3>
                  {profileData?.parsed_profile_data?.experience && profileData.parsed_profile_data.experience.length > 0 ? (
                    <div className="space-y-4">
                      {profileData.parsed_profile_data.experience.map((exp: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{exp.position || exp.job_title}</h4>
                            <span className="text-sm text-gray-500">
                              {exp.start_date && formatDate(exp.start_date)} - {exp.is_current ? 'Present' : (exp.end_date ? formatDate(exp.end_date) : 'Present')}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{exp.company}</p>
                          {exp.description && (
                            <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                          )}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-600 mb-1">Achievements:</p>
                              <ul className="text-sm text-gray-700 list-disc list-inside">
                                {exp.achievements.map((achievement: string, idx: number) => (
                                  <li key={idx}>{achievement}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No work experience found in CV</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'projects' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects (from CV)</h3>
                  {profileData?.parsed_profile_data?.projects && profileData.parsed_profile_data.projects.length > 0 ? (
                    <div className="space-y-4">
                      {profileData.parsed_profile_data.projects.map((project: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{project.name || project.title}</h4>
                            <span className="text-sm text-gray-500">
                              {project.start_date && formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : 'Present'}
                            </span>
                          </div>
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 mb-2"
                            >
                              <ExternalLink size={14} />
                              <span className="text-sm">View Project</span>
                            </a>
                          )}
                          {project.description && (
                            <p className="text-sm text-gray-700">{project.description}</p>
                          )}
                          {project.technologies && (
                            <p className="text-sm text-gray-500 mt-2">Technologies: {project.technologies.join(', ')}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No projects found in CV</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'skills' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills (from CV)</h3>
                  {profileData?.parsed_profile_data?.skills && profileData.parsed_profile_data.skills.length > 0 ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex flex-wrap gap-2">
                          {profileData.parsed_profile_data.skills.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                          Total skills: {profileData.parsed_profile_data.skills.length}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No skills found in CV</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
