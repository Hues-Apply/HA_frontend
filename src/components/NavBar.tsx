import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

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

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (isOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (showUserMenu && !target.closest('.user-menu')) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    return (
        <nav className={`bg-white w-full ${scrolled ? 'shadow-sm' : ''} fixed top-0 left-0 z-30 transition-shadow duration-300`} aria-label="Main navigation">
            <div className="flex justify-between items-center py-4 px-4 md:px-8">
                <Link to="/" className="text-[#4B9CD3] font-semibold text-2xl flex items-center" aria-label="Hues Apply Home">
                    <img
                        src={"./hero/hues_apply_logo.svg"}
                        alt="Hues Apply"
                        className="h-16 w-auto md:h-20"
                    />
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
                    {isAuthenticated && (
                        <Link
                            to="/dashboard"
                            className="hover:text-[#4B9CD3] hover:bg-[#4B9CD31A] px-4 py-2 rounded-full transition"
                        >
                            Dashboard
                        </Link>
                    )}
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
                    {isAuthenticated ? (
                        <div className="relative user-menu">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100"
                                aria-expanded={showUserMenu}
                                aria-haspopup="true"
                                aria-label="User menu"
                            >
                                {user?.google_data?.picture ? (
                                    <img
                                        src={user.google_data.picture}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <FaUserCircle className="text-2xl text-gray-600" />
                                )}
                                <span>{user?.first_name || 'User'}</span>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40 border border-gray-200">
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setShowUserMenu(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="px-6 py-2 rounded-full border border-gray-100 hover:bg-gray-50 transition">
                                Login
                            </Link>
                            <Link to="/signup" className="px-6 py-2 bg-[#4B9CD3] text-white rounded-full text-sm transition hover:bg-[#3a8bc0]">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <div className="lg:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="mobile-menu-button text-2xl text-[#4B9CD3] p-2 hover:bg-gray-100 rounded-lg transition"
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        {isOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-35 lg:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {isOpen && (
                <div
                    id="mobile-menu"
                    className="mobile-menu lg:hidden bg-white border-t border-gray-200 px-4 py-4 flex flex-col gap-4 text-[#333333] font-semibold z-40 relative"
                    role="navigation"
                    aria-label="Mobile menu"
                >
                    <Link to="/" className="hover:text-[#4B9CD3] py-2 transition" onClick={() => setIsOpen(false)}>
                        Home
                    </Link>
                    <Link to="/#about" className="hover:text-[#4B9CD3] py-2 transition" onClick={() => setIsOpen(false)}>
                        About us
                    </Link>
                    {isAuthenticated && (
                        <Link to="/dashboard" className="hover:text-[#4B9CD3] py-2 transition" onClick={() => setIsOpen(false)}>
                            Dashboard
                        </Link>
                    )}
                    <Link to="/#services" className="hover:text-[#4B9CD3] py-2 transition" onClick={() => setIsOpen(false)}>
                        Services
                    </Link>
                    <Link to="/#contact" className="hover:text-[#4B9CD3] py-2 transition" onClick={() => setIsOpen(false)}>
                        Contact
                    </Link>

                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2 px-4 py-2">
                                    {user?.google_data?.picture ? (
                                        <img
                                            src={user.google_data.picture}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <FaUserCircle className="text-2xl text-gray-600" />
                                    )}
                                    <span className="font-medium">{user?.first_name || 'User'}</span>
                                </div>
                                <Link to="/profile" className="w-full px-4 py-2 border border-gray-300 rounded-full text-center hover:bg-gray-50 transition" onClick={() => setIsOpen(false)}>
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm text-center hover:bg-gray-200 transition"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="w-full px-4 py-2 border border-gray-300 rounded-full text-center hover:bg-gray-50 transition" onClick={() => setIsOpen(false)}>
                                    Login
                                </Link>
                                <Link to="/signup" className="w-full px-4 py-2 bg-[#4B9CD3] text-white rounded-full text-sm text-center hover:bg-[#3a8bc0] transition" onClick={() => setIsOpen(false)}>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
