import { useState } from 'react';
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

  const filteredJobs = jobs.filter((job) =>
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  const savedJobs = filteredJobs.filter((job) => job.saved);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 border-r flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Hues Apply</h2>
          <nav className="space-y-2">
            <div
              className={`flex items-center text-black font-semibold gap-2 px-2 py-1 rounded cursor-pointer ${
                activeSection === 'home' ? 'bg-gray-200' : ''
              }`}
              onClick={() => setActiveSection('home')}
            >
              <Home size={18} /> Home
            </div>
            <div
              className={`flex items-center text-black font-semibold gap-2 px-2 py-1 rounded cursor-pointer ${
                activeSection === 'dashboard' ? 'bg-gray-200' : ''
              }`}
              onClick={() => setActiveSection('dashboard')}
            >
              <LayoutDashboard size={18} /> Dashboard
            </div>
            <div
              className={`flex items-center text-black font-semibold gap-2 px-2 py-1 rounded cursor-pointer ${
                activeSection === 'matches' ? 'bg-gray-200' : ''
              }`}
              onClick={() => setActiveSection('matches')}
            >
              <Brain size={18} /> My AI Matches
            </div>
            <div
              className={`flex items-center text-black font-semibold gap-2 px-2 py-1 rounded cursor-pointer ${
                activeSection === 'saved' ? 'bg-gray-200' : ''
              }`}
              onClick={() => setActiveSection('saved')}
            >
              <Bookmark size={18} /> Saved jobs
            </div>
            <div
              className={`flex items-center text-black font-semibold gap-2 px-2 py-1 rounded cursor-pointer ${
                activeSection === 'progress' ? 'bg-gray-200' : ''
              }`}
              onClick={() => setActiveSection('progress')}
            >
              <TrendingUp size={18} /> Progress tracker
            </div>
          </nav>
        </div>

        <div className="mb-10">
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Settings size={16} /> Settings
            </div>
            <div className="flex items-center gap-2">
              <User size={16} /> Profile
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle size={16} /> Help Center
            </div>
            <div className="flex items-center gap-2">
              <LogOut size={16} /> Logout
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm font-medium">Adam Zampa</div>
            <div className="text-xs text-gray-500">adamzampa@gmail.com</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-semibold">Welcome back, Adam 😎</h1>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Here's what is happening with your job search applications</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          {showSearch ? (
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Type to search"
                className="w-full px-4 py-2 border rounded-md pl-10 pr-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <XCircle
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer hover:text-red-500"
                size={20}
                onClick={() => {
                  setSearch('');
                  setShowSearch(false);
                }}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="px-4 py-2 border rounded-md flex items-center gap-2"
            >
              <Search size={18} /> Search Jobs
            </button>
          )}

          <div className="flex items-center gap-4 ml-4">
            <Mail size={20} className="text-gray-600 cursor-pointer hover:text-blue-600" />
            <Bell size={20} className="text-gray-600 cursor-pointer hover:text-blue-600" />
            <UserCircle size={24} className="text-gray-600 cursor-pointer hover:text-blue-600" />
          </div>
        </div>

        {(activeSection === 'dashboard' || activeSection === 'matches') && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4">My AI Matches</h2>
            {filteredJobs.length === 0 ? (
              <div className="text-gray-500 text-center">No matches found for your search.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job, index) => (
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

        {(activeSection === 'dashboard' || activeSection === 'saved') && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Saved jobs</h2>
            {savedJobs.length === 0 ? (
              <div className="text-gray-500 text-center">No saved jobs available.</div>
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
      </main>
    </div>
  );
}
