import React from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

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
        <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-[8rem]">
            <div className="text-[#3D84FF] font-semibold text-[0.65rem] px-4 py-2 flex justify-center items-center bg-[#4B9CD31A] rounded-full sm:text-sm">
                No.1 job searching and scholarship getting platform
            </div>
            <div className="text-3xl sm:text-5xl font-semibold text-[#333333] text-center leading-tight sm:leading-[4.5rem] pt-6">
                Find Your Perfect Opportunity
                <span className="block">with AI</span>
            </div>
            <div className="text-sm sm:text-base font-medium text-[#333333CC] pt-4 text-center max-w-xl">
                Our platform provides the opportunities prospectives all around
                the world a chance in you
            </div>

            <div className="flex flex-col lg:flex-row items-stretch justify-between w-full max-w-[60rem] mt-8 p-2 rounded-2xl border border-gray-200 shadow-sm gap-4">
                <div className="flex items-center flex-1 px-4 border border-gray-100 lg:border-none rounded-full bg-white">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Job title, Keyword, company"
                        className="w-full bg-transparent focus:outline-none text-sm text-gray-700 py-2"
                    />
                </div>
                <div className="flex items-center flex-1 px-4 border border-gray-100 lg:border-none rounded-full bg-white">
                    <FaMapMarkerAlt className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="City, state, or remote"
                        className="w-full bg-transparent focus:outline-none text-sm text-gray-700 py-2"
                    />
                </div>
                <button className="bg-[#4B9CD3] text-white text-sm font-medium py-2 px-6 rounded-full transition w-full lg:w-auto">
                    Search
                </button>
            </div>

            <div className="font-medium text-[#333333CC] pt-6 text-center">
                Upload or create a resume to easily apply to job
            </div>
            <div className="text-[#3D84FF] font-semibold text-sm px-6 py-2 bg-[#4B9CD31A] rounded-full flex items-center justify-center leading-tight mt-6">
                collaboration partners
            </div>

            <div className="bg-[#EDF5FB] mt-6 rounded-3xl w-full max-w-6xl px-4 sm:px-12 py-8 flex flex-col gap-6 mb-20">
                {images.map((row, i) => (
                    <div key={i} className="flex flex-wrap justify-center gap-4">
                        {row.map((src, idx) => (
                            <div
                                key={idx}
                                className="bg-white w-[100px] sm:w-[120px] h-[60px] rounded-lg flex items-center justify-center"
                            >
                                <img src={src} alt="partner-logo" className="max-h-[32px] object-contain" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hero;
