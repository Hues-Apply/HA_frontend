import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getScholarship, getScholarships, ScholarshipDetail, Scholarship, applyToScholarship, getScholarshipApplicationStatus } from '../services/scholarships';

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">{children}</span>
);

const ScholarshipDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [scholarship, setScholarship] = useState<ScholarshipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similar, setSimilar] = useState<Scholarship[]>([]);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [loadingApply, setLoadingApply] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getScholarship(id)
      .then(data => {
        setScholarship(data);
        setLoading(false);
        // Fetch similar scholarships by source, excluding current
        if (data.source) {
          getScholarships({ source: data.source, page_size: 3, exclude: id })
            .then(res => setSimilar(res.results || []));
        }
      })
      .catch(() => {
        setError('Failed to load scholarship details.');
        setLoading(false);
      });
    // Fetch user's applied scholarships
    getScholarshipApplicationStatus().then(res => {
      if (res && res.applications) {
        setUserApplications(res.applications);
      }
    });
  }, [id]);

  useEffect(() => {
    if (!scholarship || !userApplications.length) return;
    const found = userApplications.find((a: any) => (a.scholarship?.id || a.scholarship_id) && String(a.scholarship?.id || a.scholarship_id) === String(scholarship.id) && a.applied);
    setApplied(!!found);
  }, [scholarship, userApplications]);

  const handleApply = () => {
    setShowModal(true);
  };

  const confirmApply = async () => {
    if (!id || !scholarship?.application_link) return;
    try {
      setLoadingApply(true);
      await applyToScholarship(id);
      setApplied(true);
      setShowModal(false);
      setLoadingApply(false);
      window.open(scholarship.application_link, '_blank');
    } catch (e) {
      setLoadingApply(false);
      setShowModal(false);
    }
  };

  const cancelApply = () => setShowModal(false);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading scholarship details...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!scholarship) {
    return <div className="p-8 text-center text-gray-500">Scholarship not found.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-7xl mx-auto">
      {/* Main Content */}
      <div className="flex-1 bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Scholarship</h2>
            <div className="mt-2">
              <h1 className="text-2xl font-bold text-gray-900">{scholarship.title}</h1>
              <div className="flex flex-wrap mt-1">
                {/* Example tags, replace with real tags if available */}
                {scholarship.course && <Tag>{scholarship.course}</Tag>}
                {scholarship.gpa && <Tag>GPA: {scholarship.gpa}</Tag>}
                {/* Add more tags as needed */}
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="mr-2">{scholarship.location}</span>
                {/* Fit score placeholder, replace with real value if available */}
              </div>
              {scholarship.deadline && (
                <div className="text-sm text-gray-500 mt-1">
                  Due: <span className="font-semibold">{scholarship.deadline}</span>
                </div>
              )}
            </div>
          </div>
          {scholarship.application_link && (
            <>
              <button
                onClick={handleApply}
                disabled={applied}
                className={`px-6 py-2 rounded font-semibold text-white ${applied ? 'bg-green-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {applied ? 'Applied' : 'Apply now'}
              </button>
              {/* Modal */}
              {showModal && !applied && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                    <h2 className="text-lg font-semibold mb-2">Leave HuesApply?</h2>
                    <p className="mb-4 text-gray-700">You'll be moved to another page to complete your application. Continue?</p>
                    <div className="flex justify-end gap-2">
                      <button onClick={cancelApply} className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold">Cancel</button>
                      <button onClick={confirmApply} disabled={loadingApply} className={`px-4 py-2 rounded font-semibold text-white ${loadingApply ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {loadingApply ? (
                          <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>Loading...</span>
                        ) : 'Continue'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {/* About */}
        <section className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-1">About this scholarship</h3>
          <p className="text-gray-700 whitespace-pre-line">{scholarship.full_description || ''}</p>
        </section>
        {/* Overview */}
        {scholarship.overview && (
          <div className="mt-3 text-base text-gray-700 font-medium bg-gray-50 rounded p-3 mb-6">
            {scholarship.overview}
          </div>
        )}
        {/* Benefits */}
        {scholarship.benefits && scholarship.benefits.length > 0 && (
          <section className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-1">Benefits</h3>
            <ul className="list-disc ml-6 text-gray-700">
              {scholarship.benefits.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
        )}
        {/* Application Process */}
        {scholarship.application_process && (
          <section className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-1">Application Process</h3>
            <p className="text-gray-700 whitespace-pre-line">{scholarship.application_process}</p>
          </section>
        )}
        {/* Attachments & Links */}
        {scholarship.provider_details?.website && (
          <section>
            <h3 className="font-semibold text-gray-800 mb-1">Attachments & Links</h3>
            <ul className="list-disc ml-6 text-blue-700">
              <li><a href={scholarship.provider_details.website} className="hover:underline" target="_blank" rel="noopener noreferrer">Official Scholarship Website</a></li>
            </ul>
          </section>
        )}
      </div>
      {/* Sidebar */}
      <aside className="w-full md:w-96 bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Similar Scholarships</h3>
        {similar.length === 0 ? (
          <div className="text-gray-400 text-sm">No similar scholarships found.</div>
        ) : (
          <div className="space-y-4">
            {similar.map(s => (
              <div key={s.id} className="border rounded-lg p-4 flex flex-col gap-2 bg-gray-50">
                <div className="font-semibold text-gray-900 text-sm">{s.title}</div>
                <div className="flex items-center text-xs text-gray-500 gap-4">
                  {s.amount && <span>💰 {s.amount}</span>}
                  {s.deadline && <span>🗓️ {s.deadline}</span>}
                </div>
                <a href={`/dashboard/scholarships/${s.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm font-semibold self-start">View Details</a>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
};

export default ScholarshipDetails;
