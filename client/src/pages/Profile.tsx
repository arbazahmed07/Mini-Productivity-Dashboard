import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileForm from '../components/ProfileForm';
import { Link } from 'react-router-dom';

// Local fallback image as data URI - a simple user icon with gray background
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0' width='150' height='150'%3E%3Crect width='24' height='24' fill='%23e2e8f0' rx='12' /%3E%3Cpath d='M12 14.25c2.485 0 4.5-2.015 4.5-4.5S14.485 5.25 12 5.25s-4.5 2.015-4.5 4.5 2.015 4.5 4.5 4.5zm0 2.25c-3 0-9 1.508-9 4.5V19.5h18v-1.5c0-2.992-6-4.5-9-4.5z' fill='%236b7280'/%3E%3C/svg%3E";

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);
  
  // Reset image error state when user changes
  React.useEffect(() => {
    setImageError(false);
  }, [user?.profile?.avatarUrl]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="text-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
          <p className="mb-4 text-lg md:text-xl">You need to be logged in to view this page</p>
          <Link to="/login" className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Go to login page
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mb-10">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Your Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-6">
          <div className="flex-shrink-0 mb-4 sm:mb-0 flex justify-center">
            <img
              src={imageError ? DEFAULT_AVATAR : (user?.profile?.avatarUrl || DEFAULT_AVATAR)}
              alt={user?.name || 'User'}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
              onError={(e) => {
                console.log('Image failed to load, using fallback');
                setImageError(true);
              }}
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-500">{user?.profile?.jobTitle || 'No job title set'}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>
        
        {user?.profile?.bio && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">About</h3>
            <p className="text-gray-700 dark:text-gray-300">{user.profile.bio}</p>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Edit Profile</h2>
        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;
