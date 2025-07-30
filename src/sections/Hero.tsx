import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import SEO from '../components/SEO';

const Hero = () => {
    const images = [[
        "/hero/google.svg",
        "/hero/samsung.svg",
        "/hero/meta.svg",
        "/hero/wipro.svg",
        "/hero/infosys.svg",
        "/hero/slack.svg"
    ], [
        "/hero/mastercard.svg",
        "/hero/jpmorgan.svg",
        "/hero/americanairline.svg",
        "/hero/zomato.svg",
        "/hero/visa.svg",
        "/hero/airbnb.svg"
    ]];

    return (
        <>
            <SEO
                title="Find Scholarships, Jobs & Grants | AI-Powered Career Platform"
                description="Discover thousands of scholarships, jobs, and grants tailored for you. Free AI-powered platform helping students and professionals find opportunities worldwide. Apply to scholarships, find remote jobs, and get career guidance."
                keywords="scholarships, grants, jobs, career opportunities, remote jobs, student scholarships, job search, career platform, AI career matching, education funding, internship opportunities, graduate scholarships, undergraduate scholarships, international scholarships, job applications, career guidance, free scholarships, scholarship search, job opportunities, grant opportunities"
                url="https://huesapply.com/"
                tags={['scholarships', 'grants', 'jobs', 'career', 'education', 'opportunities']}
            />
            <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-[5rem] sm:pt-[8rem]" aria-labelledby="hero-title">
                <div className="text-[#3D84FF] font-semibold text-[0.65rem] px-4 py-2 flex justify-center items-center bg-[#4B9CD31A] rounded-full sm:text-sm">
                    No.1 job searching and scholarship getting platform
                </div>
                <h1 id="hero-title" className="text-3xl sm:text-5xl font-semibold text-[#333333] text-center leading-tight sm:leading-[4.5rem] pt-6">
                    Find Your Perfect Opportunity
                    <span className="block">with AI</span>
                </h1>
                <p className="text-sm sm:text-base font-medium text-[#333333CC] pt-4 text-center max-w-xl">
                    Our platform provides the opportunities prospectives all around
                    opportunities worldwide to empower you
                </p>

                <form role="search" aria-label="Job search" className="flex flex-col lg:flex-row items-stretch justify-between w-[90%] lg:w-full max-w-[60rem] mt-8 py-2 lg:px-4 rounded-xl lg:rounded-4xl lg:border lg:border-gray-200 lg:shadow-sm gap-2 lg:gap-4">
                    <div className="flex items-center flex-1 px-4 border border-gray-100 lg:border-none rounded-full bg-white">
                        <label htmlFor="job-search" className="sr-only">Search for jobs</label>
                        <FaSearch className="text-gray-400 mr-2" aria-hidden="true" />
                        <input
                            id="job-search"
                            type="text"
                            placeholder="Job title, Keyword, company"
                            className="w-full bg-transparent focus:outline-none text-sm text-gray-700 py-2"
                        />
                    </div>
                    <div className="hidden lg:block w-px h-8 bg-gray-300 mx-2" aria-hidden="true"></div>

                    <div className="flex items-center flex-1 px-4 border border-gray-100 lg:border-none rounded-full bg-white">
                        <label htmlFor="location-search" className="sr-only">Search location</label>
                        <FaMapMarkerAlt className="text-gray-400 mr-2" aria-hidden="true" />
                        <input
                            id="location-search"
                            type="text"
                            placeholder="City, state, or remote"
                            className="w-full bg-transparent focus:outline-none text-sm text-gray-700 py-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#4B9CD3] text-white text-sm font-medium py-2 px-6 rounded-full transition w-full lg:w-auto"
                        aria-label="Search for jobs"
                    >
                        Search
                    </button>
                </form>

                <p className="font-medium text-[#333333CC] pt-6 text-center">
                    Upload or create a resume to easily apply to job
                </p>

                <h2 className="text-[#3D84FF] font-semibold text-sm px-6 py-2 bg-[#4B9CD31A] rounded-full flex items-center justify-center leading-tight mt-6">
                    collaboration partners
                </h2>

                <div className="bg-[#EDF5FB] mt-6 rounded-3xl w-fit max-w-6xl px-4 sm:px-12 py-8 flex flex-col gap-6 mb-20" aria-label="Partner companies">
                    {images.map((row, i) => (
                        <div key={i} className="flex flex-wrap justify-center gap-4">
                            {row.map((src, idx) => {
                                const companyName = src.split('/').pop()?.replace('.svg', '') || 'company';
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white w-[100px] sm:w-[120px] h-[60px] rounded-lg flex items-center justify-center"
                                    >
                                        <img
                                            src={src}
                                            alt={`${companyName} logo`}
                                            className="max-h-[32px] object-contain"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default Hero;
