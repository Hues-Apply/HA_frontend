import React from 'react';

interface SocialIconProps {
  href: string;
  children: React.ReactNode;
  ariaLabel: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, children, ariaLabel }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-gray-600 hover:text-[#4B9CD3] transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4B9CD3]"
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
};

export default SocialIcon;
