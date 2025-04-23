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
      ]]
    return (
        <div className="flex flex-col items-center pt-[3rem]">
            <div className="text-[#3D84FF] font-semibold text-[0.9rem] px-4 py-2 flex justify-center items-center bg-[#4B9CD31A] rounded-full">
                No.1 job searching and scholarship getting platform
            </div>
            <div className="text-[4rem] font-semibold text-[#333333] text-center leading-[4.5rem] pt-[1.5rem]">
                Find Your Perfect Opportunity
                <span className="block">with AI</span>
            </div>
            <div className="text-[1rem] font-medium text-[#333333CC] pt-[1.2rem] text-center max-w-2xl">
                Our platform provides the opportunities prospectives all around
                the world a chance in you
            </div>
            <div className="flex items-center justify-between w-[60rem] mt-8 p-2 rounded-full border border-gray-200 shadow-sm">
                <div className="flex items-center flex-1 px-4">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Job title, Keyword, company"
                        className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
                    />
                </div>
                <div className="w-px h-6 bg-black"></div>
                <div className="flex items-center flex-1 px-4">
                    <FaMapMarkerAlt className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="City, state, or remote"
                        className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
                    />
                </div>
                <button className="ml-4 bg-[#4B9CD3] text-white text-sm font-medium py-2 px-6 rounded-full transition">
                    Search
                </button>
            </div>
            <div className="font-medium text-[#333333CC] pt-[1.2rem]">
                Upload or create a resume to easily apply to job
            </div>
            <div className="text-[#3D84FF] font-semibold text-sm px-6 py-2 bg-[#4B9CD31A] rounded-full flex items-center justify-center leading-tight mt-[1.2rem]">
                collaboration partners
            </div>
            <div className="bg-[#EDF5FB] mt-[1.2rem] rounded-3xl w-fit px-[3rem] py-[2rem] flex flex-col gap-4 mb-[5rem]">
                {images.map((row, i) => (
                <div key={i} className="flex gap-6">
                {row.map((src, idx) => (
                    <div
                    key={idx}
                    className="bg-white w-[120px] h-[60px] rounded-lg flex items-center justify-center"
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
