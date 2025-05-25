import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileFormProps {
  onSuccess?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const { user, updateProfile, loading, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.profile?.bio || '',
    jobTitle: user?.profile?.jobTitle || '',
    avatarUrl: user?.profile?.avatarUrl || ''
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.profile?.bio || '',
        jobTitle: user.profile?.jobTitle || '',
        avatarUrl: user.profile?.avatarUrl || ''
      });
    }
  }, [user]);
  
  // Reset form messages when auth error changes
  useEffect(() => {
    if (authError && isSubmitting) {
      setError(authError);
      setIsSubmitting(false);
    }
  }, [authError, isSubmitting]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
    
    // Clear messages when user starts typing
    if (message || error) {
      setMessage('');
      setError('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    
    const success = await updateProfile({
      name: formData.name,
      bio: formData.bio,
      jobTitle: formData.jobTitle,
      avatarUrl: formData.avatarUrl
    });
    
    setIsSubmitting(false);
    
    if (success) {
      setMessage('Profile updated successfully!');
      if (onSuccess) onSuccess();
    } else {
      setError(authError || 'Failed to update profile. Please try again.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Job Title</label>
        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
          placeholder="Your position"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
          rows={3}
          placeholder="Tell us about yourself"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Profile Image URL</label>
        <input
          type="text"
          name="avatarUrl"
          value={formData.avatarUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>
      
      {formData.avatarUrl && (
        <div className="flex justify-center">
          <img 
            src={formData.avatarUrl} 
            alt="Profile Preview" 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
            }}
          />
        </div>
      )}
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}
      
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex justify-center items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={loading || isSubmitting}
      >
        {loading || isSubmitting ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Saving...</span>
          </>
        ) : (
          <span>Save Profile</span>
        )}
      </button>
    </form>
  );
};

export default ProfileForm;
