import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Update API URL to match the new domain
const API_URL = 'http://localhost:5000/api';
// const API_URL = 'https://mini-productivity-dashboard-1.onrender.com/api';

interface Profile {
  bio: string;
  avatarUrl: string;
  jobTitle: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  profile?: Profile;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  updateProfile: (profileData: Partial<Profile & { name?: string }>) => Promise<boolean>;
  getProfile: () => Promise<User | null>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('boostboard_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from stored token
  useEffect(() => {
    const token = localStorage.getItem('boostboard_token');
    if (token && !user) {
      getProfile().catch(() => logout());
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Login failed:', response.status, data);
        setError(data.message || `Login failed with status: ${response.status}`);
        return false;
      }

      // Make sure we have the expected data
      if (!data.token || !data.user) {
        console.error('Invalid server response:', data);
        setError('Server returned an invalid response');
        return false;
      }

      // Transform MongoDB _id to id if needed
      const userData: User = {
        id: data.user._id || data.user.id,
        name: data.user.name,
        email: data.user.email,
        profile: data.user.profile
      };

      setUser(userData);
      localStorage.setItem('boostboard_user', JSON.stringify(userData));
      localStorage.setItem('boostboard_token', data.token);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return false;
      }

      // Transform MongoDB _id to id if needed
      const userData: User = {
        id: data.user._id || data.user.id,
        name: data.user.name,
        email: data.user.email,
        profile: data.user.profile
      };

      setUser(userData);
      localStorage.setItem('boostboard_user', JSON.stringify(userData));
      localStorage.setItem('boostboard_token', data.token);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async (): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('boostboard_token');
      if (!token) {
        setError('Not authenticated');
        return null;
      }
      
      const response = await fetch(`${API_URL}/profile/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Failed to fetch profile');
        return null;
      }

      // Transform MongoDB _id to id if needed
      const userData: User = {
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        profile: data.profile
      };

      setUser(userData);
      localStorage.setItem('boostboard_user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Get profile error:', error);
      setError('Network error. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<Profile & { name?: string }>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('boostboard_token');
      if (!token) {
        setError('Not authenticated');
        return false;
      }
      
      // Use the correct endpoint path that matches the server route
      const response = await fetch(`${API_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `Failed to update profile: ${response.status} ${response.statusText}`;
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const data = await response.json();
            errorMessage = data.message || errorMessage;
          } catch (e) {
            console.error('Failed to parse error response as JSON', e);
          }
        } else {
          // For non-JSON responses (e.g. HTML error pages)
          const text = await response.text();
          console.error('Server returned non-JSON response:', text.substring(0, 200) + '...');
        }
        
        setError(errorMessage);
        return false;
      }

      const data = await response.json();
      
      // Transform MongoDB _id to id if needed
      const userData: User = {
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        profile: data.profile
      };

      setUser(userData);
      localStorage.setItem('boostboard_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error instanceof Error ? error.message : 'Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };
    
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('boostboard_token');
    localStorage.removeItem('boostboard_user');
  };
    
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        isAuthenticated: !!user, 
        loading,
        updateProfile,
        getProfile,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};