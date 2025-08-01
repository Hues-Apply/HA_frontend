import React from 'react';
import SocialIcon from '../components/SocialIcon';
import FooterLinkSection from '../components/FooterLinkSection';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100" role="contentinfo">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Company Description */}
          <div className="col-span-1 lg:col-span-1">
            <h2 className="text-[#4B9CD3] font-semibold text-2xl mb-4">Hues Apply</h2>
            <p className="text-gray-600 text-sm mb-6">
              Hues Apply simplifies the process of discovering and applying for scholarships,
              fellowships, jobs, and more. We aim to democratize access to global
              opportunities with tailored matching and expert support.
            </p>
            <div className="flex space-x-1" aria-label="Social media links">
              <SocialIcon href="https://twitter.com/huesapply" ariaLabel="Follow us on Twitter">
                <FaTwitter size={20} aria-hidden="true" />
              </SocialIcon>
              <SocialIcon href="https://facebook.com/huesapply" ariaLabel="Follow us on Facebook">
                <FaFacebookF size={20} aria-hidden="true" />
              </SocialIcon>
              <SocialIcon href="https://instagram.com/huesapply" ariaLabel="Follow us on Instagram">
                <FaInstagram size={20} aria-hidden="true" />
              </SocialIcon>
              <SocialIcon href="https://linkedin.com/company/huesapply" ariaLabel="Follow us on LinkedIn">
                <FaLinkedinIn size={20} aria-hidden="true" />
              </SocialIcon>
            </div>
          </div>

          {/* Useful Links */}
          <nav aria-label="Useful links navigation">
            <FooterLinkSection title="USEFUL LINKS" id="useful-links">
              <a href="#" className="text-gray-600 hover:text-[#4B9CD3] text-sm focus:outline-none focus:underline">Home</a>
              <a href="#" className="text-gray-600 hover:text-[#4B9CD3] text-sm focus:outline-none focus:underline">About</a>
              <a href="#" className="text-gray-600 hover:text-[#4B9CD3] text-sm focus:outline-none focus:underline">Services</a>
              <a href="#" className="text-gray-600 hover:text-[#4B9CD3] text-sm focus:outline-none focus:underline">FAQ</a>
              <a href="#" className="text-gray-600 hover:text-[#4B9CD3] text-sm focus:outline-none focus:underline">Contact</a>
            </FooterLinkSection>
          </nav>

          {/* Our Services */}
          <nav aria-label="Services navigation">
            <FooterLinkSection title="OUR SERVICES" id="our-services">
              <a href="#" className="text-gray-600 hover:text-[#4B9CD3] text-sm focus:outline-none focus:underline">Opportunity Matching</a>
              <a href="#" className="text-gray-600 hover:text-[#4B9CD3] text-sm focus:outline-none focus:underline">Document Assistance</a>
              <a href="#" className="text-gray-600 hover:text-[#4B9CD3] text-sm focus:outline-none focus:underline">Expert Support</a>
              <a href="#" className="text-gray-600 hover:text-[#4B9CD3] text-sm focus:outline-none focus:underline">AI generated application essays</a>
              <a href="#" className="text-gray-600 hover:text-[#4B9CD3] text-sm focus:outline-none focus:underline">Resource library</a>
            </FooterLinkSection>
          </nav>

          {/* Contact Us */}
          <div>
            <FooterLinkSection title="CONTACT US" id="contact-us">
              <p className="text-gray-600 text-sm">
                <strong>Phone:</strong> <a href="tel:+27607340652" className="hover:text-[#4B9CD3] focus:outline-none focus:underline">+27 60 734 0652</a>
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Email:</strong> <a href="mailto:hello@huesapply.com" className="hover:text-[#4B9CD3] focus:outline-none focus:underline">hello@huesapply.com</a>
              </p>
            </FooterLinkSection>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            © Copyright 2025, All Rights Reserved by Hues Apply
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
