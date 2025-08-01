import { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaFilter } from "react-icons/fa";
import OpportunityList from "../components/OpportunityList";
import ScholarshipList from "../components/ScholarshipList";
import ProfileCompletion from "../components/ProfileCompletion";
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import {
  Clock,
  Bookmark as BookmarkIcon,
  Briefcase,
  GraduationCap,
  DollarSign,
  Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RecommendedScholarships from '../components/RecommendedScholarships';
import LoadingSpinner from '../components/LoadingSpinner';
import { getOpportunities } from '../services/opportunities';
import { Opportunity } from '../types/opportunities';

const tabs = [
  {
    id: 'jobs',
    label: 'Jobs',
    icon: Briefcase,
    color: 'blue'
  },
  {
    id: 'scholarships',
    label: 'Scholarships',
    icon: GraduationCap,
    color: 'green'
  },
  {
    id: 'recommendedScholarships',
    label: 'Recommended Scholarships',
    icon: Star,
    color: 'green'
  },
  {
    id: 'grants',
    label: 'Grants',
    icon: DollarSign,
    color: 'purple'
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    search: '',
    type: '',
    location: '',
  });
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch saved opportunities
  useEffect(() => {
    const fetchSavedOpportunities = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getOpportunities({
          saved: true,
          page_size: 20
        });
        setSavedOpportunities(response.results || []);
      } catch (err) {
        console.error('Error fetching saved opportunities:', err);
        setError('Failed to load saved opportunities');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedOpportunities();
  }, [user]);

  const applyFilters = () => {
    setFilter({
      ...filter,
      search
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  const filteredSavedOpportunities = savedOpportunities.filter((opportunity) =>
    opportunity.title?.toLowerCase().includes(search.toLowerCase()) ||
    opportunity.company?.toLowerCase().includes(search.toLowerCase()) ||
    opportunity.location?.toLowerCase().includes(search.toLowerCase())
  );

  const getTabStyles = (tab: typeof tabs[0], isActive: boolean) => {
    const baseStyle = "relative flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 font-medium text-xs sm:text-sm rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 flex-1 sm:flex-initial";

    if (isActive) {
      const colorMap = {
        blue: 'bg-blue-600 text-white shadow-lg shadow-blue-200 focus:ring-blue-500',
        green: 'bg-green-600 text-white shadow-lg shadow-green-200 focus:ring-green-500',
        purple: 'bg-purple-600 text-white shadow-lg shadow-purple-200 focus:ring-purple-500'
      };
      return `${baseStyle} ${colorMap[tab.color as keyof typeof colorMap]}`;
    } else {
      const colorMap = {
        blue: 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md focus:ring-blue-500',
        green: 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-600 hover:shadow-md focus:ring-green-500',
        purple: 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600 hover:shadow-md focus:ring-purple-500'
      };
      return `${baseStyle} ${colorMap[tab.color as keyof typeof colorMap]}`;
    }
  };

  // SEO meta tags based on active tab
  const getSEOMeta = () => {
    switch (activeTab) {
      case 'jobs':
        return {
          title: 'Find Jobs & Career Opportunities | Hues Apply',
          description: 'Discover thousands of job opportunities worldwide. Find remote jobs, internships, and career positions tailored to your skills and experience. Apply with one click.',
          keywords: 'jobs, career opportunities, remote jobs, job search, employment, internships, job applications, career development',
          tags: ['jobs', 'career', 'opportunities', 'employment', 'remote work']
        };
      case 'scholarships':
        return {
          title: 'Find Scholarships & Education Funding | Hues Apply',
          description: 'Discover scholarships, grants, and education funding opportunities worldwide. Find scholarships for students, graduate funding, and international education support.',
          keywords: 'scholarships, education funding, student grants, graduate scholarships, international scholarships, education opportunities',
          tags: ['scholarships', 'education', 'funding', 'grants', 'student aid']
        };
      case 'grants':
        return {
          title: 'Find Grants & Funding Opportunities | Hues Apply',
          description: 'Discover grants, funding opportunities, and financial support for projects, research, and business development. Find government grants and private funding.',
          keywords: 'grants, funding opportunities, business grants, research funding, government grants, financial support',
          tags: ['grants', 'funding', 'business', 'research', 'financial support']
        };
      default:
        return {
          title: 'Career Dashboard | Hues Apply',
          description: 'Your personalized career dashboard. Find jobs, scholarships, and grants tailored to your profile. Track applications and discover new opportunities.',
          keywords: 'career dashboard, job search, scholarship search, grant opportunities, career platform',
          tags: ['career', 'dashboard', 'opportunities', 'applications']
        };
    }
  };

  const seoMeta = getSEOMeta();

  return (
    <>
      <SEO
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords}
        url={`https://huesapply.com/dashboard?tab=${activeTab}`}
        type="website"
      />
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">

          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Welcome back, Adam 😎</h1>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Here's what is happening with your job search applications</p>
          </div>

          <div className="mb-8">
            {/* Mobile View */}
            <div className="flex sm:hidden gap-1 p-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar w-fit mx-auto translate-z-20">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'jobs' | 'scholarships' | 'recommendedScholarships' | 'grants')}
                    className={getTabStyles(tab, activeTab === tab.id)}
                  >
                    <IconComponent size={16} />
                    <span className="hidden xs:inline">{tab.label}</span>
                    <span className="xs:hidden">{tab.label.slice(0, 4)}</span>
                    {activeTab === tab.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-75">
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:flex gap-3 p-1 bg-white rounded-xl shadow-sm border border-gray-100 w-fit mx-auto lg:mx-0">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'jobs' | 'scholarships' | 'recommendedScholarships' | 'grants')}
                    className={getTabStyles(tab, activeTab === tab.id)}
                  >
                    <IconComponent size={18} />
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-75">
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional rendering based on activeTab */}
          {activeTab === 'jobs' && activeSection === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Profile Completion Nudge */}
              <ProfileCompletion />
              {/* Latest Opportunities from API */}
              <OpportunityList
                filters={{
                  ...filter,
                  ordering: '-created_at',
                  show_expired: false
                }}
                title="Latest Opportunities"
              />
            </div>
          )}

          {activeTab === 'scholarships' && (
            <div className="space-y-6 sm:space-y-8">
              <ScholarshipList
                filters={{
                  ...filter,
                  ordering: '-created_at',
                  show_expired: false,
                  page_size: 9
                }}
                showProfileCompletion={true}
                title="Latest Scholarships"
              />
            </div>
          )}

          {activeTab === 'recommendedScholarships' && (
            <div className="space-y-6 sm:space-y-8">
              <RecommendedScholarships
                filters={{
                  ...filter,
                  ordering: '-created_at',
                  show_expired: false,
                  page_size: 10
                }}
                title="Recommended Scholarships"
              />
            </div>
          )}

          {activeTab === 'grants' && (
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mb-8" aria-labelledby="grants-title">
              <div className="max-w-3xl mx-auto text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
                <h2
                  id="grants-title"
                  className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-purple-500 mb-3 sm:mb-4"
                >
                  Grants Section
                </h2>
                <p className="text-gray-700 text-sm sm:text-base mb-6 sm:mb-8 px-2">
                  Grants functionality will be available soon. Stay tuned!
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                  <Clock className="w-4 h-4 mr-2" />
                  Coming Soon
                </div>
              </div>
            </section>
          )}

          {activeSection === 'matches' && (
            <section className="mb-8 sm:mb-10">
            </section>
          )}

          {activeSection === 'saved' && (
            <section className="mb-8 sm:mb-10">
              <h2 className="text-lg font-semibold mb-4">Saved Opportunities</h2>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size="lg" text="Loading saved opportunities..." />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center p-6 sm:p-8 bg-red-50 rounded-lg border border-red-200">
                  <p className="mb-2">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Try again
                  </button>
                </div>
              ) : filteredSavedOpportunities.length === 0 ? (
                <div className="text-gray-500 text-center p-6 sm:p-8 bg-white rounded-lg shadow">
                  {search ? 'No saved opportunities match your search.' : 'No saved opportunities found. Browse opportunities and save them for later.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSavedOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="bg-white rounded-xl shadow p-4 relative hover:shadow-md transition-shadow">
                      <div className="absolute top-4 right-4 text-blue-500">
                        <BookmarkIcon size={18} />
                      </div>
                      <div className="text-lg font-bold mb-1 pr-8">{opportunity.company}</div>
                      {opportunity.match_percentage && (
                        <div className="inline-block text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-semibold mb-3">
                          {opportunity.match_percentage}% Match
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Role</span>
                        <span className="font-medium">{opportunity.title}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-600">Location</span>
                        <span className="font-medium">{opportunity.location}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {opportunity.deadline ? `Closing ${new Date(opportunity.deadline).toLocaleDateString()}` : 'No deadline'}
                        </span>
                        <button
                          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label={`Apply to ${opportunity.title} at ${opportunity.company}`}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === 'progress' && (
            <section className="mb-8 sm:mb-10">
              <h2 className="text-lg font-semibold mb-4">Application Progress</h2>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-center py-8 sm:py-10 text-gray-500">
                  <p className="mb-4 text-sm sm:text-base">You haven't applied to any opportunities yet.</p>
                  <Link to="/" className="text-blue-500 hover:underline text-sm sm:text-base">
                    Browse opportunities to get started
                  </Link>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
