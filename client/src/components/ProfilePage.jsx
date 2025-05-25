import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, isAuthenticated, loading, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    jobTitle: '',
    avatarUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.profile?.bio || '',
        jobTitle: user.profile?.jobTitle || '',
        avatarUrl: user.profile?.avatarUrl || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      const success = await updateProfile(profileData);
      if (success) {
        setIsEditing(false);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating profile.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Show loading state
  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  // Show dummy content for non-authenticated users
  if (!isAuthenticated || !user) {
    return (
      <div className="text-center p-5">
        <h2>Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={profileData.jobTitle}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="4"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Avatar URL</label>
            <input
              type="text"
              name="avatarUrl"
              value={profileData.avatarUrl}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white shadow-md rounded p-6">
          {profileData.avatarUrl && (
            <div className="flex justify-center mb-4">
              <img 
                src={profileData.avatarUrl} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}
          
          <h2 className="text-xl font-bold">{profileData.name}</h2>
          
          {profileData.jobTitle && (
            <p className="text-gray-600 mb-4">{profileData.jobTitle}</p>
          )}
          
          {profileData.bio && (
            <div className="mb-4">
              <h3 className="font-medium mb-1">About</h3>
              <p className="text-gray-700">{profileData.bio}</p>
            </div>
          )}
          
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
