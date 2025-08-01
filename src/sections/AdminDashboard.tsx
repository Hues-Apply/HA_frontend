import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Database,
  Settings,
  Activity,
  Download,
  RefreshCw,
  Globe,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Eye,
  BookOpen,
  Building
} from 'lucide-react';
import { LinkedInJobCrawler } from '../services/linkedinCrawler';
import JobPreviewModal from '../components/JobPreviewModal';

interface CrawlStats {
  total: number;
  success: number;
  failed: number;
  lastRun: string;
}

interface JobPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'crawling';
  stats: CrawlStats;
  description: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isGlobalCrawling, setIsGlobalCrawling] = useState(false);
  const [platformCrawlingStates, setPlatformCrawlingStates] = useState<Record<string, boolean>>({});
  const [crawlResults, setCrawlResults] = useState<Record<string, any>>({});
  const [showJobPreview, setShowJobPreview] = useState(false);
  const [hasCachedJobs, setHasCachedJobs] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    keyword: '',
    jobType: 'all',
    experienceLevel: 'all',
    salary: '',
    datePosted: 'any'
  });

  // Check for cached jobs on component mount
  useEffect(() => {
    const checkCachedJobs = () => {
      const cachedData = LinkedInJobCrawler.getJobsFromLocalStorage();
      setHasCachedJobs(cachedData && cachedData.jobs && cachedData.jobs.length > 0);
    };

    checkCachedJobs();

    // Optionally set up a periodic check or listen for storage events
    const interval = setInterval(checkCachedJobs, 1000);
    return () => clearInterval(interval);
  }, []);

  const jobPlatforms: JobPlatform[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-600',
      status: 'active',
      stats: { total: 1250, success: 1200, failed: 50, lastRun: '2 hours ago' },
      description: 'Professional networking platform with extensive job listings'
    },
    {
      id: 'nextlevel',
      name: 'Next Level Jobs EU',
      icon: '🇪🇺',
      color: 'bg-purple-600',
      status: 'active',
      stats: { total: 850, success: 820, failed: 30, lastRun: '3 hours ago' },
      description: 'European focused job platform'
    },
    {
      id: 'indeed',
      name: 'Indeed',
      icon: '🔍',
      color: 'bg-green-600',
      status: 'active',
      stats: { total: 2100, success: 2050, failed: 50, lastRun: '1 hour ago' },
      description: 'Leading global job search engine'
    },
    {
      id: 'monster',
      name: 'Monster',
      icon: '👹',
      color: 'bg-orange-600',
      status: 'inactive',
      stats: { total: 750, success: 700, failed: 50, lastRun: '1 day ago' },
      description: 'Global employment website'
    },
    {
      id: 'flexjobs',
      name: 'FlexJobs',
      icon: '⏰',
      color: 'bg-teal-600',
      status: 'active',
      stats: { total: 650, success: 630, failed: 20, lastRun: '4 hours ago' },
      description: 'Remote, part-time, and flexible job opportunities'
    },
    {
      id: 'glassdoor',
      name: 'Glassdoor',
      icon: '🏢',
      color: 'bg-emerald-600',
      status: 'active',
      stats: { total: 900, success: 870, failed: 30, lastRun: '2 hours ago' },
      description: 'Company reviews and salary insights'
    },
    {
      id: 'remoteok',
      name: 'Remote OK',
      icon: '🌍',
      color: 'bg-indigo-600',
      status: 'active',
      stats: { total: 400, success: 395, failed: 5, lastRun: '1 hour ago' },
      description: 'Remote work opportunities'
    },
    {
      id: 'weworkremotely',
      name: 'We Work Remotely',
      icon: '💻',
      color: 'bg-pink-600',
      status: 'inactive',
      stats: { total: 300, success: 290, failed: 10, lastRun: '6 hours ago' },
      description: 'Largest remote work community'
    }
  ];

  useEffect(() => {
    // Check for cached jobs on component mount
    const cachedJobs = localStorage.getItem('linkedin_crawled_jobs');
    if (cachedJobs) {
      setHasCachedJobs(true);
      console.log('Cached jobs found:', JSON.parse(cachedJobs));
    } else {
      setHasCachedJobs(false);
    }
  }, []);

  const handleLinkedInCrawl = async () => {
    setPlatformCrawlingStates(prev => ({ ...prev, linkedin: true }));

    try {
      console.log('Starting LinkedIn crawl with filters:', selectedFilters);

      const result = await LinkedInJobCrawler.crawlJobs(selectedFilters);

      if (result.success) {
        console.log(`LinkedIn crawl completed successfully. Found ${result.count} jobs`);

        // Update crawl results
        setCrawlResults(prev => ({
          ...prev,
          linkedin: {
            success: true,
            count: result.count,
            jobs: result.jobs,
            timestamp: new Date().toISOString()
          }
        }));

        // Update cached jobs state
        setHasCachedJobs(result.count > 0);

        // Show success message
        alert(`LinkedIn crawl completed! Found ${result.count} jobs. Use the "Preview Jobs" button to review and edit before saving to backend.`);
      } else {
        console.error('LinkedIn crawl failed:', result.error);
        setCrawlResults(prev => ({
          ...prev,
          linkedin: {
            success: false,
            error: result.error,
            timestamp: new Date().toISOString()
          }
        }));
        alert(`LinkedIn crawl failed: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Unexpected error during LinkedIn crawl:', error);
      setCrawlResults(prev => ({
        ...prev,
        linkedin: {
          success: false,
          error: error.message || 'Unexpected error occurred',
          timestamp: new Date().toISOString()
        }
      }));
      alert(`LinkedIn crawl failed: ${error.message || 'Unexpected error'}`);
    } finally {
      setPlatformCrawlingStates(prev => ({ ...prev, linkedin: false }));
    }
  };

  const handleSingleCrawl = async (platformId: string) => {
    console.log(`Starting crawl for ${platformId}`);

    switch (platformId) {
      case 'linkedin':
        await handleLinkedInCrawl();
        break;
      default:
        alert(`Crawling for ${platformId} is not implemented yet. This will be handled by backend.`);
    }
  };

  const handleGlobalCrawl = () => {
    setIsGlobalCrawling(true);
    console.log('Starting global crawl for all platforms');
    // TODO: Implement global crawling
    setTimeout(() => {
      setIsGlobalCrawling(false);
    }, 3000); // Simulate crawling
  };

  const getTotalStats = () => {
    return jobPlatforms.reduce((acc, platform) => ({
      total: acc.total + platform.stats.total,
      success: acc.success + platform.stats.success,
      failed: acc.failed + platform.stats.failed
    }), { total: 0, success: 0, failed: 0 });
  };

  const totalStats = getTotalStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage jobs, scholarships, and system settings</p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/jobs')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Building className="h-6 w-6 text-blue-600 mr-3" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Manage Jobs</h3>
                <p className="text-sm text-gray-600">View, add, edit, and delete job listings</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/scholarships')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <BookOpen className="h-6 w-6 text-green-600 mr-3" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Manage Scholarships</h3>
                <p className="text-sm text-gray-600">View, add, edit, and delete scholarship listings</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/users-list')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Users className="h-6 w-6 text-purple-600 mr-3" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-600">View and manage user accounts</p>
              </div>
            </button>
          </div>
        </div>

        {/* Job Crawling Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Crawling Dashboard</h2>
          <p className="text-gray-600">Manage and monitor job scraping across multiple platforms</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.success.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <RefreshCw className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.failed.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Platforms</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobPlatforms.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Crawling Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Crawling Controls</h2>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                value={selectedFilters.location}
                onChange={(e) => setSelectedFilters({ ...selectedFilters, location: e.target.value })}
                placeholder="e.g. New York"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Search className="inline h-4 w-4 mr-1" />
                Keyword
              </label>
              <input
                type="text"
                value={selectedFilters.keyword}
                onChange={(e) => setSelectedFilters({ ...selectedFilters, keyword: e.target.value })}
                placeholder="e.g. Software Engineer"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Briefcase className="inline h-4 w-4 mr-1" />
                Job Type
              </label>
              <select
                value={selectedFilters.jobType}
                onChange={(e) => setSelectedFilters({ ...selectedFilters, jobType: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Users className="inline h-4 w-4 mr-1" />
                Experience
              </label>
              <select
                value={selectedFilters.experienceLevel}
                onChange={(e) => setSelectedFilters({ ...selectedFilters, experienceLevel: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Min Salary
              </label>
              <input
                type="number"
                value={selectedFilters.salary}
                onChange={(e) => setSelectedFilters({ ...selectedFilters, salary: e.target.value })}
                placeholder="e.g. 50000"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="inline h-4 w-4 mr-1" />
                Date Posted
              </label>
              <select
                value={selectedFilters.datePosted}
                onChange={(e) => setSelectedFilters({ ...selectedFilters, datePosted: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="any">Any Time</option>
                <option value="24h">Last 24 Hours</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>
          </div>

          {/* Global Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleGlobalCrawl}
              disabled={isGlobalCrawling}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGlobalCrawling ? (
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Download className="h-5 w-5 mr-2" />
              )}
              {isGlobalCrawling ? 'Crawling All Platforms...' : 'Start Global Crawl'}
            </button>

            {/* Preview Jobs Button - shown when cached jobs are available */}
            {hasCachedJobs && (
              <button
                onClick={() => setShowJobPreview(true)}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Eye className="h-5 w-5 mr-2" />
                Preview Jobs
                {(() => {
                  const cachedData = LinkedInJobCrawler.getJobsFromLocalStorage();
                  const count = cachedData?.jobs?.length || 0;
                  return count > 0 ? ` (${count})` : '';
                })()}
              </button>
            )}

            <button className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              <Settings className="h-5 w-5 mr-2" />
              Advanced Settings
            </button>
          </div>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobPlatforms.map((platform) => {
            const isCrawling = platformCrawlingStates[platform.id] || false;
            const crawlResult = crawlResults[platform.id];

            return (
              <div key={platform.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Platform Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 ${platform.color} rounded-lg text-white text-xl`}>
                        {platform.icon}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${isCrawling ? 'bg-yellow-500 animate-pulse' :
                            platform.status === 'active' ? 'bg-green-500' :
                              platform.status === 'crawling' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`}></div>
                          <span className={`text-xs font-medium ${isCrawling ? 'text-yellow-600' :
                            platform.status === 'active' ? 'text-green-600' :
                              platform.status === 'crawling' ? 'text-yellow-600' : 'text-gray-500'
                            }`}>
                            {isCrawling ? 'Crawling...' :
                              platform.status.charAt(0).toUpperCase() + platform.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4">{platform.description}</p>

                  {/* Show recent crawl result if available */}
                  {crawlResult && (
                    <div className={`mb-4 p-3 rounded-lg ${crawlResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${crawlResult.success ? 'text-green-800' : 'text-red-800'
                          }`}>
                          Last Crawl: {crawlResult.success ? 'Success' : 'Failed'}
                        </span>
                        {crawlResult.success && (
                          <span className="text-sm text-green-600">+{crawlResult.count} jobs</span>
                        )}
                      </div>
                      {crawlResult.error && (
                        <p className="text-xs text-red-600 mt-1">{crawlResult.error}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(crawlResult.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Jobs:</span>
                      <span className="font-medium">{platform.stats.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium text-green-600">
                        {((platform.stats.success / platform.stats.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Run:</span>
                      <span className="font-medium">{platform.stats.lastRun}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(platform.stats.success / platform.stats.total) * 100}%` }}
                    ></div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSingleCrawl(platform.id)}
                      disabled={isCrawling || platform.status === 'crawling'}
                      className={`flex-1 py-2 px-4 rounded text-sm font-medium ${platform.status === 'active' && !isCrawling
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      {isCrawling ? (
                        <RefreshCw className="h-4 w-4 mx-auto animate-spin" />
                      ) : (
                        'Start Crawl'
                      )}
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Crawling Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { platform: 'LinkedIn', action: 'Crawl completed', time: '2 minutes ago', status: 'success', count: 156 },
                { platform: 'Indeed', action: 'Crawl started', time: '5 minutes ago', status: 'running', count: 0 },
                { platform: 'FlexJobs', action: 'Crawl completed', time: '15 minutes ago', status: 'success', count: 89 },
                { platform: 'Monster', action: 'Crawl failed', time: '1 hour ago', status: 'error', count: 0 },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'running' ? 'bg-yellow-500 animate-pulse' :
                        'bg-red-500'
                      }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.platform} - {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  {activity.count > 0 && (
                    <span className="text-sm font-medium text-gray-600">
                      +{activity.count} jobs
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Preview Modal */}
      <JobPreviewModal
        isOpen={showJobPreview}
        onClose={() => setShowJobPreview(false)}
        job={null}
      />
    </div>
  );
}
