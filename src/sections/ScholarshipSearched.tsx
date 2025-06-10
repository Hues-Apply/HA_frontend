import { useState } from 'react';
import { MapPin, Search, DollarSign, Calendar } from 'lucide-react';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('india');

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="flex justify-between items-center px-10 py-5">
        <h1 className="text-blue-500 text-xl font-bold">Hues Apply</h1>
        <nav className="flex gap-6 items-center text-gray-600">
          <button className="bg-blue-100 text-blue-500 px-4 py-1 rounded-full">Home</button>
          <a href="#">About us</a>
          <a href="#">Dashboard</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
          <button className="px-4 py-1">Login</button>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-full">Register</button>
        </nav>
      </header>

      <main className="px-10 py-16 text-center">
        <span className="bg-blue-100 text-blue-500 px-4 py-1 rounded-full text-sm">
          No.1 job searching and scholarship getting platform
        </span>
        <h2 className="text-5xl font-bold mt-6 leading-tight">
          Find Your Perfect Opportunity<br />with AI
        </h2>
        <p className="text-gray-500 mt-4">
          Our platform provides the opportunities prospectives all around the world a chance in you
        </p>

        <div className="flex items-center justify-between mt-8 bg-gray-100 rounded-full px-4 py-2 max-w-4xl mx-auto shadow-sm">
          <div className="flex items-center w-full max-w-sm">
            <Search className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Post metric scholarship"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-transparent outline-none text-sm"
            />
          </div>
          <div className="w-px h-6 bg-gray-300 mx-4" />
          <div className="flex items-center">
            <MapPin className="text-gray-400 mr-2" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent outline-none text-sm"
            />
          </div>
          <button className="rounded-full px-6 py-2 text-sm ml-4 bg-blue-500 text-white">Search</button>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Upload or create a resume to easily apply to job
        </p>

        <section className="mt-12 text-left bg-gray-50 px-6 py-6 rounded-xl shadow-sm">
          <h3 className="text-base font-semibold mb-4">Available Scholarships</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4 space-y-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 533.5 544.3"
                          className="w-full h-full"
                        >
                          <path
                            fill="#4285F4"
                            d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.2H272v95.1h146.9c-6.4 34.2-25.4 63.1-54.2 82.4v68h87.4c51.1-47.1 81.4-116.4 81.4-195.3z"
                          />
                          <path
                            fill="#34A853"
                            d="M272 544.3c73.7 0 135.5-24.5 180.6-66.5l-87.4-68c-24.3 16.3-55.4 25.8-93.2 25.8-71.5 0-132-48.3-153.7-113.2H28.9v70.8C74.1 478.1 167.7 544.3 272 544.3z"
                          />
                          <path
                            fill="#FBBC04"
                            d="M118.3 322.4c-10.7-31.6-10.7-65.6 0-97.2V154.4H28.9c-38.4 75.9-38.4 165.1 0 241l89.4-70.8z"
                          />
                          <path
                            fill="#EA4335"
                            d="M272 107.6c39.9-.6 78.2 13.8 107.6 40.1l80.2-80.2C407.4 24.5 345.7 0 272 0 167.7 0 74.1 66.2 28.9 154.4l89.4 70.8C140 155.9 200.5 107.6 272 107.6z"
                          />
                        </svg>
                      </div>
                      <p className="font-semibold text-sm leading-snug">
                        Google Women Techmakers Scholarship
                      </p>
                    </div>

                    {/* The fixed span with closing tag */}
                    <span className="text-[10px] bg-green-100 text-green-600 px-3 py-1 rounded-full inline-block w-max">
                      90% Fit score
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-[11px]">Amount:</p>
                      </div>
                      <p className="font-semibold text-black ml-5">$ 20,000</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-[11px]">Deadline:</p>
                      </div>
                      <p className="font-semibold text-black ml-5">July 10, 2025</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600">
                    Empowering women in computer science with tuition support and mentorship.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-blue-600">
                    <span className="bg-blue-100 px-2 py-1 rounded-full">Women in STEM</span>
                    <span className="bg-blue-100 px-2 py-1 rounded-full">Undergraduate</span>
                    <span className="bg-blue-100 px-2 py-1 rounded-full">Fully Funded</span>
                  </div>
                  <p className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-md">
                    Because you're a STEM undergrad from India graduating in 2025.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
