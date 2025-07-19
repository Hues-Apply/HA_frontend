import React from 'react';
import { Bell, Mail, User } from 'lucide-react';
import { useProfileData } from '../hooks/useProfileData';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { profileData } = useProfileData();
  const { user } = useAuth();

  const profilePic = user?.google_data?.picture || profileData?.profile_picture || '/hero/userprofile.svg';

  return (
    <div className="w-full bg-white py-5 px-4 md:px-6 flex items-center justify-end gap-8 shadow-sm z-40">
      <button aria-label="Messages">
        <Mail className="w-5 h-5 text-gray-600" />
      </button>
      <button aria-label="Notifications">
        <Bell className="w-5 h-5 text-gray-700" />
      </button>

      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-gray-500" />
        )}
      </div>
    </div>
  );
};

export default Header;
