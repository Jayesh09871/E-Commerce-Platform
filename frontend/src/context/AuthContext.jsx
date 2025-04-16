import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Initialize Google OAuth client
    // This will be implemented when backend provides OAuth configuration
    setLoading(false);
  }, []);

  const signIn = async () => {
    try {
      // TODO: Implement Google OAuth sign-in
      // For now, using mock data
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        picture: 'https://placehold.co/100x100'
      };
      setUser(mockUser);
      return mockUser;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // TODO: Implement Google OAuth sign-out
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};