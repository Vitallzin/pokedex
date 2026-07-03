import React, { useEffect, useState } from 'react';
import { authService, type User } from '../services/authService';
import { AuthContext } from './authContextValue';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const newUser = await authService.login(email, password);
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const newUser = await authService.loginWithGoogle();
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (nickname: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.register(nickname, email, password);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateUser(userData);
      setUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePasswordWithCurrentPassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await authService.updatePasswordWithCurrentPassword(currentPassword, newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async () => {
    setIsLoading(true);
    try {
      await authService.sendPasswordReset();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginWithGoogle,
      register,
      updateUser,
      updatePasswordWithCurrentPassword,
      sendPasswordReset,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
