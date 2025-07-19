import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Home,
  LayoutDashboard,
  Brain,
  Bookmark,
  TrendingUp,
  Settings,
  User,
  HelpCircle,
  LogOut,
  Clock,
  Bookmark as BookmarkIcon,
  Mail,
  Bell,
  UserCircle,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileCompletion from '../components/ProfileCompletion';
import OpportunityList from '../components/OpportunityList';
import ScholarshipList from '../components/ScholarshipList';

const jobs = [
  {
    company: 'Google India',
    role: 'UI Designer',
    location: 'New Delhi',
    match: '90%',
    closing: 'today',
    saved: true,
  },
  {
    company: 'Facebook',
    role: 'UI Designer',
    location: 'New York',
    match: '78%',
    closing: 'in 3 days',
    saved: false,
  },
  {
    company: 'Apple',
    role: 'UI Designer',
    location: 'Sidney',
    match: '90%',
    closing: 'in 8 days',
    saved: false,
  },
  {
    company: 'Slack',
    role: 'UI Designer',
    location: 'London',
    match: '90%',
    closing: 'in 3 days',
    saved: true,
  },
  {
    company: 'Tata Motors',
    role: 'UX Designer',
    location: 'Mumbai',
    match: '60%',
    closing: 'in 9 days',
    saved: false,
  },
  {
    company: 'Yellow slice',
    role: 'UI Designer',
    location: 'New Delhi',
    match: '90%',
    closing: 'in 6 days',
    saved: true,
  },
];

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showSearch, setShowSearch] = useState(true);
  const [filter, setFilter] = useState({
    search: '',
    type: '',
    location: '',
  });
  const [activeTab, setActiveTab] = useState<'jobs' | 'scholarships' | 'grants'>('jobs');
  const { user } = useAuth();

  // Apply filters when search button is clicked or enter is pressed
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

  const filteredJobs = jobs.filter((job) =>
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  const savedJobs = filteredJobs.filter((job) => job.saved);

  return (
    <div className="relative md:flex-row min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6">
        
        <div className="flex justify-between items-center mb-6">
          {showSearch ? (
            <div className="relative w-full max-w-md flex items-center">
              <Search className="absolute left-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search opportunities..."
                className="w-full pl-10 pr-24 py-2 rounded-md border text-sm sm:text-base bg-gray-100"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <XCircle
                className="absolute right-20 text-gray-400 cursor-pointer hover:text-red-500"
                size={18}
                onClick={() => {
                  setSearch('');
                  setShowSearch(false);
                }}
              />
              <button
                onClick={applyFilters}
                className="absolute right-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded"
              >
                Search
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="px-4 py-2 border rounded-md flex items-center gap-2"
            >
              <Search size={18} /> Search Jobs
            </button>
          )}
          {/* <div className="flex items-center gap-4 ml-4">
            <Mail size={20} className="text-gray-600 cursor-pointer hover:text-blue-600" />
            <Bell size={20} className="text-gray-600 cursor-pointer hover:text-blue-600" />
            <UserCircle size={24} className="text-gray-600 cursor-pointer hover:text-blue-600" />
          </div> */}
        </div>

        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg sm:text-xl font-semibold">Welcome back, Adam 😎</h1>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Here's what is happening with your job search applications</p>
        </div>     
        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            {/* Profile Completion Nudge */}
            <ProfileCompletion />
            {/* Latest Opportunities from API */}
            <OpportunityList
              filters={{
                ...filter,
                ordering: '-created_at',
                show_expired: false
              }} 
              title="My AI Matches"
            />
           <OpportunityList 
              filters={{}} 
              title="Saved Jobs"
            />

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Application progress tracker</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="text-sm text-gray-500 bg-gray-50">
                      <th className="px-6 py-3 text-left font-medium">Company name</th>
                      <th className="px-6 py-3 text-left font-medium">Position</th>
                      <th className="px-6 py-3 text-left font-medium">Applied date</th>
                      <th className="px-6 py-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                    {[
                      { company: "Google", position: "UX Designer", date: "11 Mar 2025", status: "In Review" },
                      { company: "Facebook", position: "UI/UX Designer", date: "06 Mar 2025", status: "Rejected" },
                      { company: "TATA", position: "UI Designer", date: "27 Feb 2024", status: "Accepted" },
                      { company: "TATA", position: "UX Designer", date: "09 Feb 2025", status: "Accepted" },
                      { company: "Slack", position: "UI Designer", date: "27 Jan 2025", status: "Awaiting Response" },
                      { company: "Airbnb", position: "UX Designer", date: "08 Jan 2025", status: "Accepted" },
                      { company: "Meta", position: "UI Designer", date: "11 Dec 2024", status: "Rejected" },
                      { company: "Emirate's", position: "UI Designer", date: "08 Dec 2024", status: "Accepted" },
                      { company: "Meta", position: "UI Designer", date: "20 Nov 2025", status: "Rejected" },
                      { company: "Facebook", position: "UI/UX Designer", date: "06 Nov 2025", status: "Rejected" },
                    ].map((app, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{app.company}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{app.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{app.date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                            ${app.status === "Accepted" ? "bg-green-100 text-green-600" : ""}
                            ${app.status === "Rejected" ? "bg-red-100 text-red-600" : ""}
                            ${app.status === "In Review" ? "bg-yellow-100 text-yellow-700" : ""}
                            ${app.status === "Awaiting Response" ? "bg-yellow-50 text-yellow-700" : ""}
                          `}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'scholarships' && (
          <div className="space-y-8">
            <ScholarshipList
              filters={{
                ...filter,
                ordering: '-created_at',
                show_expired: false,
                page_size: 20
              }}
              title="Latest Scholarships"
            />
          </div>
        )}
        {activeTab === 'grants' && (
          <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 mb-8" aria-labelledby="grants-title">
            <div className="max-w-3xl mx-auto text-center">
              <h2
                id="grants-title"
                className="text-3xl sm:text-4xl font-semibold text-purple-500 mb-4"
              >
                Grants Section (Coming Soon)
              </h2>
              <p className="text-gray-700 text-sm sm:text-base mb-8">
                Grants functionality will be available soon. Stay tuned!
              </p>
            </div>
          </section>
        )}

        {activeSection === 'matches' && (
          <section className="mb-10">
          </section>
        )}

        {activeSection === 'saved' && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4">Saved Opportunities</h2>

            {/* We'll replace this with actual saved opportunities API integration later */}
            {savedJobs.length === 0 ? (
              <div className="text-gray-500 text-center p-8 bg-white rounded-lg shadow">
                No saved opportunities found. Browse opportunities and save them for later.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedJobs.map((job, index) => (
                  <div key={index} className="bg-white rounded-xl shadow p-4 relative">
                    <div className="absolute top-4 right-4 text-blue-500">
                      <BookmarkIcon size={18} />
                    </div>
                    <div className="text-lg font-bold mb-1">{job.company}</div>
                    <div className="inline-block text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-semibold mb-3">
                      {job.match} Match
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Role</span>
                      <span>{job.role}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-gray-600">Location</span>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                      <span className="flex items-center"><Clock size={14} className="mr-1" /> Closing {job.closing}</span>
                      <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded">Apply</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeSection === 'progress' && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4">Application Progress</h2>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-center py-10 text-gray-500">
                <p className="mb-4">You haven't applied to any opportunities yet.</p>
                <Link to="/" className="text-blue-500 hover:underline">
                  Browse opportunities to get started
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
