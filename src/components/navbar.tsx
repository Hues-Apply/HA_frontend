import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        // Clean up event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`bg-white w-full ${scrolled ? 'shadow-sm' : ''} fixed top-0 left-0 z-50 transition-shadow duration-300`} aria-label="Main navigation">
            <div className="flex justify-between items-center py-4 px-4 md:px-8">
                <Link to="/" className="text-[#4B9CD3] font-semibold text-2xl" aria-label="Hues Apply Home">
                    HUES APPLY
                </Link>

                <div className="hidden lg:flex text-[#333333] font-semibold text-[1rem] items-center gap-6" role="navigation" aria-label="Desktop menu">
                    <Link
                        to="/"
                        className="hover:text-[#4B9CD3] hover:bg-[#4B9CD31A] px-4 py-2 rounded-full transition"
                    >
                        Home
                    </Link>
                    <Link
                        to="/#about"
                        className="hover:text-[#4B9CD3] hover:bg-[#4B9CD31A] px-4 py-2 rounded-full transition"
                    >
                        About us
                    </Link>
                    <Link
                        to="/dashboard"
                        className="hover:text-[#4B9CD3] hover:bg-[#4B9CD31A] px-4 py-2 rounded-full transition"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/#services"
                        className="hover:text-[#4B9CD3] hover:bg-[#4B9CD31A] px-4 py-2 rounded-full transition"
                    >
                        Services
                    </Link>
                    <Link
                        to="/#contact"
                        className="hover:text-[#4B9CD3] hover:bg-[#4B9CD31A] px-4 py-2 rounded-full transition"
                    >
                        Contact
                    </Link>
                </div>

                <div className="hidden lg:flex items-center gap-4 font-semibold text-[1rem] text-[#333333]">
                    <Link to="/login" className="px-6 py-2 rounded-full border border-gray-100">
                        Login
                    </Link>
                    <Link to="/signup" className="px-6 py-2 bg-[#4B9CD3] text-white rounded-full text-sm transition">
                        Register
                    </Link>
                </div>

                <div className="lg:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-2xl text-[#4B9CD3] p-2"
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        {isOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
                    </button>
                </div>
            </div>

            
            {isOpen && (
                <div 
                    id="mobile-menu" 
                    className="lg:hidden bg-white border-t border-gray-200 px-4 py-4 flex flex-col gap-4 text-[#333333] font-semibold"
                    role="navigation"
                    aria-label="Mobile menu"
                >
                    <Link to="/" className="hover:text-[#4B9CD3] py-2">
                        Home
                    </Link>
                    <Link to="/#about" className="hover:text-[#4B9CD3] py-2">
                        About us
                    </Link>
                    <Link to="/dashboard" className="hover:text-[#4B9CD3] py-2">
                        Dashboard
                    </Link>
                    <Link to="/#services" className="hover:text-[#4B9CD3] py-2">
                        Services
                    </Link>
                    <Link to="/#contact" className="hover:text-[#4B9CD3] py-2">
                        Contact
                    </Link>
                    <div className="flex flex-col gap-2 pt-2">
                        <Link to="/login" className="w-full px-4 py-2 border border-gray-300 rounded-full text-center">
                            Login
                        </Link>
                        <Link to="/signup" className="w-full px-4 py-2 bg-[#4B9CD3] text-white rounded-full text-sm text-center">
                            Register
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
